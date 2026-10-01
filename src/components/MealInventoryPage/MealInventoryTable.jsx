import { Send } from 'lucide-react'
import {
  ActionButton,
  StatusBadge,
} from '../../page/mealFlowPageComponents'
import {
  formatDateTimeWithPeriod,
} from '../../page/mealFlowUtils'

function MealInventoryTable({ rows, onCancel, onEdit, onExport }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 sm:p-5">
      <h3 className="text-xl font-bold tracking-normal text-slate-950">
        Tồn món theo mẻ
      </h3>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[1140px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-sm text-slate-500">
              {['Tên món', 'Mẻ', 'SL nhập', 'SL đã xuất', 'SL còn', 'Hoàn thành', 'Hạn sử dụng', 'Trạng thái', 'Thao tác'].map((header) => (
                <th className="px-3 py-2 font-semibold" key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="bg-blue-50/60 transition hover:bg-blue-100/70" key={row.id}>
                <td className="rounded-l-xl px-3 py-4 text-sm font-bold text-slate-950">{row.dish?.name}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.batchCode}</td>
                <td className="px-3 py-4 text-sm font-semibold text-slate-700">{row.importedQuantity} {row.dish?.unit}</td>
                <td className="px-3 py-4 text-sm font-semibold text-slate-700">{row.exportedQuantity} {row.dish?.unit}</td>
                <td className="px-3 py-4 text-sm font-black text-slate-950">{Math.max(row.remainingQuantity, 0)} {row.dish?.unit}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{formatDateTimeWithPeriod(row.completedRow?.completedAt ? `${row.completedRow.menu?.date}T${row.completedRow.completedAt}` : row.importedAt)}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{formatDateTimeWithPeriod(row.expiresAt)}</td>
                <td className="px-3 py-4"><StatusBadge status={row.status} /></td>
                <td className="rounded-r-xl px-3 py-4">
                  <div className="flex justify-end gap-1.5">
                    <ActionButton title="Xuất thêm" tone="emerald" disabled={row.remainingQuantity <= 0 || row.status === 'Quá hạn'} onClick={() => onExport(row)}><Send size={17} aria-hidden="true" /></ActionButton>
                    <button
                      className="h-9 rounded-lg px-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                      type="button"
                      onClick={() => onEdit(row)}
                    >
                      Sửa
                    </button>
                    <button
                      className="h-9 rounded-lg px-3 text-sm font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      type="button"
                      disabled={row.remainingQuantity <= 0}
                      onClick={() => onCancel(row)}
                    >
                      Hủy
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default MealInventoryTable
