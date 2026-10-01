import { CalendarDays, Sparkles, UsersRound } from 'lucide-react'
import { shiftOptions } from '../../datas/dashboardData'

function DashboardFilters({
  selectedDate,
  selectedShift,
  onDateChange,
  onShiftChange,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-700 via-blue-600 to-sky-400 p-5 text-white shadow-xl shadow-blue-900/15">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute bottom-0 left-8 h-20 w-40 rounded-full bg-cyan-200/20 blur-2xl" />

      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-blue-50 ring-1 ring-white/20">
            <Sparkles size={15} aria-hidden="true" />
            KIDO CANTEEN
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-normal sm:text-4xl">
            Tổng quan bếp
          </h2>
          <p className="mt-2 max-w-lg text-sm font-medium leading-6 text-blue-50">
            Theo dõi nhanh tình trạng chế biến, phục vụ, tồn và cảnh báo trong
            ca làm việc hiện tại.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
          <label className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 text-slate-800 shadow-lg shadow-blue-950/10">
            <CalendarDays size={18} className="text-blue-700" aria-hidden="true" />
            <span className="sr-only">Ngày</span>
            <input
              className="w-full bg-transparent text-sm font-bold outline-none"
              type="date"
              value={selectedDate}
              onChange={(event) => onDateChange(event.target.value)}
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 text-slate-800 shadow-lg shadow-blue-950/10">
            <UsersRound size={18} className="text-blue-700" aria-hidden="true" />
            <span className="sr-only">Ca làm việc</span>
            <select
              className="w-full bg-transparent text-sm font-bold outline-none"
              value={selectedShift}
              onChange={(event) => onShiftChange(event.target.value)}
            >
              {shiftOptions.map((shift) => (
                <option key={shift} value={shift}>
                  {shift}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  )
}

export default DashboardFilters
