import { useMemo, useState } from 'react'
import {
  getMenuDishes,
  planStatusOptions,
  serviceAreaOptions,
  staffGroupOptions,
} from '../../datas/kitchenPlanData'

function PlanForm({ mode = 'create', plan, menus, dishList, onCancel, onSubmit }) {
  const firstMenu = menus[0]
  const initialMenu =
    menus.find((menu) => menu.id === plan?.menuId) || firstMenu || {}
  const isViewMode = mode === 'view'
  const menuDates = [...new Set(menus.map((menu) => menu.date))]
  const menuMeals = [...new Set(menus.map((menu) => menu.meal))]
  const menuShifts = [...new Set(menus.map((menu) => menu.shift))]
  const [errorMessage, setErrorMessage] = useState('')
  const [formValue, setFormValue] = useState({
    menuDate: initialMenu.date || '',
    menuMeal: initialMenu.meal || '',
    menuShift: initialMenu.shift || '',
    dishId: plan?.dishId || '',
    expectedQuantity: plan?.expectedQuantity || '',
    plannedStartAt: plan?.plannedStartAt || plan?.startedAt || '',
    deadline: plan?.deadline || '',
    assignedTo: plan?.assignedTo || staffGroupOptions[0],
    serviceArea: plan?.serviceArea || serviceAreaOptions[0],
    note: plan?.note || '',
    status: plan?.status || 'Chờ xác nhận',
  })

  const selectedMenu = useMemo(() => {
    return menus.find(
      (menu) =>
        menu.date === formValue.menuDate &&
        menu.meal === formValue.menuMeal &&
        menu.shift === formValue.menuShift,
    )
  }, [formValue.menuDate, formValue.menuMeal, formValue.menuShift, menus])
  const selectedMenuDishes = selectedMenu
    ? getMenuDishes(selectedMenu, dishList)
    : []

  function handleChange(event) {
    const { name, value } = event.target

    setFormValue((currentValue) => {
      if (['menuDate', 'menuMeal', 'menuShift'].includes(name)) {
        return {
          ...currentValue,
          [name]: value,
          dishId: '',
        }
      }

      return {
        ...currentValue,
        [name]: value,
      }
    })
    setErrorMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!selectedMenu) {
      setErrorMessage('Không tìm thấy thực đơn phù hợp với ngày, bữa và ca đã chọn.')
      return
    }

    if (!formValue.dishId) {
      setErrorMessage('Vui lòng chọn món từ thực đơn.')
      return
    }

    onSubmit({
      ...formValue,
      id: plan?.id,
      menuId: selectedMenu.id,
      expectedQuantity: Number(formValue.expectedQuantity),
    })
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Ngày</span>
          <input
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400"
            name="menuDate"
            type="date"
            list="menu-date-options"
            value={formValue.menuDate}
            disabled={isViewMode}
            onChange={handleChange}
            required
          />
          <datalist id="menu-date-options">
            {menuDates.map((date) => (
              <option key={date} value={date} />
            ))}
          </datalist>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Bữa</span>
          <select
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400"
            name="menuMeal"
            value={formValue.menuMeal}
            disabled={isViewMode}
            onChange={handleChange}
            required
          >
            {menuMeals.map((meal) => (
              <option key={meal} value={meal}>
                {meal}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Ca</span>
          <select
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400"
            name="menuShift"
            value={formValue.menuShift}
            disabled={isViewMode}
            onChange={handleChange}
            required
          >
            {menuShifts.map((shift) => (
              <option key={shift} value={shift}>
                {shift}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 md:col-span-3">
          <span className="text-sm font-bold text-slate-700">
            Chọn món từ thực đơn
          </span>
          <select
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400"
            name="dishId"
            value={formValue.dishId}
            disabled={isViewMode || !selectedMenuDishes.length}
            onChange={handleChange}
            required
          >
            <option value="">Chọn món cần làm</option>
            {selectedMenuDishes.map((dish) => (
              <option key={dish.id} value={dish.id}>
                {dish.name} - {dish.group}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Số lượng dự kiến</span>
          <input
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400"
            min="1"
            name="expectedQuantity"
            placeholder="Ví dụ: 180"
            type="number"
            value={formValue.expectedQuantity}
            disabled={isViewMode}
            onChange={handleChange}
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Dự kiến bắt đầu</span>
          <input
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400"
            name="plannedStartAt"
            type="time"
            value={formValue.plannedStartAt}
            disabled={isViewMode}
            onChange={handleChange}
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Cần hoàn thành</span>
          <input
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400"
            name="deadline"
            type="time"
            value={formValue.deadline}
            disabled={isViewMode}
            onChange={handleChange}
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Người/nhóm phụ trách</span>
          <select
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400"
            name="assignedTo"
            value={formValue.assignedTo}
            disabled={isViewMode}
            onChange={handleChange}
          >
            {staffGroupOptions.map((staffGroup) => (
              <option key={staffGroup} value={staffGroup}>
                {staffGroup}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Khu vực phục vụ</span>
          <select
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400"
            name="serviceArea"
            value={formValue.serviceArea}
            disabled={isViewMode}
            onChange={handleChange}
          >
            {serviceAreaOptions.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Trạng thái</span>
          <select
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400"
            name="status"
            value={formValue.status}
            disabled={isViewMode}
            onChange={handleChange}
          >
            {planStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 md:col-span-3">
          <span className="text-sm font-bold text-slate-700">Ghi chú</span>
          <textarea
            className="min-h-24 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-3 text-sm font-semibold outline-none focus:border-blue-400"
            name="note"
            placeholder="Ví dụ: Phục vụ khối 3 trước 10 phút"
            value={formValue.note}
            disabled={isViewMode}
            onChange={handleChange}
          />
        </label>
      </div>

      {errorMessage ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex justify-end gap-3 border-t border-blue-100 pt-5">
        <button
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          type="button"
          onClick={onCancel}
        >
          {isViewMode ? 'Đóng' : 'Hủy'}
        </button>
        {!isViewMode ? (
          <button
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
            type="submit"
          >
            Lưu kế hoạch
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default PlanForm
