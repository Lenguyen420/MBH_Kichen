function StatCard({ icon: Icon, label, value, tone = 'emerald' }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    sky: 'bg-sky-50 text-sky-700',
  }

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
            {value}
          </p>
        </div>
        <div className={`grid size-11 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon size={22} aria-hidden="true" />
        </div>
      </div>
    </article>
  )
}

export default StatCard
