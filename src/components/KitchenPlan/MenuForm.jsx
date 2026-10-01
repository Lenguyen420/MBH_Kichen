import { useMemo, useState } from 'react'

function MenuForm({
  mode = 'create',
  menu,
  dishes,
  planRows = [],
  mealOptions,
  shiftOptions,
  onCancel,
  onSubmit,
}) {
  const isViewMode = mode === 'view'
  const [errorMessage, setErrorMessage] = useState('')
  const [formValue, setFormValue] = useState({
    date: menu?.date || '2026-09-30',
    meal: menu?.meal || mealOptions[0],
    shift: menu?.shift || shiftOptions[0],
    title: menu?.title || '',
    dishIds: menu?.dishIds || [],
    locked: Boolean(menu?.locked),
  })

  function handleChange(event) {
    const { name, value } = event.target

    setFormValue((currentValue) => {
      const nextValue = {
        ...currentValue,
        [name]: value,
      }

      if (['date', 'meal', 'shift'].includes(name)) {
        const plannedDishIds = new Set(
          planRows
            .filter(
              (plan) =>
                plan.menu?.date === nextValue.date &&
                plan.menu?.meal === nextValue.meal &&
                plan.menu?.shift === nextValue.shift,
            )
            .map((plan) => plan.dishId),
        )

        return {
          ...nextValue,
          dishIds: nextValue.dishIds.filter((dishId) =>
            plannedDishIds.has(dishId),
          ),
        }
      }

      return nextValue
    })
  }

  function handleLockedChange(event) {
    setFormValue((currentValue) => ({
      ...currentValue,
      locked: event.target.checked,
    }))
  }

  function handleDishChange(event) {
    const { checked, value } = event.target

    setFormValue((currentValue) => ({
      ...currentValue,
      dishIds: checked
        ? [...currentValue.dishIds, value]
        : currentValue.dishIds.filter((dishId) => dishId !== value),
    }))
    setErrorMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!formValue.dishIds.length) {
      setErrorMessage('Vui lòng chọn ít nhất một món cho thực đơn.')
      return
    }

    onSubmit({
      ...formValue,
      id: menu?.id,
      title:
        formValue.title.trim() ||
        `Thực đơn ${formValue.meal.toLowerCase()} ${formValue.date}`,
    })
  }

  const plannedDishes = useMemo(() => {
    const plannedDishMap = new Map()

    planRows
      .filter(
        (plan) =>
          plan.menu?.date === formValue.date &&
          plan.menu?.meal === formValue.meal &&
          plan.menu?.shift === formValue.shift,
      )
      .forEach((plan) => {
        const dish = dishes.find((item) => item.id === plan.dishId) || plan.dish

        if (dish) {
          plannedDishMap.set(dish.id, dish)
        }
      })

    return [...plannedDishMap.values()]
  }, [dishes, formValue.date, formValue.meal, formValue.shift, planRows])

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Ngày</span>
          <input
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400"
            name="date"
            type="date"
            value={formValue.date}
            disabled={isViewMode}
            onChange={handleChange}
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-bold text-slate-700">Bữa</span>
          <select
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400"
            name="meal"
            value={formValue.meal}
            disabled={isViewMode}
            onChange={handleChange}
          >
            {mealOptions.map((meal) => (
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
            name="shift"
            value={formValue.shift}
            disabled={isViewMode}
            onChange={handleChange}
          >
            {shiftOptions.map((shift) => (
              <option key={shift} value={shift}>
                {shift}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 md:col-span-3">
          <span className="text-sm font-bold text-slate-700">Tên thực đơn</span>
          <input
            className="h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400"
            name="title"
            placeholder="Ví dụ: Thực đơn trưa thứ Tư"
            value={formValue.title}
            disabled={isViewMode}
            onChange={handleChange}
            required
          />
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-3 md:col-span-3">
          <input
            className="size-4 accent-blue-600"
            type="checkbox"
            checked={formValue.locked}
            disabled={isViewMode}
            onChange={handleLockedChange}
          />
          <span className="text-sm font-bold text-slate-700">
            Khóa thực đơn sau khi duyệt
          </span>
        </label>
      </div>

      <div>
        <p className="text-sm font-bold text-slate-700">Món trong thực đơn</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {plannedDishes.map((dish) => (
            <label
              className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3"
              key={dish.id}
            >
              <input
                className="mt-1 size-4 accent-blue-600"
                type="checkbox"
                value={dish.id}
                checked={formValue.dishIds.includes(dish.id)}
                disabled={isViewMode}
                onChange={handleDishChange}
              />
              <span>
                <span className="block text-sm font-bold text-slate-900">
                  {dish.name}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {dish.group} - {dish.standardPortion} - {dish.cookDuration} phút
                  {dish.requiresSample ? ' - Cần lưu mẫu' : ''}
                </span>
              </span>
            </label>
          ))}
        </div>
        {!plannedDishes.length ? (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
            Chưa có món nào trong kế hoạch cho ngày, bữa và ca này.
          </p>
        ) : null}
        {errorMessage ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
            {errorMessage}
          </p>
        ) : null}
      </div>

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
            Lưu thực đơn
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default MenuForm
