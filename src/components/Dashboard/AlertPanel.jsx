import { AlertTriangle, CheckCircle2, Eye } from 'lucide-react'

const alertTones = {
  warning: 'border-amber-100 bg-amber-50 text-amber-700',
  info: 'border-blue-100 bg-blue-50 text-blue-700',
  danger: 'border-red-100 bg-red-50 text-red-700',
}

function AlertPanel({ alerts }) {
  return (
    <aside className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-blue-700">
            Cảnh báo
          </p>
          <h3 className="mt-1 text-xl font-bold tracking-normal text-slate-950">
            Cần chú ý
          </h3>
        </div>
        <div className="grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-600">
          <AlertTriangle size={22} aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[620px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-sm text-slate-500">
              <th className="px-3 py-2 font-semibold">Cảnh báo</th>
              <th className="px-3 py-2 font-semibold">Chi tiết</th>
              <th className="px-3 py-2 font-semibold">Mức độ</th>
              <th className="px-3 py-2 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr className="bg-blue-50/60 transition hover:bg-blue-100/70" key={alert.id}>
                <td className="rounded-l-xl px-3 py-4 text-sm font-bold text-slate-950">
                  {alert.title}
                </td>
                <td className="px-3 py-4 text-sm font-semibold text-slate-600">
                  {alert.detail}
                </td>
                <td className="px-3 py-4">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${alertTones[alert.level]}`}
                  >
                    Cần xử lý
                  </span>
                </td>
                <td className="rounded-r-xl px-3 py-4">
                  <div className="flex justify-end gap-1.5">
                    <button
                      className="grid size-9 place-items-center rounded-lg text-blue-700 transition hover:bg-blue-50 hover:text-blue-800"
                      type="button"
                      title="Xem chi tiết"
                      aria-label="Xem chi tiết"
                    >
                      <Eye size={17} aria-hidden="true" />
                    </button>
                    <button
                      className="grid size-9 place-items-center rounded-lg text-emerald-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                      type="button"
                      title="Đã xử lý"
                      aria-label="Đã xử lý"
                    >
                      <CheckCircle2 size={17} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </aside>
  )
}

export default AlertPanel
