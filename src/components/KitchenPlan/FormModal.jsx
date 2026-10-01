import { X } from 'lucide-react'

function FormModal({ title, description, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 py-6">
      <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl shadow-slate-950/25 sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-blue-100 pb-4">
          <div>
            <h3 className="text-xl font-black tracking-normal text-slate-950">
              {title}
            </h3>
            {description ? (
              <p className="mt-1 text-sm font-medium text-slate-500">
                {description}
              </p>
            ) : null}
          </div>
          <button
            className="grid size-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            type="button"
            aria-label="Đóng"
            onClick={onClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="pt-5">{children}</div>
      </section>
    </div>
  )
}

export default FormModal
