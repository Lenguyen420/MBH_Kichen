function KitchenPlanHeader({
  title,
  description,
  actionLabel,
  actionIcon: Icon,
  onAction,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-700 via-blue-600 to-sky-400 p-5 text-white shadow-xl shadow-blue-900/15">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute bottom-0 left-8 h-20 w-40 rounded-full bg-cyan-200/20 blur-2xl" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-blue-50">
            Kế hoạch bếp
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal sm:text-4xl">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-blue-50">
            {description}
          </p>
        </div>

        {actionLabel ? (
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-blue-700 shadow-lg shadow-blue-950/10 transition hover:bg-blue-50"
            type="button"
            onClick={onAction}
          >
            {Icon ? <Icon size={18} aria-hidden="true" /> : null}
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default KitchenPlanHeader
