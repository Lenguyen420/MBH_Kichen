import { useState } from 'react'
import { cancelSourceOptions } from '../../datas/mealFlowData'
import {
  getCurrentDateTime,
  inputClass,
  textareaClass,
} from '../../page/mealFlowUtils'

function MealCancelForm({ row, onCancel, onSubmit }) {
  const [formValue, setFormValue] = useState({
    quantity: Math.max(row.remainingQuantity, 0),
    cancelSource: cancelSourceOptions[0],
    canceledAt: getCurrentDateTime(),
    canceledBy: '',
    confirmedBy: '',
    reason: '',
    imageUrl: '',
    imageName: '',
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

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setFormValue((currentValue) => ({
        ...currentValue,
        imageName: file.name,
        imageUrl: String(reader.result || ''),
      }))
    }
    reader.readAsDataURL(file)
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
          <span className="text-sm font-bold text-slate-700">Số lượng hủy</span>
          <input className={inputClass} min="1" max={Math.max(row.remainingQuantity, 0)} name="quantity" type="number" required value={formValue.quantity} onChange={handleChange} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Nguồn hủy</span>
          <select className={inputClass} name="cancelSource" value={formValue.cancelSource} onChange={handleChange}>
            {cancelSourceOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Ngày giờ hủy</span>
          <input className={inputClass} name="canceledAt" type="datetime-local" required value={formValue.canceledAt} onChange={handleChange} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Nhân viên hủy</span>
          <input className={inputClass} name="canceledBy" placeholder="Nhập tên nhân viên hủy món" required value={formValue.canceledBy} onChange={handleChange} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Người xác nhận</span>
          <input className={inputClass} name="confirmedBy" placeholder="Nhập tên người xác nhận" required value={formValue.confirmedBy} onChange={handleChange} />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-bold text-slate-700">Hình ảnh</span>
          <input
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-2 text-sm font-semibold outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-red-600 file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white focus:border-blue-400"
            name="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {formValue.imageUrl ? (
            <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-white p-3">
              <img className="size-20 rounded-lg object-cover" src={formValue.imageUrl} alt={formValue.imageName || 'Ảnh hủy món'} />
              <p className="text-sm font-bold text-red-700">{formValue.imageName || 'Đã chọn ảnh hủy món'}</p>
            </div>
          ) : null}
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
