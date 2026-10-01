import { CircleCheck, Printer, SquarePen } from 'lucide-react'
import {
  ActionButton,
  StatusBadge,
} from '../../page/mealFlowPageComponents'
import { formatDateTime } from '../../page/mealFlowUtils'

function MealImportTable({ rows, onConfirm, onEdit }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 sm:p-5">
      <h3 className="text-xl font-bold tracking-normal text-slate-950">
        Danh sách phiếu nhập
      </h3>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[1120px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-sm text-slate-500">
              {['Mã phiếu', 'Tên món', 'Mẻ chế biến', 'Số lượng', 'Thời gian nhập', 'Người nhập', 'Khu vực nhận', 'Trạng thái', 'Thao tác'].map((header) => (
                <th className="px-3 py-2 font-semibold" key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="bg-blue-50/60 transition hover:bg-blue-100/70" key={row.id}>
                <td className="rounded-l-xl px-3 py-4 text-sm font-bold text-blue-700">{row.id}</td>
                <td className="px-3 py-4 text-sm font-bold text-slate-950">{row.dish?.name}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.batchCode}</td>
                <td className="px-3 py-4 text-sm font-bold text-slate-900">{row.quantity} {row.dish?.unit}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{formatDateTime(row.importedAt)}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.importedBy}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.receiverArea}</td>
                <td className="px-3 py-4"><StatusBadge status={row.status} /></td>
                <td className="rounded-r-xl px-3 py-4">
                  <div className="flex justify-end gap-1.5">
                    <ActionButton title="In phiếu" tone="slate"><Printer size={17} aria-hidden="true" /></ActionButton>
                    <ActionButton title="Sửa" tone="blue" disabled={row.status === 'Đã xác nhận'} onClick={() => onEdit(row)}><SquarePen size={17} aria-hidden="true" /></ActionButton>
                    <ActionButton title="Xác nhận" tone="emerald" disabled={row.status === 'Đã xác nhận'} onClick={() => onConfirm(row)}><CircleCheck size={17} aria-hidden="true" /></ActionButton>
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

export default MealImportTable
