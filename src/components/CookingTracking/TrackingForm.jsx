import { useState } from 'react'

function toTimeValue(value) {
  if (!value) {
    return ''
  }

  if (value.includes('T')) {
    return value.split('T')[1]?.slice(0, 5) || ''
  }

  return value
}

function TrackingForm({ mode, row, onCancel, onSubmit }) {
  const isViewMode = mode === 'view'
  const isCompleteMode = mode === 'complete'
  const [formValue, setFormValue] = useState({
    cookingQuantity: row.cookingQuantity || row.plannedQuantity,
    actualQuantity: row.actualQuantity || row.cookingQuantity || row.plannedQuantity,
    startedAt: row.startedAt || '',
    completedAt: toTimeValue(row.completedAt),
    issueNote: row.issueNote || '',
    note: row.note || '',
    imageName: row.imageName || row.imageUrl || '',
  })

  function handleChange(event) {
    const { name, value } = event.target

    setFormValue((currentValue) => ({
      ...currentValue,
      [name]: value,
    }))
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]

    setFormValue((currentValue) => ({
      ...currentValue,
      imageName: file?.name || '',
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    onSubmit({
      ...row,
      ...formValue,
      cookingQuantity: Number(formValue.cookingQuantity),
      actualQuantity: Number(formValue.actualQuantity),
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
        <p className="text-sm font-bold text-blue-700">{row.dish?.name}</p>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Kế hoạch: {row.plannedQuantity} {row.dish?.unit} - Phụ trách: {row.staff}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Số lượng đang làm</span>
          <input className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400" min="0" name="cookingQuantity" type="number" value={formValue.cookingQuantity} disabled={isViewMode || isCompleteMode} onChange={handleChange} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Số lượng hoàn thành</span>
          <input className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400" min="0" name="actualQuantity" type="number" value={formValue.actualQuantity} disabled={isViewMode || !isCompleteMode} onChange={handleChange} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Thời gian bắt đầu</span>
          <input className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400" name="startedAt" type="time" value={formValue.startedAt} disabled={isViewMode} onChange={handleChange} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Thời gian hoàn thành</span>
          <input className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400" name="completedAt" type="time" value={formValue.completedAt} disabled={isViewMode} onChange={handleChange} />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-bold text-slate-700">Báo lỗi / món hỏng</span>
          <textarea className="min-h-20 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-3 text-sm font-semibold outline-none focus:border-blue-400" name="issueNote" placeholder="Ví dụ: Hỏng 5 suất do khay bị đổ" value={formValue.issueNote} disabled={isViewMode} onChange={handleChange} />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-bold text-slate-700">Ảnh món hoàn thành</span>
          <input className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-2 text-sm font-semibold outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white focus:border-blue-400" name="imageFile" type="file" accept="image/*" disabled={isViewMode} onChange={handleFileChange} />
          {formValue.imageName ? (
            <p className="text-xs font-bold text-blue-700">
              Đã chọn: {formValue.imageName}
            </p>
          ) : null}
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-bold text-slate-700">Ghi chú</span>
          <textarea className="min-h-20 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-3 text-sm font-semibold outline-none focus:border-blue-400" name="note" placeholder="Ghi chú trong quá trình chế biến" value={formValue.note} disabled={isViewMode} onChange={handleChange} />
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-blue-100 pt-5">
        <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50" type="button" onClick={onCancel}>
          {isViewMode ? 'Đóng' : 'Hủy'}
        </button>
        {!isViewMode ? (
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700" type="submit">
            Lưu cập nhật
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default TrackingForm
