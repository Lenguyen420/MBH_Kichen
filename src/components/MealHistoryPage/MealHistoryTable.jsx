import {
  StatusBadge,
} from '../../page/mealFlowPageComponents'
import { formatDateTime } from '../../page/mealFlowUtils'

function MealHistoryTable({ rows }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 sm:p-5">
      <h3 className="text-xl font-bold tracking-normal text-slate-950">
        Dòng giao dịch
      </h3>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[1180px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-sm text-slate-500">
              {['Thời gian', 'Loại', 'Món', 'SL hoàn thành', 'Số lượng', 'Mẻ', 'Nhân viên', 'Nơi nhận', 'Ghi chú'].map((header) => (
                <th className="px-3 py-2 font-semibold" key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="bg-blue-50/60 transition hover:bg-blue-100/70" key={`${row.type}-${row.id}`}>
                <td className="rounded-l-xl px-3 py-4 text-sm font-semibold text-slate-700">{formatDateTime(row.happenedAt)}</td>
                <td className="px-3 py-4"><StatusBadge status={row.type} /></td>
                <td className="px-3 py-4 text-sm font-bold text-slate-950">{row.dish?.name}</td>
                <td className="px-3 py-4 text-sm font-bold text-emerald-700">{row.completedQuantity || '--'} {row.completedQuantity ? row.dish?.unit : ''}</td>
                <td className="px-3 py-4 text-sm font-bold text-slate-900">{row.quantity} {row.dish?.unit}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.batchCode}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.actor}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.partner}</td>
                <td className="rounded-r-xl px-3 py-4 text-sm text-slate-600">{row.note || 'Không có'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default MealHistoryTable
