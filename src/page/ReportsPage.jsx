import { useMemo, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Eye,
  FileText,
  FlaskConical,
  Printer,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import KitchenPlanHeader from '../components/KitchenPlan/KitchenPlanHeader'
import {
  ActionButton,
  StatusBadge,
  SummaryCards,
} from './mealFlowPageComponents'
import {
  formatDateTime,
  getCurrentDate,
  getMealFlowState,
  inputClass,
} from './mealFlowUtils'

const reportTypeOptions = [
  'Tất cả',
  'Phiếu nhập',
  'Phiếu xuất',
  'Thu hồi',
  'Hủy món',
  'Lưu mẫu',
  'Tồn món',
]

function normalizePrintFileName(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getReportRows(state) {
  const importRows = state.importRows.map((row) => ({
    id: `import-${row.id}`,
    code: row.id,
    type: 'Phiếu nhập',
    happenedAt: row.importedAt,
    dish: row.dish,
    dishId: row.dishId,
    batchCode: row.batchCode,
    quantity: row.quantity,
    actor: row.importedBy,
    partner: row.receiverArea,
    status: row.status,
    source: row,
  }))
  const exportRows = state.exportRows.map((row) => ({
    id: `export-${row.id}`,
    code: row.id,
    type:
      row.status === 'Thu hồi'
        ? 'Thu hồi'
        : row.status === 'Hủy'
          ? 'Hủy món'
          : 'Phiếu xuất',
    happenedAt: row.exportedAt,
    dish: row.dish,
    dishId: row.dishId,
    batchCode: row.batchCode,
    quantity: row.quantity,
    actor: row.deliveredBy,
    partner: row.receiverPlace,
    status: row.status,
    source: row,
  }))
  const sampleRows = state.sampleRows.map((row) => ({
    id: `sample-${row.id}`,
    code: row.id,
    type: 'Lưu mẫu',
    happenedAt: row.sampledAt,
    dish: row.dish,
    dishId: row.dishId,
    batchCode: row.batchCode,
    quantity: row.quantity,
    actor: row.sampledBy,
    partner: row.storageLocation,
    status: row.status,
    source: row,
  }))
  const inventoryRows = state.inventoryRows.map((row) => ({
    id: `inventory-${row.id}`,
    code: row.id,
    type: 'Tồn món',
    happenedAt: row.importedAt,
    dish: row.dish,
    dishId: row.dishId,
    batchCode: row.batchCode,
    quantity: row.remainingQuantity,
    actor: row.importedBy,
    partner: row.receiverArea,
    status: row.status,
    source: row,
  }))

  return [...importRows, ...exportRows, ...sampleRows, ...inventoryRows].sort(
    (left, right) => right.happenedAt.localeCompare(left.happenedAt),
  )
}

function ReportFilters({
  date,
  ticketCode,
  type,
  dish,
  dishes,
  onDateChange,
  onDishChange,
  onTicketCodeChange,
  onTypeChange,
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 md:grid-cols-2 xl:grid-cols-4">
      <label className="space-y-1">
        <span className="text-xs font-bold uppercase text-slate-500">Ngày</span>
        <input className={inputClass} type="date" value={date} onChange={(event) => onDateChange(event.target.value)} />
      </label>
      <label className="space-y-1">
        <span className="text-xs font-bold uppercase text-slate-500">Mã phiếu</span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" size={17} aria-hidden="true" />
          <input className={`${inputClass} pl-9`} type="search" placeholder="IMP, EXP, CAN, SAM..." value={ticketCode} onChange={(event) => onTicketCodeChange(event.target.value)} />
        </div>
      </label>
      <label className="space-y-1">
        <span className="text-xs font-bold uppercase text-slate-500">Loại phiếu</span>
        <select className={inputClass} value={type} onChange={(event) => onTypeChange(event.target.value)}>
          {reportTypeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
      <label className="space-y-1">
        <span className="text-xs font-bold uppercase text-slate-500">Món</span>
        <select className={inputClass} value={dish} onChange={(event) => onDishChange(event.target.value)}>
          <option value="Tất cả">Tất cả món</option>
          {dishes.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </label>
    </div>
  )
}

function ReportTable({ rows, onView }) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-950/5 sm:p-5">
      <h3 className="text-xl font-bold tracking-normal text-slate-950">
        Danh sách báo cáo
      </h3>
      <div className="mt-5 overflow-x-auto xl:overflow-x-visible">
        <table className="w-full min-w-[980px] table-fixed border-separate border-spacing-y-2 text-left xl:min-w-0">
          <thead>
            <tr className="text-sm text-slate-500">
              {['Thời gian', 'Loại', 'Mã phiếu', 'Món', 'Mẻ', 'Số lượng', 'Người thực hiện', 'Trạng thái', 'Thao tác'].map((header) => (
                <th className="px-3 py-2 font-semibold" key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="bg-blue-50/60 transition hover:bg-blue-100/70" key={row.id}>
                <td className="rounded-l-xl px-3 py-4 text-sm font-semibold text-slate-700">{formatDateTime(row.happenedAt)}</td>
                <td className="px-3 py-4"><StatusBadge status={row.type} /></td>
                <td className="break-words px-3 py-4 text-sm font-bold text-blue-700">{row.code}</td>
                <td className="break-words px-3 py-4 text-sm font-bold text-slate-950">{row.dish?.name || '--'}</td>
                <td className="break-words px-3 py-4 text-sm text-slate-600">{row.batchCode || '--'}</td>
                <td className="px-3 py-4 text-sm font-bold text-slate-900">{row.quantity} {row.dish?.unit || ''}</td>
                <td className="break-words px-3 py-4 text-sm text-slate-600">{row.actor || '--'}</td>
                <td className="px-3 py-4"><StatusBadge status={row.status} /></td>
                <td className="rounded-r-xl px-3 py-4">
                  <div className="flex justify-end">
                    <ActionButton title="Xem chi tiết" onClick={() => onView(row)}>
                      <Eye size={17} aria-hidden="true" />
                    </ActionButton>
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

function getDetailPairs(row) {
  const source = row.source
  const commonPairs = [
    ['Loại phiếu', row.type],
    ['Mã phiếu', row.code],
    ['Thời gian', formatDateTime(row.happenedAt)],
    ['Tên món', row.dish?.name || '--'],
    ['Mã mẻ', row.batchCode || '--'],
    ['Số lượng', `${row.quantity} ${row.dish?.unit || ''}`],
    ['Người thực hiện', row.actor || '--'],
    ['Đối tượng/Nơi nhận', row.partner || '--'],
    ['Trạng thái', row.status || '--'],
  ]

  if (row.type === 'Phiếu nhập') {
    return [
      ...commonPairs,
      ['Khu vực nhận', source.receiverArea || '--'],
      ['Ghi chú', source.note || 'Không có'],
    ]
  }

  if (row.type === 'Phiếu xuất' || row.type === 'Thu hồi') {
    return [
      ...commonPairs,
      ['Người nhận', source.receivedBy || '--'],
      ['Ghi chú', source.note || 'Không có'],
    ]
  }

  if (row.type === 'Hủy món') {
    return [
      ...commonPairs,
      ['Nguồn hủy', source.cancelSource || '--'],
      ['Người xác nhận', source.confirmedBy || source.receivedBy || '--'],
      ['Lý do hủy', source.note || 'Không có'],
    ]
  }

  if (row.type === 'Lưu mẫu') {
    return [
      ...commonPairs,
      ['Vị trí lưu', source.storageLocation || '--'],
      ['Bắt đầu lưu', formatDateTime(source.storageStartedAt)],
      ['Dự kiến kết thúc', formatDateTime(source.expectedEndAt)],
      ['Thời gian xử lý', formatDateTime(source.processedAt)],
      ['Người xử lý', source.processedBy || '--'],
      ['Ghi chú', source.note || 'Không có'],
    ]
  }

  return [
    ...commonPairs,
    ['Số lượng nhập', `${source.importedQuantity || 0} ${row.dish?.unit || ''}`],
    ['Số lượng đã xuất/hủy', `${source.exportedQuantity || 0} ${row.dish?.unit || ''}`],
    ['Hạn sử dụng', formatDateTime(source.expiresAt)],
  ]
}

function ReportDetailModal({ row, onClose }) {
  const detailPairs = getDetailPairs(row)
  const imageUrl = row.source?.imageUrl
  const imageName = row.source?.imageName
  const reportTitle = `Báo cáo chi tiết ${row.type.toLowerCase()}`
  const printFileName = normalizePrintFileName(`${reportTitle}-${row.code}`)

  function printDetail() {
    const printSource = document.getElementById('report-detail-print')

    if (!printSource) {
      return
    }

    const printClone = printSource.cloneNode(true)

    printClone.querySelectorAll('style').forEach((styleElement) => {
      styleElement.remove()
    })

    const printFrame = document.createElement('iframe')

    printFrame.style.position = 'fixed'
    printFrame.style.right = '0'
    printFrame.style.bottom = '0'
    printFrame.style.width = '1px'
    printFrame.style.height = '1px'
    printFrame.style.border = '0'
    printFrame.style.opacity = '0'
    document.body.appendChild(printFrame)

    const printDocument = printFrame.contentWindow?.document

    if (!printDocument) {
      printFrame.remove()
      return
    }

    printDocument.open()
    printDocument.write(`
      <html>
        <head>
          <title>${printFileName}</title>
          <style>
            @page { size: A4; margin: 0; }
            * { box-sizing: border-box; }
            html, body { margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; color: #0f172a; }
            .print-page { padding: 16mm; }
            h1 { margin: 0; font-size: 22px; text-align: center; text-transform: uppercase; }
            .meta { margin: 8px 0 20px; text-align: center; font-size: 13px; color: #475569; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th, td { border: 1px solid #94a3b8; padding: 8px 10px; vertical-align: top; }
            th { background: #dbeafe; text-align: left; text-transform: uppercase; }
            .section-title { margin: 18px 0 8px; font-weight: 700; }
            img { max-width: 320px; max-height: 240px; object-fit: contain; }
          </style>
        </head>
        <body><main class="print-page">${printClone.innerHTML}</main></body>
      </html>
    `)
    printDocument.close()

    const previousTitle = document.title

    document.title = printFileName

    window.setTimeout(() => {
      printFrame.contentWindow?.focus()
      printFrame.contentWindow?.print()
      window.setTimeout(() => {
        document.title = previousTitle
        printFrame.remove()
      }, 1000)
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 py-6">
      <section className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl shadow-slate-950/25">
        <div className="flex items-start justify-between gap-4 border-b border-blue-100 pb-4">
          <div>
            <p className="text-sm font-bold uppercase text-blue-700">Chi tiết báo cáo</p>
            <h3 className="mt-1 text-2xl font-black tracking-normal text-slate-950">{reportTitle} - {row.code}</h3>
          </div>
          <button className="grid size-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" type="button" aria-label="Đóng" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div id="report-detail-print" className="mt-5">
          <style>
            {'@media print { @page { size: A4; margin: 0; } body * { visibility: hidden; } #report-detail-print, #report-detail-print * { visibility: visible; } #report-detail-print { position: absolute; inset: 0; margin: 0; padding: 16mm; } }'}
          </style>
          <h1 className="text-center text-2xl font-black uppercase tracking-normal text-slate-950">
            {reportTitle}
          </h1>
          <p className="mt-2 text-center text-sm font-semibold text-slate-500">
            KIDO CANTEEN - Quản lý Bếp - Mã phiếu: {row.code}
          </p>
          <div className="mt-5">
            <table className="w-full table-fixed border-collapse text-sm">
              <colgroup>
                <col className="w-16" />
                <col className="w-1/3" />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th className="border border-slate-300 bg-blue-100 px-3 py-2 text-left font-black uppercase text-slate-800">STT</th>
                  <th className="border border-slate-300 bg-blue-100 px-3 py-2 text-left font-black uppercase text-slate-800">Thông số</th>
                  <th className="border border-slate-300 bg-blue-100 px-3 py-2 text-left font-black uppercase text-slate-800">Giá trị</th>
                </tr>
              </thead>
              <tbody>
                {detailPairs.map(([label, value], index) => (
                  <tr key={label}>
                    <td className="border border-slate-300 px-3 py-2 font-bold text-slate-700">{index + 1}</td>
                    <td className="border border-slate-300 px-3 py-2 font-bold text-slate-900">{label}</td>
                    <td className="break-words border border-slate-300 px-3 py-2 text-slate-700">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {imageUrl ? (
            <div className="mt-5">
              <p className="mb-2 font-bold uppercase text-slate-700">Hình ảnh đính kèm</p>
              <img className="max-h-80 rounded-xl object-contain ring-1 ring-slate-200" src={imageUrl} alt={imageName || `Ảnh ${row.code}`} />
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-blue-100 pt-4">
          <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50" type="button" onClick={onClose}>Đóng</button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700" type="button" onClick={printDetail}>
            <Printer size={17} aria-hidden="true" />
            In chi tiết
          </button>
        </div>
      </section>
    </div>
  )
}

function ReportsPage() {
  const [dateFilter, setDateFilter] = useState(getCurrentDate)
  const [ticketCodeFilter, setTicketCodeFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('Tất cả')
  const [dishFilter, setDishFilter] = useState('Tất cả')
  const [detailRow, setDetailRow] = useState(null)
  const state = getMealFlowState()
  const reportRows = getReportRows(state)
  const rows = useMemo(() => {
    const keyword = ticketCodeFilter.trim().toLowerCase()

    return reportRows.filter((row) => {
      const matchDate = row.happenedAt.startsWith(dateFilter)
      const matchCode = !keyword || row.code.toLowerCase().includes(keyword)
      const matchType = typeFilter === 'Tất cả' || row.type === typeFilter
      const matchDish = dishFilter === 'Tất cả' || row.dishId === dishFilter

      return matchDate && matchCode && matchType && matchDish
    })
  }, [dateFilter, dishFilter, reportRows, ticketCodeFilter, typeFilter])

  return (
    <section className="space-y-6">
      <KitchenPlanHeader title="Báo cáo" description="Tra cứu phiếu nhập, phiếu xuất, hủy món, lưu mẫu và tồn món theo ngày, mã phiếu hoặc loại phiếu." actionIcon={FileText} />
      <SummaryCards cards={[
        { label: 'Tổng dòng', value: rows.length, icon: FileText },
        { label: 'Phiếu nhập', value: rows.filter((row) => row.type === 'Phiếu nhập').length, icon: ArrowDownToLine },
        { label: 'Phiếu xuất', value: rows.filter((row) => row.type === 'Phiếu xuất').length, icon: ArrowUpFromLine },
        { label: 'Hủy/Lưu mẫu/Tồn', value: rows.filter((row) => ['Hủy món', 'Lưu mẫu', 'Tồn món'].includes(row.type)).length, icon: rows.some((row) => row.type === 'Hủy món') ? Trash2 : FlaskConical },
      ]} />
      <ReportFilters
        date={dateFilter}
        dish={dishFilter}
        dishes={state.dishList}
        ticketCode={ticketCodeFilter}
        type={typeFilter}
        onDateChange={setDateFilter}
        onDishChange={setDishFilter}
        onTicketCodeChange={setTicketCodeFilter}
        onTypeChange={setTypeFilter}
      />
      <ReportTable rows={rows} onView={setDetailRow} />
      {detailRow ? (
        <ReportDetailModal row={detailRow} onClose={() => setDetailRow(null)} />
      ) : null}
    </section>
  )
}

export default ReportsPage
