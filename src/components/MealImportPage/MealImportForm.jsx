import { useState } from 'react'
import { importReceiverAreaOptions } from '../../datas/mealFlowData'
import {
  getCurrentDateTime,
  inputClass,
  textareaClass,
} from '../../page/mealFlowUtils'

function MealImportForm({ candidates, importRow, onCancel, onSubmit }) {
  const firstCandidate = candidates[0]
  const [formValue, setFormValue] = useState({
    sourceKey: importRow?.planId || firstCandidate?.planId || '',
    quantity: importRow?.quantity || firstCandidate?.availableQuantity || 0,
    importedAt: importRow?.importedAt || getCurrentDateTime(),
    importedBy: importRow?.importedBy || '',
    receiverArea: importRow?.receiverArea || importReceiverAreaOptions[0],
    note: importRow?.note || '',
  })

  const selectedCandidate = candidates.find(
    (item) => item.planId === formValue.sourceKey,
  )
  const maxQuantity =
    (selectedCandidate?.availableQuantity || 0) + (importRow?.quantity || 0)

  function handleChange(event) {
    const { name, value } = event.target

    setFormValue((currentValue) => ({
      ...currentValue,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const quantity = Math.min(Number(formValue.quantity || 0), maxQuantity)

    onSubmit({
      ...importRow,
      ...formValue,
      quantity,
      sourceRow: selectedCandidate,
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="space-y-2">
        <span className="text-sm font-bold text-slate-700">Món đã hoàn thành</span>
        <select className={inputClass} name="sourceKey" value={formValue.sourceKey} disabled={Boolean(importRow)} onChange={handleChange}>
          {candidates.map((item) => (
            <option key={item.planId} value={item.planId}>
              {item.dish?.name} - còn có thể nhập {item.availableQuantity} {item.dish?.unit}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Số lượng hoàn thành nhập kho</span>
          <input className={inputClass} min="1" max={maxQuantity} name="quantity" type="number" value={formValue.quantity} onChange={handleChange} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Thời gian nhập</span>
          <input className={inputClass} name="importedAt" type="datetime-local" value={formValue.importedAt} onChange={handleChange} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Người nhập</span>
          <input className={inputClass} name="importedBy" placeholder="Nhập tên nhân viên nhập món" value={formValue.importedBy} onChange={handleChange} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Khu vực nhận</span>
          <select className={inputClass} name="receiverArea" value={formValue.receiverArea} onChange={handleChange}>
            {importReceiverAreaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-bold text-slate-700">Ghi chú</span>
          <textarea className={textareaClass} name="note" placeholder="Ví dụ: nhập một phần trước, phần còn lại giữ nóng tại bếp" value={formValue.note} onChange={handleChange} />
        </label>
      </div>
      <div className="flex justify-end gap-3 border-t border-blue-100 pt-5">
        <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50" type="button" onClick={onCancel}>Hủy</button>
        <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700" type="submit">Lưu phiếu nhập</button>
      </div>
    </form>
  )
}

export default MealImportForm
