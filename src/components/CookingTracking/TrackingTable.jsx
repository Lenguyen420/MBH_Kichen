import { AlertTriangle, CircleCheck, Eye, Play, SquarePen } from 'lucide-react'

const statusTones = {
  'Chờ làm': 'bg-amber-50 text-amber-700 ring-amber-100',
  'Đang chế biến': 'bg-blue-50 text-blue-700 ring-blue-100',
  'Hoàn thành': 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

function TrackingTable({ rows, onView, onStart, onUpdate, onIssue, onComplete }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 sm:p-5">
      <div>
        <p className="text-sm font-semibold uppercase text-blue-700">
          Theo dõi chế biến
        </p>
        <h3 className="mt-1 text-xl font-bold tracking-normal text-slate-950">
          Trạng thái chế biến trong bếp
        </h3>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[1320px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-sm text-slate-500">
              <th className="px-3 py-2 font-semibold">STT</th>
              <th className="px-3 py-2 font-semibold">Tên món</th>
              <th className="px-3 py-2 font-semibold">SL kế hoạch</th>
              <th className="px-3 py-2 font-semibold">SL đang làm</th>
              <th className="px-3 py-2 font-semibold">Bắt đầu</th>
              <th className="px-3 py-2 font-semibold">Dự kiến xong</th>
              <th className="px-3 py-2 font-semibold">Hoàn thành thực tế</th>
              <th className="px-3 py-2 font-semibold">Phụ trách</th>
              <th className="px-3 py-2 font-semibold">Trạng thái</th>
              <th className="px-3 py-2 font-semibold">Ghi chú</th>
              <th className="px-3 py-2 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr className="bg-blue-50/60 transition hover:bg-blue-100/70" key={row.id}>
                <td className="rounded-l-xl px-3 py-4 text-sm font-bold text-blue-700">
                  #{index + 1}
                </td>
                <td className="px-3 py-4 text-sm font-bold text-slate-950">
                  {row.dish?.name}
                </td>
                <td className="px-3 py-4 text-sm font-semibold text-slate-700">
                  {row.plannedQuantity} {row.dish?.unit}
                </td>
                <td className="px-3 py-4 text-sm font-semibold text-slate-700">
                  {row.cookingQuantity} {row.dish?.unit}
                </td>
                <td className="px-3 py-4 text-sm text-slate-600">
                  {row.startedAt || '--:--'}
                </td>
                <td className="px-3 py-4 text-sm text-slate-600">
                  {row.estimatedDoneAt}
                </td>
                <td className="px-3 py-4 text-sm font-bold text-slate-900">
                  {row.completedAt || '--:--'}
                </td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.staff}</td>
                <td className="px-3 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusTones[row.status]}`}>
                    {row.status}
                  </span>
                </td>
                <td className="max-w-[220px] px-3 py-4 text-sm text-slate-600">
                  <p className="truncate">{row.issueNote || row.note || 'Không có'}</p>
                </td>
                <td className="rounded-r-xl px-3 py-4">
                  <div className="flex justify-end gap-1.5">
                    <button className="grid size-9 place-items-center rounded-lg text-blue-700 transition hover:bg-blue-50" type="button" title="Xem" aria-label="Xem" onClick={() => onView(row)}>
                      <Eye size={17} aria-hidden="true" />
                    </button>
                    <button className="grid size-9 place-items-center rounded-lg text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40" type="button" title="Bắt đầu" aria-label="Bắt đầu" disabled={row.status !== 'Chờ làm'} onClick={() => onStart(row)}>
                      <Play size={17} aria-hidden="true" />
                    </button>
                    <button className="grid size-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40" type="button" title="Cập nhật" aria-label="Cập nhật" disabled={row.status === 'Hoàn thành'} onClick={() => onUpdate(row)}>
                      <SquarePen size={17} aria-hidden="true" />
                    </button>
                    <button className="grid size-9 place-items-center rounded-lg text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40" type="button" title="Báo lỗi" aria-label="Báo lỗi" disabled={row.status === 'Hoàn thành'} onClick={() => onIssue(row)}>
                      <AlertTriangle size={17} aria-hidden="true" />
                    </button>
                    <button className="grid size-9 place-items-center rounded-lg text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40" type="button" title="Hoàn thành" aria-label="Hoàn thành" disabled={row.status === 'Hoàn thành'} onClick={() => onComplete(row)}>
                      <CircleCheck size={17} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default TrackingTable
