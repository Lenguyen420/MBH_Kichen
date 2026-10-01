import { useState } from 'react'
import { receiverAreaOptions } from '../../datas/mealFlowData'
import {
  getCurrentDateTime,
  inputClass,
  textareaClass,
} from '../../page/mealFlowUtils'

function MealExportForm({ inventoryRows, exportRow, onCancel, onSubmit }) {
  const firstSource = inventoryRows[0]
  const [formValue, setFormValue] = useState({
    importId: exportRow?.importId || firstSource?.id || '',
    quantity: exportRow?.quantity || firstSource?.remainingQuantity || 0,
    receiverPlace: exportRow?.receiverPlace || receiverAreaOptions[0],
    deliveredBy: exportRow?.deliveredBy || 'Nhân viên bếp',
    receivedBy: exportRow?.receivedBy || '',
    exportedAt: exportRow?.exportedAt || getCurrentDateTime(),
    note: exportRow?.note || '',
  })
  const selectedSource = inventoryRows.find((item) => item.id === formValue.importId)

  function handleChange(event) {
    const { name, value } = event.target

    setFormValue((currentValue) => ({
      ...currentValue,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const quantity = Math.min(
      Number(formValue.quantity || 0),
      selectedSource?.remainingQuantity || 0,
    )

    onSubmit({
      ...formValue,
      quantity,
      sourceRow: selectedSource,
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="space-y-2">
        <span className="text-sm font-bold text-slate-700">Nguồn mẻ</span>
        <select className={inputClass} name="importId" value={formValue.importId} onChange={handleChange}>
          {inventoryRows.map((item) => (
            <option key={item.id} value={item.id}>
              {item.dish?.name} - {item.batchCode} - còn {item.remainingQuantity} {item.dish?.unit}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Số lượng xuất</span>
          <input className={inputClass} min="1" max={selectedSource?.remainingQuantity || 0} name="quantity" type="number" value={formValue.quantity} onChange={handleChange} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Thời gian xuất</span>
          <input className={inputClass} name="exportedAt" type="datetime-local" value={formValue.exportedAt} onChange={handleChange} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Nơi nhận</span>
          <select className={inputClass} name="receiverPlace" value={formValue.receiverPlace} onChange={handleChange}>
            {receiverAreaOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Người giao</span>
          <input className={inputClass} name="deliveredBy" value={formValue.deliveredBy} onChange={handleChange} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Người nhận</span>
          <input className={inputClass} name="receivedBy" value={formValue.receivedBy} onChange={handleChange} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-bold text-slate-700">Ghi chú</span>
          <textarea className={textareaClass} name="note" value={formValue.note} onChange={handleChange} />
        </label>
      </div>
      <div className="flex justify-end gap-3 border-t border-blue-100 pt-5">
        <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50" type="button" onClick={onCancel}>Hủy</button>
        <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700" type="submit">Lưu phiếu xuất</button>
      </div>
    </form>
  )
}

export default MealExportForm
