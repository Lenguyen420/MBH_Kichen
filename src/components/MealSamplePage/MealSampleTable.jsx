import { CheckCircle2, Pencil } from 'lucide-react'
import {
  ActionButton,
  StatusBadge,
} from '../../page/mealFlowPageComponents'
import { formatDateTime } from '../../page/mealFlowUtils'

function MealSampleTable({ rows, onEdit, onProcess, title = 'Danh sách mẫu lưu' }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 sm:p-5">
      <h3 className="text-xl font-bold tracking-normal text-slate-950">
        {title}
      </h3>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[1240px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-sm text-slate-500">
              {['Món', 'Mẻ', 'SL mẫu', 'Lấy mẫu', 'Người lấy', 'Vị trí lưu', 'Kết thúc dự kiến', 'Trạng thái', 'Hình ảnh', 'Thao tác'].map((header) => (
                <th className="px-3 py-2 font-semibold" key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="bg-blue-50/60 transition hover:bg-blue-100/70" key={row.id}>
                <td className="rounded-l-xl px-3 py-4 text-sm font-bold text-slate-950">{row.dish?.name}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.batchCode}</td>
                <td className="px-3 py-4 text-sm font-bold text-slate-800">{row.quantity}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{formatDateTime(row.sampledAt)}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.sampledBy}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{row.storageLocation}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{formatDateTime(row.expectedEndAt)}</td>
                <td className="px-3 py-4"><StatusBadge status={row.status} /></td>
                <td className="px-3 py-4 text-sm text-slate-600">
                  {row.imageUrl ? (
                    <img className="size-14 rounded-lg object-cover ring-1 ring-blue-100" src={row.imageUrl} alt={row.imageName || `Ảnh mẫu ${row.dish?.name || ''}`} />
                  ) : (
                    'Chưa có'
                  )}
                </td>
                <td className="rounded-r-xl px-3 py-4">
                  <div className="flex justify-end gap-1.5">
                    {onEdit ? (
                      <ActionButton title="Sửa mẫu" onClick={() => onEdit(row)}>
                        <Pencil size={17} aria-hidden="true" />
                      </ActionButton>
                    ) : null}
                    {onProcess ? (
                      <ActionButton title="Xử lý mẫu" tone="emerald" disabled={row.status === 'Đã xử lý'} onClick={() => onProcess(row)}>
                        <CheckCircle2 size={17} aria-hidden="true" />
                      </ActionButton>
                    ) : null}
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

export default MealSampleTable
