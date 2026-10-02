import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CircleCheck,
  History,
  PackageCheck,
  Plus,
  Printer,
  RotateCcw,
  Send,
  Trash2,
} from 'lucide-react'
import MealExportForm from '../components/MealExportPage/MealExportForm'
import MealExportTable from '../components/MealExportPage/MealExportTable'
import MealHistoryTable from '../components/MealHistoryPage/MealHistoryTable'
import MealImportForm from '../components/MealImportPage/MealImportForm'
import MealImportTable from '../components/MealImportPage/MealImportTable'
import MealInventoryEditForm from '../components/MealInventoryPage/MealInventoryEditForm'
import MealInventoryTable from '../components/MealInventoryPage/MealInventoryTable'
import FormModal from '../components/KitchenPlan/FormModal'
import KitchenPlanHeader from '../components/KitchenPlan/KitchenPlanHeader'
import {
  buildHistoryRows,
  createMealFlowId,
  exportStatusOptions,
  getNetExportedQuantity,
  importStatusOptions,
  inventoryStatusOptions,
  readStoredMealExports,
  readStoredMealImports,
  saveStoredMealExports,
  saveStoredMealImports,
  transactionTypeOptions,
} from '../datas/mealFlowData'
import { isRowShiftLocked } from '../datas/shiftCloseData'
import {
  FlowFilters,
  SummaryCards,
} from './mealFlowPageComponents'
import {
  getCurrentDate,
  getCurrentDateTime,
  getMealFlowState,
} from './mealFlowUtils'
import {
  createExportPayload,
} from './mealFlowPayloads'

function getImportCandidates(completedRows, mealImports) {
  return completedRows
    .map((row) => {
      const importedQuantity = mealImports
        .filter((item) => item.planId === row.planId)
        .reduce((total, item) => total + Number(item.quantity || 0), 0)

      return {
        ...row,
        availableQuantity: row.actualQuantity - importedQuantity,
      }
    })
    .filter((row) => row.availableQuantity > 0)
}

export function MealImportPage() {
  const [mealImports, setMealImports] = useState(readStoredMealImports)
  const [dateFilter, setDateFilter] = useState(getCurrentDate)
  const [ticketCodeFilter, setTicketCodeFilter] = useState('')
  const [dishFilter, setDishFilter] = useState('Tất cả')
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const [activeModal, setActiveModal] = useState(null)
  const state = getMealFlowState()
  const rows = state.importRows.filter((row) => {
    const normalizedTicketCode = ticketCodeFilter.trim().toLowerCase()
    const matchTicketCode =
      !normalizedTicketCode || row.id.toLowerCase().includes(normalizedTicketCode)
    const matchDate = row.importedAt.startsWith(dateFilter)
    const matchDish = dishFilter === 'Tất cả' || row.dishId === dishFilter
    const matchStatus = statusFilter === 'Tất cả' || row.status === statusFilter

    return matchTicketCode && matchDate && matchDish && matchStatus
  })
  const candidates = getImportCandidates(
    state.completedRows.filter((row) => row.menu?.date === dateFilter),
    mealImports,
  )

  function saveImport(formValue) {
    const sourceRow = formValue.sourceRow

    if (isRowShiftLocked(sourceRow)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể nhập món.')
      return
    }

    const nextImport = {
      id:
        formValue.id ||
        createMealFlowId('IMP', formValue.importedAt, mealImports.length),
      cookingId: sourceRow.id,
      planId: sourceRow.planId,
      dishId: sourceRow.dish?.id,
      batchCode:
        formValue.batchCode ||
        `ME-${formValue.importedAt.slice(0, 10).replaceAll('-', '')}-${sourceRow.dish?.id.slice(-3).toUpperCase()}`,
      quantity: formValue.quantity,
      importedAt: formValue.importedAt,
      importedBy: formValue.importedBy,
      receiverArea: formValue.receiverArea,
      note: formValue.note,
      status: formValue.status || 'Chờ xác nhận',
    }
    const nextList = formValue.id
      ? mealImports.map((item) => (item.id === formValue.id ? nextImport : item))
      : [nextImport, ...mealImports]

    setMealImports(nextList)
    saveStoredMealImports(nextList)
    setActiveModal(null)
  }

  function confirmImport(row) {
    if (isRowShiftLocked(row)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể xác nhận nhập món.')
      return
    }

    const nextList = mealImports.map((item) =>
      item.id === row.id ? { ...item, status: 'Đã xác nhận' } : item,
    )

    setMealImports(nextList)
    saveStoredMealImports(nextList)
  }

  return (
    <section className="space-y-6">
      <KitchenPlanHeader title="Nhập món" description="Ghi nhận món đã hoàn thành và chính thức nhập vào khu vực sẵn sàng phục vụ." actionLabel="Tạo phiếu nhập" actionIcon={Plus} onAction={() => setActiveModal({ mode: 'create' })} />
      <SummaryCards cards={[
        { label: 'Phiếu nhập', value: state.importRows.length, icon: ArrowDownToLine },
        { label: 'Đã xác nhận', value: state.importRows.filter((row) => row.status === 'Đã xác nhận').length, icon: CircleCheck },
        { label: 'Món chờ nhập', value: candidates.length, icon: PackageCheck },
        { label: 'Tổng số lượng nhập', value: state.importRows.reduce((total, row) => total + Number(row.quantity || 0), 0), icon: Printer },
      ]} />
      <FlowFilters ticketCode={ticketCodeFilter} date={dateFilter} dish={dishFilter} status={statusFilter} dishes={state.dishList} statusOptions={importStatusOptions} onTicketCodeChange={setTicketCodeFilter} onDateChange={setDateFilter} onDishChange={setDishFilter} onStatusChange={setStatusFilter} />
      <MealImportTable
        rows={rows}
        onConfirm={confirmImport}
        onEdit={(row) => setActiveModal({ mode: 'edit', row })}
      />
      {activeModal ? (
        <FormModal title={activeModal.mode === 'edit' ? 'Chỉnh sửa phiếu nhập' : 'Tạo phiếu nhập'} description="Có thể nhập toàn bộ hoặc một phần số lượng đã hoàn thành." onClose={() => setActiveModal(null)}>
          <MealImportForm candidates={activeModal.row ? [...candidates, activeModal.row.completedRow].filter(Boolean) : candidates} importRow={activeModal.row} onCancel={() => setActiveModal(null)} onSubmit={saveImport} />
        </FormModal>
      ) : null}
    </section>
  )
}

