import { CalendarDays, Filter, ListFilter, Search, UsersRound } from 'lucide-react'

function KitchenPlanFilters({
  date,
  meal,
  shift,
  status,
  mealOptions,
  shiftOptions,
  statusOptions,
  searchValue,
  onDateChange,
  onMealChange,
  onShiftChange,
  onStatusChange,
  onSearchChange,
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 md:grid-cols-2 xl:grid-cols-4">
      {typeof searchValue === 'string' ? (
        <label className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-3">
          <Search size={18} className="text-blue-700" aria-hidden="true" />
          <span className="sr-only">Tìm kiếm món</span>
          <input
            className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Tìm món trong thực đơn"
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
      ) : null}

      <label className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-3">
        <CalendarDays size={18} className="text-blue-700" aria-hidden="true" />
        <span className="sr-only">Ngày</span>
        <input
          className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
          type="date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
        />
      </label>

      <label className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-3">
        <Filter size={18} className="text-blue-700" aria-hidden="true" />
        <span className="sr-only">Bữa</span>
        <select
          className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
          value={meal}
          onChange={(event) => onMealChange(event.target.value)}
        >
          <option value="Tất cả">Tất cả bữa</option>
          {mealOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-3">
        <UsersRound size={18} className="text-blue-700" aria-hidden="true" />
        <span className="sr-only">Ca</span>
        <select
          className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
          value={shift}
          onChange={(event) => onShiftChange(event.target.value)}
        >
          <option value="Tất cả">Tất cả ca</option>
          {shiftOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      {typeof status === 'string' ? (
        <label className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-3">
          <ListFilter size={18} className="text-blue-700" aria-hidden="true" />
          <span className="sr-only">Trạng thái</span>
          <select
            className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  )
}

export default KitchenPlanFilters
