import { CalendarCheck, ChefHat, Clock3, Soup } from 'lucide-react'

const summaryCards = [
  {
    key: 'totalDishes',
    label: 'Món cần làm',
    icon: Soup,
    tone: 'bg-blue-50 border-blue-100 text-blue-700',
    iconTone: 'bg-blue-600',
  },
  {
    key: 'totalQuantity',
    label: 'Số lượng dự kiến',
    icon: ChefHat,
    tone: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    iconTone: 'bg-emerald-600',
  },
  {
    key: 'latestDeadline',
    label: 'Hoàn thành muộn nhất',
    icon: Clock3,
    tone: 'bg-amber-50 border-amber-100 text-amber-700',
    iconTone: 'bg-amber-500',
  },
  {
    key: 'activeMenus',
    label: 'Thực đơn liên quan',
    icon: CalendarCheck,
    tone: 'bg-violet-50 border-violet-100 text-violet-700',
    iconTone: 'bg-violet-600',
  },
]

function PlanSummaryCards({ summary }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summaryCards.map((card) => {
        const Icon = card.icon

        return (
          <article
            className={`rounded-xl border p-5 shadow-sm shadow-blue-950/5 ${card.tone}`}
            key={card.key}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">{card.label}</p>
                <p className="mt-3 text-3xl font-black tracking-normal text-slate-950">
                  {summary[card.key]}
                </p>
              </div>
              <div className={`grid size-12 place-items-center rounded-lg text-white shadow-lg ${card.iconTone}`}>
                <Icon size={23} aria-hidden="true" />
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default PlanSummaryCards