export function MealExportPage() {
  const [mealExports, setMealExports] = useState(readStoredMealExports)
  const [dateFilter, setDateFilter] = useState(getCurrentDate)
  const [ticketCodeFilter, setTicketCodeFilter] = useState('')
  const [dishFilter, setDishFilter] = useState('Tất cả')
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const [activeModal, setActiveModal] = useState(null)
  const state = getMealFlowState()
  const availableInventory = state.inventoryRows.filter(
    (row) => row.remainingQuantity > 0 && row.status !== 'Quá hạn',
  )
  const rows = state.exportRows.filter((row) => {
    const normalizedTicketCode = ticketCodeFilter.trim().toLowerCase()
    const matchFlow = row.status !== 'Hủy'
    const matchTicketCode =
      !normalizedTicketCode || row.id.toLowerCase().includes(normalizedTicketCode)
    const matchDate = row.exportedAt.startsWith(dateFilter)
    const matchDish = dishFilter === 'Tất cả' || row.dishId === dishFilter
    const matchStatus = statusFilter === 'Tất cả' || row.status === statusFilter

    return matchFlow && matchTicketCode && matchDate && matchDish && matchStatus
  })

  function saveExport(formValue) {
    if (isRowShiftLocked(formValue.sourceRow)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể xuất món.')
      return
    }

    const nextList = [createExportPayload(formValue, mealExports.length), ...mealExports]

    setMealExports(nextList)
    saveStoredMealExports(nextList)
    setActiveModal(null)
  }

  function recallExport(row) {
    if (isRowShiftLocked(row.sourceImport)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể thu hồi món.')
      return
    }

    const nextExport = {
      ...row,
      id: createMealFlowId('EXP', getCurrentDateTime(), mealExports.length),
      quantity: Math.min(row.quantity, 10),
      exportedAt: getCurrentDateTime(),
      note: `Thu hồi từ phiếu ${row.id}`,
      status: 'Thu hồi',
    }
    const nextList = [nextExport, ...mealExports]

    setMealExports(nextList)
    saveStoredMealExports(nextList)
  }

  return (
    <section className="space-y-6">
      <KitchenPlanHeader title="Xuất món" description="Ghi nhận món rời khỏi bếp để đi bán, phục vụ hoặc thu hồi phần chưa dùng." actionLabel="Tạo phiếu xuất" actionIcon={Send} onAction={() => setActiveModal({ mode: 'create' })} />
      <SummaryCards cards={[
        { label: 'Phiếu xuất', value: state.exportRows.filter((row) => row.status === 'Đã xuất').length, icon: ArrowUpFromLine },
        { label: 'Đã thu hồi', value: state.exportRows.filter((row) => row.status === 'Thu hồi').length, icon: RotateCcw },
        { label: 'Mẻ còn xuất được', value: availableInventory.length, icon: PackageCheck },
        { label: 'Tổng xuất ròng', value: state.importRows.reduce((total, row) => total + getNetExportedQuantity(state.exportList, row.id), 0), icon: Send },
      ]} />
      <FlowFilters ticketCode={ticketCodeFilter} date={dateFilter} dish={dishFilter} status={statusFilter} dishes={state.dishList} statusOptions={exportStatusOptions} onTicketCodeChange={setTicketCodeFilter} onDateChange={setDateFilter} onDishChange={setDishFilter} onStatusChange={setStatusFilter} />
      <MealExportTable rows={rows} onRecall={recallExport} />
      {activeModal ? (
        <FormModal title="Tạo phiếu xuất" description="Xuất một phần hoặc xuất bổ sung từ các mẻ còn tồn hợp lệ." onClose={() => setActiveModal(null)}>
          <MealExportForm inventoryRows={availableInventory} onCancel={() => setActiveModal(null)} onSubmit={saveExport} />
        </FormModal>
      ) : null}
    </section>
  )
}

