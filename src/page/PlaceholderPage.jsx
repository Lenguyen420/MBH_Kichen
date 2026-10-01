import { useLocation } from 'react-router-dom'
import { navigationItems } from '../datas/navigation'

function PlaceholderPage() {
  const location = useLocation()
  const item = navigationItems
    .flatMap((menu) => menu.children || [menu])
    .find((menu) => menu.path === location.pathname)
  const title = item?.label || 'Tổng quan bếp'

  return (
    <section className="rounded-xl border border-blue-100 bg-white p-8 shadow-sm shadow-blue-950/5">
      <p className="text-sm font-semibold uppercase text-blue-700">
        KIDO CANTEEN
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-normal text-slate-950">
        {title}
      </h2>
    </section>
  )
}

export default PlaceholderPage
