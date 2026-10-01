import { useState } from 'react'
import {
  getCurrentDateTime,
  inputClass,
  textareaClass,
} from '../../page/mealFlowUtils'

function MealCancelForm({ row, onCancel, onSubmit }) {
  const [formValue, setFormValue] = useState({
    canceledAt: getCurrentDateTime(),
    canceledBy: '',
    reason: '',
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
      ...formValue,
      sourceRow: row,
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-xl border border-red-100 bg-red-50/70 p-4">
        <p className="text-sm font-bold text-red-700">{row.dish?.name}</p>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Mẻ {row.batchCode} - sẽ hủy {Math.max(row.remainingQuantity, 0)} {row.dish?.unit}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Ngày giờ hủy</span>
          <input className={inputClass} name="canceledAt" type="datetime-local" required value={formValue.canceledAt} onChange={handleChange} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Nhân viên hủy</span>
          <input className={inputClass} name="canceledBy" placeholder="Nhập tên nhân viên hủy món" required value={formValue.canceledBy} onChange={handleChange} />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-bold text-slate-700">Lý do hủy</span>
          <textarea
            className={textareaClass}
            name="reason"
            placeholder="Ví dụ: quá thời gian sử dụng, món không đạt cảm quan, còn thừa cuối ca"
            required
            value={formValue.reason}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-blue-100 pt-5">
        <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50" type="button" onClick={onCancel}>Đóng</button>
        <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700" type="submit">Xác nhận hủy</button>
      </div>
    </form>
  )
}

export default MealCancelForm