export function MealInventoryPage() {
  const navigate = useNavigate()
  const [dateFilter, setDateFilter] = useState(getCurrentDate)
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const [dishFilter, setDishFilter] = useState('Tất cả')
  const [activeModal, setActiveModal] = useState(null)
  const [mealImports, setMealImports] = useState(readStoredMealImports)
  const [mealExports, setMealExports] = useState(readStoredMealExports)
  const state = getMealFlowState()
  const rows = state.inventoryRows.filter((row) => {
    const matchDate = row.importedAt.startsWith(dateFilter)
    const matchDish = dishFilter === 'Tất cả' || row.dishId === dishFilter
    const matchStatus = statusFilter === 'Tất cả' || row.status === statusFilter

    return matchDate && matchDish && matchStatus
  })

  function saveExport(formValue) {
    if (isRowShiftLocked(formValue.sourceRow)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể xuất món.')
      return
    }

    const nextList = [createExportPayload(formValue, mealExports.length), ...mealExports]

    setMealExports(nextList)
    saveStoredMealExports(nextList)
    setActiveModal(null)
  }

  function saveInventoryEdit(formValue) {
    const sourceRow = state.inventoryRows.find((row) => row.id === formValue.id)

    if (isRowShiftLocked(sourceRow)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể sửa tồn món.')
      return
    }

    const nextList = mealImports.map((item) =>
      item.id === formValue.id
        ? {
            ...item,
            quantity: formValue.quantity,
            importedAt: formValue.importedAt,
            importedBy: formValue.importedBy,
            receiverArea: formValue.receiverArea,
            note: formValue.note,
          }
        : item,
    )

    setMealImports(nextList)
    saveStoredMealImports(nextList)
    setActiveModal(null)
  }

  return (
    <section className="space-y-6">
      <KitchenPlanHeader title="Món còn lại" description="Theo dõi số lượng món đã nhập, đã xuất và còn lại theo thời gian sử dụng." actionLabel="Xuất thêm" actionIcon={Send} onAction={() => setActiveModal({ mode: 'export' })} />
      <SummaryCards cards={[
        { label: 'Mẻ còn tồn', value: rows.filter((row) => row.remainingQuantity > 0).length, icon: PackageCheck },
        { label: 'Sắp hết hạn', value: rows.filter((row) => row.status === 'Sắp hết hạn').length, icon: History },
        { label: 'Quá hạn', value: rows.filter((row) => row.status === 'Quá hạn').length, icon: Trash2 },
        { label: 'Tổng còn', value: rows.reduce((total, row) => total + Math.max(row.remainingQuantity, 0), 0), icon: ArrowDownToLine },
      ]} />
      <FlowFilters date={dateFilter} dish={dishFilter} status={statusFilter} dishes={state.dishList} statusOptions={inventoryStatusOptions} onDateChange={setDateFilter} onDishChange={setDishFilter} onStatusChange={setStatusFilter} />
      <MealInventoryTable
        rows={rows}
        onCancel={(row) => navigate(`/dashboard/inventory/cancel?importId=${row.id}`)}
        onEdit={(row) => setActiveModal({ mode: 'edit', row })}
        onExport={(row) => setActiveModal({ mode: 'export', row })}
      />
      {activeModal ? (
        <FormModal
          title={
            activeModal.mode === 'edit'
                ? 'Sửa thông tin tồn món'
                : 'Xuất thêm từ tồn món'
          }
          description={
            activeModal.mode === 'edit'
                ? 'Cập nhật thông tin phiếu nhập nguồn của mẻ còn lại.'
                : 'Chọn mẻ còn trong thời gian sử dụng để xuất bổ sung.'
          }
          onClose={() => setActiveModal(null)}
        >
          {activeModal.mode === 'edit' ? (
            <MealInventoryEditForm row={activeModal.row} onCancel={() => setActiveModal(null)} onSubmit={saveInventoryEdit} />
          ) : (
            <MealExportForm inventoryRows={activeModal.row ? [activeModal.row] : state.inventoryRows.filter((row) => row.remainingQuantity > 0 && row.status !== 'Quá hạn')} onCancel={() => setActiveModal(null)} onSubmit={saveExport} />
          )}
        </FormModal>
      ) : null}
    </section>
  )
}

