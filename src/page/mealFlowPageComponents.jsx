import { kitchenShiftOptions } from '../datas/kitchenPlanData'
import { inputClass } from './mealFlowUtils'

const statusTones = {
  'Chờ xác nhận': 'bg-amber-50 text-amber-700 ring-amber-100',
  'Đã xác nhận': 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  'Đã xuất': 'bg-blue-50 text-blue-700 ring-blue-100',
  'Thu hồi': 'bg-slate-100 text-slate-700 ring-slate-200',
  'Hủy': 'bg-red-50 text-red-700 ring-red-100',
  'Nhập món': 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  'Xuất món': 'bg-blue-50 text-blue-700 ring-blue-100',
  'Còn sử dụng': 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  'Sắp hết hạn': 'bg-amber-50 text-amber-700 ring-amber-100',
  'Quá hạn': 'bg-red-50 text-red-700 ring-red-100',
  'Tồn lớn': 'bg-sky-50 text-sky-700 ring-sky-100',
  'Đã hết': 'bg-slate-100 text-slate-600 ring-slate-200',
}

const summaryCardTones = [
  {
    border: 'border-emerald-100',
    accent: 'bg-emerald-500',
    icon: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    value: 'text-emerald-700',
  },
  {
    border: 'border-sky-100',
    accent: 'bg-sky-500',
    icon: 'bg-sky-50 text-sky-700 ring-sky-100',
    value: 'text-sky-700',
  },
  {
    border: 'border-amber-100',
    accent: 'bg-amber-500',
    icon: 'bg-amber-50 text-amber-700 ring-amber-100',
    value: 'text-amber-700',
  },
  {
    border: 'border-rose-100',
    accent: 'bg-rose-500',
    icon: 'bg-rose-50 text-rose-700 ring-rose-100',
    value: 'text-rose-700',
  },
]

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusTones[status] || statusTones['Đã xuất']}`}>
      {status}
    </span>
  )
}

export function SummaryCards({ cards }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        const tone = summaryCardTones[index % summaryCardTones.length]

        return (
          <article
            className={`relative overflow-hidden rounded-2xl border ${tone.border} bg-white p-4 shadow-sm shadow-blue-950/5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-950/10`}
            key={card.label}
          >
            <div className={`absolute inset-x-0 top-0 h-1 ${tone.accent}`} />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {card.label}
                </p>
                <p className={`mt-2 text-3xl font-black tracking-normal ${tone.value}`}>
                  {card.value}
                </p>
              </div>
              <div className={`grid size-11 shrink-0 place-items-center rounded-xl ring-1 ${tone.icon}`}>
                <Icon size={21} aria-hidden="true" />
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export function FlowFilters({
  ticketCode,
  date,
  dish,
  status,
  shift,
  type,
  receiver,
  staff,
  dishes,
  statusOptions = [],
  typeOptions = [],
  receiverOptions = [],
  staffOptions = [],
  onTicketCodeChange,
  onDateChange,
  onDishChange,
  onStatusChange,
  onShiftChange,
  onTypeChange,
  onReceiverChange,
  onStaffChange,
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 md:grid-cols-2 xl:grid-cols-4">
      {typeof ticketCode === 'string' ? (
        <label className="space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Mã phiếu</span>
          <input
            className={inputClass}
            type="search"
            placeholder="Ví dụ: IMP-20260930-001"
            value={ticketCode}
            onChange={(event) => onTicketCodeChange(event.target.value)}
          />
        </label>
      ) : null}
      {typeof date === 'string' ? (
        <label className="space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Ngày</span>
          <input className={inputClass} type="date" value={date} onChange={(event) => onDateChange(event.target.value)} />
        </label>
      ) : null}
      {typeof dish === 'string' ? (
        <label className="space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Món</span>
          <select className={inputClass} value={dish} onChange={(event) => onDishChange(event.target.value)}>
            <option value="Tất cả">Tất cả món</option>
            {dishes.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
      ) : null}
      {typeof status === 'string' ? (
        <label className="space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Trạng thái</span>
          <select className={inputClass} value={status} onChange={(event) => onStatusChange(event.target.value)}>
            <option value="Tất cả">Tất cả trạng thái</option>
            {statusOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      ) : null}
      {typeof type === 'string' ? (
        <label className="space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Loại giao dịch</span>
          <select className={inputClass} value={type} onChange={(event) => onTypeChange(event.target.value)}>
            <option value="Tất cả">Tất cả giao dịch</option>
            {typeOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      ) : null}
      {typeof shift === 'string' ? (
        <label className="space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Ca</span>
          <select className={inputClass} value={shift} onChange={(event) => onShiftChange(event.target.value)}>
            <option value="Tất cả">Tất cả ca</option>
            {kitchenShiftOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      ) : null}
      {typeof staff === 'string' ? (
        <label className="space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Nhân viên</span>
          <select className={inputClass} value={staff} onChange={(event) => onStaffChange(event.target.value)}>
            <option value="Tất cả">Tất cả nhân viên</option>
            {staffOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      ) : null}
      {typeof receiver === 'string' ? (
        <label className="space-y-1">
          <span className="text-xs font-bold uppercase text-slate-500">Nơi nhận</span>
          <select className={inputClass} value={receiver} onChange={(event) => onReceiverChange(event.target.value)}>
            <option value="Tất cả">Tất cả nơi nhận</option>
            {receiverOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  )
}

export function ActionButton({ title, children, tone = 'blue', ...props }) {
  const toneClass = {
    blue: 'text-blue-700 hover:bg-blue-50',
    emerald: 'text-emerald-700 hover:bg-emerald-50',
    amber: 'text-amber-700 hover:bg-amber-50',
    slate: 'text-slate-600 hover:bg-slate-100',
    red: 'text-red-700 hover:bg-red-50',
  }[tone]

  return (
    <button
      className={`grid size-9 place-items-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-40 ${toneClass}`}
      type="button"
      title={title}
      aria-label={title}
      {...props}
    >
      {children}
    </button>
  )
}
