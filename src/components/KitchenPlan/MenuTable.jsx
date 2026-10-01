import { Copy, Eye, LockKeyhole, SquarePen } from 'lucide-react'
import { getMenuDishes } from '../../datas/kitchenPlanData'

function MenuTable({ menus, dishList, onView, onEdit, onCopy, onLock }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-blue-700">
            Thực đơn
          </p>
          <h3 className="mt-1 text-xl font-bold tracking-normal text-slate-950">
            Danh sách thực đơn theo ngày
          </h3>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[920px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-sm text-slate-500">
              <th className="px-3 py-2 font-semibold">Ngày</th>
              <th className="px-3 py-2 font-semibold">Bữa</th>
              <th className="px-3 py-2 font-semibold">Ca</th>
              <th className="px-3 py-2 font-semibold">Tên thực đơn</th>
              <th className="px-3 py-2 font-semibold">Món trong thực đơn</th>
              <th className="px-3 py-2 font-semibold">Lưu mẫu</th>
              <th className="px-3 py-2 font-semibold">Trạng thái</th>
              <th className="px-3 py-2 font-semibold">Tổng món</th>
              <th className="px-3 py-2 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => {
              const menuDishes = getMenuDishes(menu, dishList)

              return (
                <tr className="bg-blue-50/60 transition hover:bg-blue-100/70" key={menu.id}>
                  <td className="rounded-l-xl px-3 py-4 text-sm font-bold text-blue-700">
                    {menu.date}
                  </td>
                  <td className="px-3 py-4 text-sm font-semibold text-slate-700">
                    {menu.meal}
                  </td>
                  <td className="px-3 py-4 text-sm font-semibold text-slate-700">
                    {menu.shift}
                  </td>
                  <td className="px-3 py-4 text-sm font-bold text-slate-950">
                    {menu.title}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    <div className="flex flex-wrap gap-2">
                      {menuDishes.map((dish) => (
                        <span
                          className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100"
                          key={dish.id}
                          title={`${dish.group} - ${dish.standardPortion} - ${dish.cookDuration} phút`}
                        >
                          {dish.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm font-bold text-slate-700">
                    {menuDishes.filter((dish) => dish.requiresSample).length} món
                  </td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${menu.locked ? 'bg-slate-100 text-slate-700 ring-slate-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-100'}`}>
                      {menu.locked ? 'Đã khóa' : 'Đang mở'}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm font-black text-slate-950">
                    {menuDishes.length}
                  </td>
                  <td className="rounded-r-xl px-3 py-4">
                    <div className="flex justify-end gap-1.5">
                      <button
                        className="grid size-9 place-items-center rounded-lg text-blue-700 transition hover:bg-blue-50"
                        type="button"
                        title="Xem thực đơn"
                        aria-label="Xem thực đơn"
                        onClick={() => onView(menu)}
                      >
                        <Eye size={17} aria-hidden="true" />
                      </button>
                      <button
                        className="grid size-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100"
                        type="button"
                        title="Cập nhật thực đơn"
                        aria-label="Cập nhật thực đơn"
                        onClick={() => onEdit(menu)}
                      >
                        <SquarePen size={17} aria-hidden="true" />
                      </button>
                      <button
                        className="grid size-9 place-items-center rounded-lg text-violet-700 transition hover:bg-violet-50"
                        type="button"
                        title="Sao chép thực đơn"
                        aria-label="Sao chép thực đơn"
                        onClick={() => onCopy(menu)}
                      >
                        <Copy size={17} aria-hidden="true" />
                      </button>
                      <button
                        className="grid size-9 place-items-center rounded-lg text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                        type="button"
                        title="Khóa thực đơn"
                        aria-label="Khóa thực đơn"
                        disabled={menu.locked}
                        onClick={() => onLock(menu)}
                      >
                        <LockKeyhole size={17} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default MenuTable
