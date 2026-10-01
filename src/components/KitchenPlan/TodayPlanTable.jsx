import { BadgeCheck, Copy, Eye, SquarePen } from 'lucide-react'

const statusTones = {
  'Chờ xác nhận': 'bg-amber-50 text-amber-700 ring-amber-100',
  'Đã xác nhận': 'bg-blue-50 text-blue-700 ring-blue-100',
  'Đã chuyển bếp': 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

function TodayPlanTable({ rows, onView, onEdit, onConfirm, onCopy }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-blue-700">
            Kế hoạch hôm nay
          </p>
          <h3 className="mt-1 text-xl font-bold tracking-normal text-slate-950">
            Danh sách món cần làm
          </h3>
        </div>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
          type="button"
          onClick={onCopy}
        >
          <Copy size={17} aria-hidden="true" />
          Sao chép ngày trước
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[1280px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-sm text-slate-500">
              <th className="px-3 py-2 font-semibold">STT</th>
              <th className="px-3 py-2 font-semibold">Ngày/Bữa</th>
              <th className="px-3 py-2 font-semibold">Tên món</th>
              <th className="px-3 py-2 font-semibold">Số lượng</th>
              <th className="px-3 py-2 font-semibold">Dự kiến bắt đầu</th>
              <th className="px-3 py-2 font-semibold">Cần hoàn thành</th>
              <th className="px-3 py-2 font-semibold">Phụ trách</th>
              <th className="px-3 py-2 font-semibold">Khu vực</th>
              <th className="px-3 py-2 font-semibold">Ghi chú</th>
              <th className="px-3 py-2 font-semibold">Trạng thái</th>
              <th className="px-3 py-2 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr className="bg-blue-50/60 transition hover:bg-blue-100/70" key={row.id}>
                <td className="rounded-l-xl px-3 py-4 text-sm font-bold text-blue-700">
                  #{index + 1}
                </td>
                <td className="px-3 py-4 text-sm font-semibold text-slate-600">
                  <p className="font-bold text-slate-900">{row.menu?.date}</p>
                  <p>{row.menu?.meal} - {row.menu?.shift}</p>
                </td>
                <td className="px-3 py-4 text-sm font-bold text-slate-950">
                  {row.dish?.name}
                </td>
                <td className="px-3 py-4 text-sm font-semibold text-slate-700">
                  {row.expectedQuantity} {row.dish?.unit}
                </td>
                <td className="px-3 py-4 text-sm text-slate-600">
                  {row.plannedStartAt}
                </td>
                <td className="px-3 py-4 text-sm font-bold text-slate-900">
                  {row.deadline}
                </td>
                <td className="px-3 py-4 text-sm text-slate-600">
                  {row.assignedTo}
                </td>
                <td className="px-3 py-4 text-sm font-semibold text-slate-700">
                  {row.serviceArea}
                </td>
                <td className="max-w-[220px] px-3 py-4 text-sm text-slate-600">
                  <p className="truncate">{row.note || 'Không có'}</p>
                </td>
                <td className="px-3 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusTones[row.status]}`}>
                    {row.status}
                  </span>
                </td>
                <td className="rounded-r-xl px-3 py-4">
                  <div className="flex justify-end gap-1.5">
                    <button
                      className="grid size-9 place-items-center rounded-lg text-blue-700 transition hover:bg-blue-50"
                      type="button"
                      title="Xem chi tiết"
                      aria-label="Xem chi tiết"
                      onClick={() => onView(row)}
                    >
                      <Eye size={17} aria-hidden="true" />
                    </button>
                    <button
                      className="grid size-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100"
                      type="button"
                      title="Chỉnh sửa"
                      aria-label="Chỉnh sửa"
                      onClick={() => onEdit(row)}
                    >
                      <SquarePen size={17} aria-hidden="true" />
                    </button>
                    <button
                      className="grid size-9 place-items-center rounded-lg text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                      type="button"
                      title="Xác nhận kế hoạch"
                      aria-label="Xác nhận kế hoạch"
                      disabled={row.confirmed}
                      onClick={() => onConfirm(row)}
                    >
                      <BadgeCheck size={17} aria-hidden="true" />
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

export default TodayPlanTable
