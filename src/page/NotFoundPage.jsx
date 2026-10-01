import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6">
      <p className="text-sm font-medium uppercase text-red-600">404</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
        Không tìm thấy trang
      </h2>
      <Link
        className="mt-5 inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        to="/"
      >
        Về Dashboard
      </Link>
    </section>
  )
}

export default NotFoundPage
