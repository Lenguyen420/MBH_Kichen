import { useState } from 'react'
import { importReceiverAreaOptions } from '../../datas/mealFlowData'
import {
  formatDateTimeWithPeriod,
  inputClass,
  textareaClass,
} from '../../page/mealFlowUtils'

function MealInventoryEditForm({ row, onCancel, onSubmit }) {
  const [formValue, setFormValue] = useState({
    quantity: row.quantity || row.importedQuantity || 0,
    importedAt: row.importedAt || '',
    importedBy: row.importedBy || '',
    receiverArea: row.receiverArea || importReceiverAreaOptions[0],
    note: row.note || '',
  })

  function handleChange(event) {
    const { name, value } = event.target

    setFormValue((currentValue) => ({
      ...currentValue,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    onSubmit({
      ...row,
      ...formValue,
      quantity: Number(formValue.quantity || 0),
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
        <p className="text-sm font-bold text-blue-700">{row.dish?.name}</p>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Mẻ {row.batchCode} - đã xuất ròng {row.exportedQuantity} {row.dish?.unit}
        </p>
      </div>

      {row.cancelInfo ? (
        <div className="rounded-xl border border-red-100 bg-red-50/70 p-4">
          <p className="text-sm font-bold text-red-700">Thông tin hủy</p>
          <div className="mt-3 grid gap-3 text-sm font-medium text-slate-700 md:grid-cols-2">
            <p>
              Ngày giờ hủy:{' '}
              <span className="font-bold text-slate-950">
                {formatDateTimeWithPeriod(row.cancelInfo.canceledAt)}
              </span>
            </p>
            <p>
              Nhân viên hủy:{' '}
              <span className="font-bold text-slate-950">
                {row.cancelInfo.canceledBy || '--'}
              </span>
            </p>
            <p>
              Số lượng hủy:{' '}
              <span className="font-bold text-slate-950">
                {row.cancelInfo.quantity} {row.dish?.unit}
              </span>
            </p>
            <p className="md:col-span-2">
              Lý do:{' '}
              <span className="font-bold text-slate-950">
                {row.cancelInfo.reason || '--'}
              </span>
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Số lượng nhập</span>
          <input className={inputClass} min={Math.max(row.exportedQuantity, 0)} name="quantity" type="number" value={formValue.quantity} onChange={handleChange} />
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
          <textarea className={textareaClass} name="note" value={formValue.note} onChange={handleChange} />
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-blue-100 pt-5">
        <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50" type="button" onClick={onCancel}>Hủy</button>
        <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700" type="submit">Lưu chỉnh sửa</button>
      </div>
    </form>
  )
}

export default MealInventoryEditForm