export function MealHistoryPage() {
  const state = useMemo(() => getMealFlowState(), [])
  const [dateFilter, setDateFilter] = useState(getCurrentDate)
  const [dishFilter, setDishFilter] = useState('Tất cả')
  const [typeFilter, setTypeFilter] = useState('Tất cả')
  const [shiftFilter, setShiftFilter] = useState('Tất cả')
  const [staffFilter, setStaffFilter] = useState('Tất cả')
  const [receiverFilter, setReceiverFilter] = useState('Tất cả')
  const historyRows = buildHistoryRows(state.importRows, state.exportRows)
  const staffOptions = [...new Set(historyRows.map((row) => row.actor).filter(Boolean))]
  const receiverOptions = [...new Set(historyRows.map((row) => row.partner).filter(Boolean))]
  const rows = historyRows.filter((row) => {
    const completedRow = state.importRows.find((item) => item.batchCode === row.batchCode)?.completedRow
    const matchDate = row.happenedAt.startsWith(dateFilter)
    const matchDish = dishFilter === 'Tất cả' || row.dish?.id === dishFilter
    const matchType = typeFilter === 'Tất cả' || row.type === typeFilter
    const matchShift = shiftFilter === 'Tất cả' || completedRow?.menu?.shift === shiftFilter
    const matchStaff = staffFilter === 'Tất cả' || row.actor === staffFilter
    const matchReceiver = receiverFilter === 'Tất cả' || row.partner === receiverFilter

    return matchDate && matchDish && matchType && matchShift && matchStaff && matchReceiver
  })

  return (
    <section className="space-y-6">
      <KitchenPlanHeader title="Lịch sử nhập - xuất" description="Tra cứu toàn bộ luồng món đi vào, đi ra và các lần thu hồi trong ca." actionLabel="Dữ liệu chốt ca" actionIcon={History} />
      <SummaryCards cards={[
        { label: 'Giao dịch', value: historyRows.length, icon: History },
        { label: 'Nhập món', value: historyRows.filter((row) => row.type === 'Nhập món').length, icon: ArrowDownToLine },
        { label: 'Xuất món', value: historyRows.filter((row) => row.type === 'Xuất món').length, icon: ArrowUpFromLine },
        { label: 'Thu hồi', value: historyRows.filter((row) => row.type === 'Thu hồi').length, icon: RotateCcw },
        { label: 'Hủy', value: historyRows.filter((row) => row.type === 'Hủy').length, icon: Trash2 },
      ]} />
      <FlowFilters date={dateFilter} dish={dishFilter} type={typeFilter} shift={shiftFilter} staff={staffFilter} receiver={receiverFilter} dishes={state.dishList} typeOptions={transactionTypeOptions} staffOptions={staffOptions} receiverOptions={receiverOptions} onDateChange={setDateFilter} onDishChange={setDishFilter} onTypeChange={setTypeFilter} onShiftChange={setShiftFilter} onStaffChange={setStaffFilter} onReceiverChange={setReceiverFilter} />
      <MealHistoryTable rows={rows} />
    </section>
  )
}
