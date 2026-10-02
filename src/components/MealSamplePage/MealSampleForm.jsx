import { useState } from 'react'
import {
  getCurrentDateTime,
  inputClass,
  textareaClass,
} from '../../page/mealFlowUtils'

function addHours(dateTime, hours) {
  const date = new Date(dateTime)
  const timezoneOffset = date.getTimezoneOffset() * 60000

  return new Date(date.getTime() + hours * 60 * 60 * 1000 - timezoneOffset)
    .toISOString()
    .slice(0, 16)
}

function MealSampleForm({ candidates, sampleRow, onCancel, onSubmit }) {
  const firstCandidate = candidates[0]
  const initialStartedAt =
    sampleRow?.storageStartedAt || sampleRow?.sampledAt || getCurrentDateTime()
  const [formValue, setFormValue] = useState({
    sourceKey: sampleRow?.importId || firstCandidate?.id || '',
    quantity: sampleRow?.quantity || 1,
    sampledAt: sampleRow?.sampledAt || getCurrentDateTime(),
    sampledBy: sampleRow?.sampledBy || '',
    storageLocation: sampleRow?.storageLocation || 'Tủ lưu mẫu A - Ngăn 1',
    storageStartedAt: initialStartedAt,
    expectedEndAt: sampleRow?.expectedEndAt || addHours(initialStartedAt, 24),
    imageUrl: sampleRow?.imageUrl || '',
    imageName: sampleRow?.imageName || '',
    note: sampleRow?.note || '',
  })
  const selectedSource = candidates.find((item) => item.id === formValue.sourceKey)

  function handleChange(event) {
    const { name, value } = event.target

    setFormValue((currentValue) => {
      const nextValue = {
        ...currentValue,
        [name]: value,
      }

      if (name === 'storageStartedAt' && !sampleRow) {
        nextValue.expectedEndAt = addHours(value, 24)
      }

      return nextValue
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    onSubmit({
      ...sampleRow,
      ...formValue,
      quantity: Number(formValue.quantity || 0),
      sourceRow: selectedSource,
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
      <label className="space-y-2">
        <span className="text-sm font-bold text-slate-700">Món đã hoàn thành</span>
        <select className={inputClass} name="sourceKey" value={formValue.sourceKey} disabled={Boolean(sampleRow)} onChange={handleChange}>
          {candidates.map((item) => (
            <option key={item.id} value={item.id}>
              {item.dish?.name || item.dishName || 'Món chưa đặt tên'} - {item.batchCode} - {item.sourceType === 'cooking' ? 'mẻ chế biến' : 'phiếu nhập'} {item.quantity} {item.dish?.unit || 'suất'}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Số lượng mẫu</span>
          <input className={inputClass} min="1" name="quantity" type="number" required value={formValue.quantity} onChange={handleChange} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Thời gian lấy mẫu</span>
          <input className={inputClass} name="sampledAt" type="datetime-local" required value={formValue.sampledAt} onChange={handleChange} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Người lấy mẫu</span>
          <input className={inputClass} name="sampledBy" required value={formValue.sampledBy} onChange={handleChange} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Vị trí lưu</span>
          <input className={inputClass} name="storageLocation" required value={formValue.storageLocation} onChange={handleChange} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Bắt đầu lưu</span>
          <input className={inputClass} name="storageStartedAt" type="datetime-local" required value={formValue.storageStartedAt} onChange={handleChange} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Dự kiến kết thúc</span>
          <input className={inputClass} name="expectedEndAt" type="datetime-local" required value={formValue.expectedEndAt} onChange={handleChange} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-bold text-slate-700">Hình ảnh</span>
          <input
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-2 text-sm font-semibold outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-white focus:border-blue-400"
            name="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {formValue.imageUrl ? (
            <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white p-3">
              <img className="size-20 rounded-lg object-cover" src={formValue.imageUrl} alt={formValue.imageName || 'Ảnh mẫu'} />
              <p className="text-sm font-bold text-blue-700">{formValue.imageName || 'Đã chọn ảnh mẫu'}</p>
            </div>
          ) : null}
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-bold text-slate-700">Ghi chú</span>
          <textarea className={textareaClass} name="note" value={formValue.note} onChange={handleChange} />
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-blue-100 pt-5">
        <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50" type="button" onClick={onCancel}>Hủy</button>
        <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700" type="submit">Lưu mẫu</button>
      </div>
    </form>
  )
}

export default MealSampleForm
