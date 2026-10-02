import {
  CircleCheck,
  Flame,
  HandPlatter,
  Package,
  Trash2,
  Utensils,
} from 'lucide-react'

const statIcons = {
  total: Utensils,
  processing: Flame,
  completed: CircleCheck,
  served: HandPlatter,
  remaining: Package,
  cancelled: Trash2,
}

const statTones = {
  blue: {
    card: 'bg-blue-50 border-blue-100',
    icon: 'bg-blue-600 shadow-blue-600/25',
    badge: 'bg-blue-100 text-blue-700',
  },
  amber: {
    card: 'bg-amber-50 border-amber-100',
    icon: 'bg-amber-500 shadow-amber-500/25',
    badge: 'bg-amber-100 text-amber-700',
  },
  green: {
    card: 'bg-emerald-50 border-emerald-100',
    icon: 'bg-emerald-600 shadow-emerald-500/25',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  sky: {
    card: 'bg-cyan-50 border-cyan-100',
    icon: 'bg-cyan-600 shadow-cyan-500/25',
    badge: 'bg-cyan-100 text-cyan-700',
  },
  violet: {
    card: 'bg-violet-50 border-violet-100',
    icon: 'bg-violet-600 shadow-violet-500/25',
    badge: 'bg-violet-100 text-violet-700',
  },
  red: {
    card: 'bg-rose-50 border-rose-100',
    icon: 'bg-rose-600 shadow-rose-500/25',
    badge: 'bg-rose-100 text-rose-700',
  },
  slate: {
    card: 'bg-slate-50 border-slate-200',
    icon: 'bg-slate-700 shadow-slate-500/25',
    badge: 'bg-slate-100 text-slate-700',
  },
}

function DashboardStatGrid({ onOpen, stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = statIcons[stat.key]
        const tone = statTones[stat.tone]

        return (
          <button
            className={`group relative min-h-40 overflow-hidden rounded-xl border p-6 text-left shadow-sm shadow-blue-950/5 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/10 focus:outline-none focus:ring-2 focus:ring-blue-400 ${tone.card}`}
            key={stat.key}
            type="button"
            onClick={() => onOpen(stat)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-base font-bold text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-4 text-4xl font-black tracking-normal text-slate-950">
                  {stat.value}
                </p>
              </div>
              <div className={`grid size-14 shrink-0 place-items-center rounded-lg text-white shadow-lg ${tone.icon}`}>
                <Icon size={26} aria-hidden="true" />
              </div>
            </div>

            <span className={`mt-6 inline-flex rounded-full px-3 py-1.5 text-sm font-black ${tone.badge}`}>
              {stat.note}
            </span>
            <span className="absolute bottom-5 right-5 text-sm font-black text-blue-700 opacity-0 transition group-hover:opacity-100">
              Xem chi tiết
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default DashboardStatGrid
