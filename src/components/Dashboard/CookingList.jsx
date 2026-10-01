import { CircleCheck, Clock3, Eye, SquarePen } from 'lucide-react'

const actionButtons = [
  {
    label: 'Xem chi tiết',
    icon: Eye,
    className: 'text-blue-700 hover:bg-blue-50 hover:text-blue-800',
  },
  {
    label: 'Cập nhật',
    icon: SquarePen,
    className: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  },
  {
    label: 'Hoàn thành',
    icon: CircleCheck,
    className: 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800',
  },
]

function RowActions({ item, onView, onEdit, onComplete }) {
  const actionHandlers = {
    'Xem chi tiết': onView,
    'Cập nhật': onEdit,
    'Hoàn thành': onComplete,
  }

  return (
    <div className="flex items-center gap-1.5">
      {actionButtons.map((action) => {
        const Icon = action.icon
        const handleClick = actionHandlers[action.label]

        return (
          <button
            className={`grid size-9 place-items-center rounded-lg transition ${action.className}`}
            key={action.label}
            type="button"
            title={action.label}
            aria-label={action.label}
            onClick={() => handleClick?.(item)}
          >
            <Icon size={17} aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}

function CookingList({ items, onView, onEdit, onComplete }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-blue-700">
            Đang chế biến
          </p>
          <h3 className="mt-1 text-xl font-bold tracking-normal text-slate-950">
            Danh sách món trong bếp
          </h3>
        </div>
        <div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <Clock3 size={22} aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[900px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-sm text-slate-500">
              <th className="px-3 py-2 font-semibold">STT</th>
              <th className="px-3 py-2 font-semibold">Tên món</th>
              <th className="px-3 py-2 font-semibold">Số lượng</th>
              <th className="px-3 py-2 font-semibold">Bắt đầu</th>
              <th className="px-3 py-2 font-semibold">Dự kiến xong</th>
              <th className="px-3 py-2 font-semibold">Trạng thái</th>
              <th className="px-3 py-2 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr className="rounded-xl bg-blue-50/60 transition hover:bg-blue-100/70" key={item.id}>
                <td className="rounded-l-xl px-3 py-4 text-sm font-bold text-blue-700">
                  #{index + 1}
                </td>
                <td className="px-3 py-4 text-sm font-bold text-slate-900">
                  {item.name}
                </td>
                <td className="px-3 py-4 text-sm font-semibold text-slate-700">
                  {item.quantity} suất
                </td>
                <td className="px-3 py-4 text-sm text-slate-600">
                  {item.startedAt}
                </td>
                <td className="px-3 py-4 text-sm text-slate-600">
                  {item.estimatedDoneAt}
                </td>
                <td className="px-3 py-4">
                  <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                    {item.status}
                  </span>
                </td>
                <td className="rounded-r-xl px-3 py-4">
                  <div className="flex justify-end">
                    <RowActions
                      item={item}
                      onView={onView}
                      onEdit={onEdit}
                      onComplete={onComplete}
                    />
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

export default CookingList
