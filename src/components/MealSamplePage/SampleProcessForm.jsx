import { useState } from 'react'
import {
  getCurrentDateTime,
  inputClass,
} from '../../page/mealFlowUtils'

function SampleProcessForm({ row, onCancel, onSubmit }) {
  const [formValue, setFormValue] = useState({
    processedAt: getCurrentDateTime(),
    processedBy: '',
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
      id: row.id,
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
        <p className="text-sm font-bold text-emerald-700">{row.dish?.name}</p>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Mẻ {row.batchCode} - vị trí {row.storageLocation}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Thời gian xử lý</span>
          <input className={inputClass} name="processedAt" type="datetime-local" required value={formValue.processedAt} onChange={handleChange} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Người thực hiện</span>
          <input className={inputClass} name="processedBy" required value={formValue.processedBy} onChange={handleChange} />
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-blue-100 pt-5">
        <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50" type="button" onClick={onCancel}>Đóng</button>
        <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700" type="submit">Xác nhận xử lý</button>
      </div>
    </form>
  )
}

export default SampleProcessForm
