import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  kitchenShiftOptions,
  mealOptions,
  planStatusOptions,
  serviceAreaOptions,
  staffGroupOptions,
} from '../../datas/kitchenPlanData'
import { getCurrentDate } from '../../page/mealFlowUtils'

const inputClass =
  'h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400'
const textareaClass =
  'min-h-20 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-3 text-sm font-semibold outline-none focus:border-blue-400'

function createEmptyItem() {
  return {
    dishId: '',
    dishName: '',
    ingredients: '',
    requiresSample: true,
    expectedQuantity: '',
    plannedStartAt: '',
    deadline: '',
    assignedTo: staffGroupOptions[0],
    serviceArea: serviceAreaOptions[0],
    status: 'Chờ xác nhận',
    note: '',
  }
}

function PlanForm({ mode = 'create', plan, onCancel, onSubmit }) {
  const isViewMode = mode === 'view'
  const initialMenu = plan?.menu || {}
  const [errorMessage, setErrorMessage] = useState('')
  const [formValue, setFormValue] = useState({
    date: initialMenu.date || plan?.date || getCurrentDate(),
    meal: initialMenu.meal || plan?.meal || mealOptions[0],
    shift: initialMenu.shift || plan?.shift || kitchenShiftOptions[0],
    items: plan
      ? [
          {
            id: plan.id,
            dishId: plan.dishId || '',
            dishName: plan.dish?.name || plan.dishName || '',
            ingredients:
              plan.dish?.ingredients ||
              plan.ingredients ||
              plan.dish?.standardPortion ||
              '',
            requiresSample: plan.dish?.requiresSample ?? true,
            expectedQuantity: plan.expectedQuantity || '',
            plannedStartAt: plan.plannedStartAt || plan.startedAt || '',
            deadline: plan.deadline || '',
            assignedTo: plan.assignedTo || staffGroupOptions[0],
            serviceArea: plan.serviceArea || serviceAreaOptions[0],
            status: plan.status || 'Chờ xác nhận',
            note: plan.note || '',
          },
        ]
      : [createEmptyItem()],
  })

  function handleHeaderChange(event) {
    const { name, value } = event.target

    setFormValue((currentValue) => ({
      ...currentValue,
      [name]: value,
    }))
    setErrorMessage('')
  }

  function handleItemChange(index, event) {
    const { checked, name, type, value } = event.target
    const nextFieldValue = type === 'checkbox' ? checked : value

    setFormValue((currentValue) => ({
      ...currentValue,
      items: currentValue.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [name]: nextFieldValue } : item,
      ),
    }))
    setErrorMessage('')
  }

  function addItem() {
    setFormValue((currentValue) => ({
      ...currentValue,
      items: [...currentValue.items, createEmptyItem()],
    }))
  }

  function removeItem(index) {
    setFormValue((currentValue) => ({
      ...currentValue,
      items: currentValue.items.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!formValue.items.length) {
      setErrorMessage('Vui lòng thêm ít nhất một món vào kế hoạch.')
      return
    }

    const missingDish = formValue.items.some((item) => !item.dishName.trim())

    if (missingDish) {
      setErrorMessage('Vui lòng nhập tên món cho tất cả dòng kế hoạch.')
      return
    }

    onSubmit({
      date: formValue.date,
      meal: formValue.meal,
      shift: formValue.shift,
      items: formValue.items.map((item) => ({
        ...item,
        expectedQuantity: Number(item.expectedQuantity),
      })),
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Ngày</span>
          <input className={inputClass} name="date" type="date" value={formValue.date} disabled={isViewMode} onChange={handleHeaderChange} required />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Bữa</span>
          <select className={inputClass} name="meal" value={formValue.meal} disabled={isViewMode} onChange={handleHeaderChange}>
            {mealOptions.map((meal) => (
              <option key={meal} value={meal}>
                {meal}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Ca</span>
          <select className={inputClass} name="shift" value={formValue.shift} disabled={isViewMode} onChange={handleHeaderChange}>
            {kitchenShiftOptions.map((shift) => (
              <option key={shift} value={shift}>
                {shift}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-slate-700">Món trong kế hoạch</p>
          {!isViewMode ? (
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
              type="button"
              onClick={addItem}
            >
              <Plus size={17} aria-hidden="true" />
              Thêm món
            </button>
          ) : null}
        </div>

        {formValue.items.map((item, index) => (
          <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5" key={item.id || index}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-black text-blue-700">
                Món #{index + 1}
              </p>
              {!isViewMode && formValue.items.length > 1 ? (
                <button
                  className="grid size-9 place-items-center rounded-lg text-red-700 transition hover:bg-red-50"
                  type="button"
                  title="Xóa món"
                  aria-label="Xóa món"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2 md:col-span-3">
                <span className="text-sm font-bold text-slate-700">Tên món</span>
                <input
                  className={inputClass}
                  name="dishName"
                  placeholder="Ví dụ: Cơm gà sốt nấm"
                  value={item.dishName}
                  disabled={isViewMode}
                  onChange={(event) => handleItemChange(index, event)}
                  required
                />
              </label>

              <label className="space-y-2 md:col-span-3">
                <span className="text-sm font-bold text-slate-700">Thành phần</span>
                <textarea
                  className={textareaClass}
                  name="ingredients"
                  placeholder="Ví dụ: cơm trắng, gà, nấm, sốt nâu, rau ăn kèm"
                  value={item.ingredients}
                  disabled={isViewMode}
                  onChange={(event) => handleItemChange(index, event)}
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Số lượng dự kiến</span>
                <input className={inputClass} min="1" name="expectedQuantity" placeholder="Ví dụ: 180" type="number" value={item.expectedQuantity} disabled={isViewMode} onChange={(event) => handleItemChange(index, event)} required />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Dự kiến bắt đầu</span>
                <input className={inputClass} name="plannedStartAt" type="time" value={item.plannedStartAt} disabled={isViewMode} onChange={(event) => handleItemChange(index, event)} required />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Cần hoàn thành</span>
                <input className={inputClass} name="deadline" type="time" value={item.deadline} disabled={isViewMode} onChange={(event) => handleItemChange(index, event)} required />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Người/nhóm phụ trách</span>
                <select className={inputClass} name="assignedTo" value={item.assignedTo} disabled={isViewMode} onChange={(event) => handleItemChange(index, event)}>
                  {staffGroupOptions.map((staffGroup) => (
                    <option key={staffGroup} value={staffGroup}>
                      {staffGroup}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Khu vực phục vụ</span>
                <select className={inputClass} name="serviceArea" value={item.serviceArea} disabled={isViewMode} onChange={(event) => handleItemChange(index, event)}>
                  {serviceAreaOptions.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-700">Trạng thái</span>
                <select className={inputClass} name="status" value={item.status} disabled={isViewMode} onChange={(event) => handleItemChange(index, event)}>
                  {planStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex h-11 items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-3">
                <input
                  className="size-4 rounded border-blue-200 text-blue-600"
                  name="requiresSample"
                  type="checkbox"
                  checked={item.requiresSample}
                  disabled={isViewMode}
                  onChange={(event) => handleItemChange(index, event)}
                />
                <span className="text-sm font-bold text-slate-700">Cần lưu mẫu</span>
              </label>

              <label className="space-y-2 md:col-span-3">
                <span className="text-sm font-bold text-slate-700">Ghi chú</span>
                <textarea className={textareaClass} name="note" placeholder="Ví dụ: Phục vụ khối 3 trước 10 phút" value={item.note} disabled={isViewMode} onChange={(event) => handleItemChange(index, event)} />
              </label>
            </div>
          </div>
        ))}
      </div>

      {errorMessage ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex justify-end gap-3 border-t border-blue-100 pt-5">
        <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50" type="button" onClick={onCancel}>
          {isViewMode ? 'Đóng' : 'Hủy'}
        </button>
        {!isViewMode ? (
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700" type="submit">
            Lưu kế hoạch
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default PlanForm
