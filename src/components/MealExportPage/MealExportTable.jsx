import { RotateCcw } from 'lucide-react'
import {
  ActionButton,
  StatusBadge,
} from '../../page/mealFlowPageComponents'
import { formatDateTime } from '../../page/mealFlowUtils'

function MealExportTable({ rows, onRecall }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 sm:p-5">
      <h3 className="text-xl font-bold tracking-normal text-slate-950">
        Danh sách phiếu xuất
      </h3>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[1180px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-sm text-slate-500">
              {['Mã phiếu', 'Tên món', 'Số lượng', 'Nguồn mẻ', 'Nơi nhận', 'Người giao', 'Người nhận', 'Thời gian xuất', 'Trạng thái', 'Thao tác'].map((header) => (
                <th className="px-3 py-2 font-semibold" key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="bg-blue-50/60 transition hover:bg-blue-100/70" key={row.id}>
                <td className="rounded-l-xl px-3 py-4 text-sm font-bold text-blue-700">{row.id}</td>
                <td className="px-3 py-4 text-sm font-bold text-slate-950">{row.dish?.name}</td>
                <td className="px-3 py-4 text-sm font-bold text-slate-900">{row.quantity} {row.dish?.unit}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.batchCode}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.receiverPlace}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.deliveredBy}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.receivedBy || '--'}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{formatDateTime(row.exportedAt)}</td>
                <td className="px-3 py-4"><StatusBadge status={row.status} /></td>
                <td className="rounded-r-xl px-3 py-4">
                  <ActionButton title="Thu hồi" tone="amber" disabled={row.status === 'Thu hồi'} onClick={() => onRecall(row)}><RotateCcw size={17} aria-hidden="true" /></ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default MealExportTable
