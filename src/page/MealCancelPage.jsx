import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowDownToLine,
  History,
  PackageCheck,
  Trash2,
} from 'lucide-react'
import MealCancelSourceTable from '../components/MealCancelPage/MealCancelSourceTable'
import FormModal from '../components/KitchenPlan/FormModal'
import KitchenPlanHeader from '../components/KitchenPlan/KitchenPlanHeader'
import MealHistoryTable from '../components/MealHistoryPage/MealHistoryTable'
import MealCancelForm from '../components/MealInventoryPage/MealCancelForm'
import {
  buildHistoryRows,
  cancelSourceOptions,
  readStoredMealExports,
  saveStoredMealExports,
} from '../datas/mealFlowData'
import { isRowShiftLocked } from '../datas/shiftCloseData'
import {
  FlowFilters,
  SummaryCards,
} from './mealFlowPageComponents'
import { createCancelPayload } from './mealFlowPayloads'
import {
  getCurrentDate,
  getMealFlowState,
} from './mealFlowUtils'

function MealCancelPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mealExports, setMealExports] = useState(readStoredMealExports)
  const [dateFilter, setDateFilter] = useState(getCurrentDate)
  const [dishFilter, setDishFilter] = useState('Tất cả')
  const [sourceFilter, setSourceFilter] = useState('Tất cả')
  const state = getMealFlowState()
  const queryImportId = searchParams.get('importId')
  const rows = state.inventoryRows
    .filter((row) => row.remainingQuantity > 0)
    .filter((row) => {
      const matchDate = row.importedAt.startsWith(dateFilter)
      const matchDish = dishFilter === 'Tất cả' || row.dishId === dishFilter
      const impliedSource =
        row.status === 'Quá hạn'
          ? 'Món quá thời gian'
          : row.status === 'Tồn lớn'
            ? 'Món tồn'
            : 'Món hỏng trong chế biến'
      const matchSource = sourceFilter === 'Tất cả' || impliedSource === sourceFilter

      return matchDate && matchDish && matchSource
    })
  const cancelRows = state.exportRows.filter((row) => row.status === 'Hủy')
  const filteredCancelRows = cancelRows.filter((row) => {
    const matchDate = row.exportedAt.startsWith(dateFilter)
    const matchDish = dishFilter === 'Tất cả' || row.dishId === dishFilter
    const matchSource = sourceFilter === 'Tất cả' || row.cancelSource === sourceFilter

    return matchDate && matchDish && matchSource
  })
  const cancelHistoryRows = buildHistoryRows(state.importRows, state.exportRows)
    .filter((row) => row.type === 'Hủy')
    .filter((row) => {
      const matchDate = row.happenedAt.startsWith(dateFilter)
      const matchDish = dishFilter === 'Tất cả' || row.dish?.id === dishFilter
      const matchSource = sourceFilter === 'Tất cả' || row.cancelSource === sourceFilter

      return matchDate && matchDish && matchSource
    })
  const selectedRow = state.inventoryRows.find(
    (row) => row.id === queryImportId && row.remainingQuantity > 0,
  )
  const [activeModal, setActiveModal] = useState(() =>
    selectedRow ? { mode: 'cancel', row: selectedRow } : null,
  )

  function saveCancel(formValue) {
    if (isRowShiftLocked(formValue.sourceRow)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể hủy món.')
      return
    }

    const nextList = [createCancelPayload(formValue, mealExports.length), ...mealExports]

    setMealExports(nextList)
    saveStoredMealExports(nextList)
    setActiveModal(null)
    setSearchParams({})
  }

  function closeModal() {
    setActiveModal(null)
    if (queryImportId) {
      setSearchParams({})
    }
  }

  return (
    <section className="space-y-6">
      <KitchenPlanHeader title="Hủy món" description="Ghi nhận số lượng món không còn được phép bán hoặc phục vụ, đồng thời cập nhật tồn, lịch sử và báo cáo." actionIcon={Trash2} />
      <SummaryCards cards={[
        { label: 'Mẻ có thể hủy', value: rows.length, icon: PackageCheck },
        { label: 'Số lượng còn', value: rows.reduce((total, row) => total + Math.max(row.remainingQuantity, 0), 0), icon: ArrowDownToLine },
        { label: 'Phiếu hủy', value: filteredCancelRows.length, icon: Trash2 },
        { label: 'Tổng đã hủy', value: filteredCancelRows.reduce((total, row) => total + Number(row.quantity || 0), 0), icon: History },
      ]} />
      <FlowFilters date={dateFilter} dish={dishFilter} status={sourceFilter} dishes={state.dishList} statusOptions={cancelSourceOptions} onDateChange={setDateFilter} onDishChange={setDishFilter} onStatusChange={setSourceFilter} />
      <MealCancelSourceTable rows={rows} />
      <MealHistoryTable rows={cancelHistoryRows} title="Món đã hủy" />
      {activeModal?.mode === 'cancel' ? (
        <FormModal title="Hủy món" description="Ghi nhận số lượng hủy, nguồn hủy, người thực hiện, người xác nhận và hình ảnh." onClose={closeModal}>
          <MealCancelForm row={activeModal.row} onCancel={closeModal} onSubmit={saveCancel} />
        </FormModal>
      ) : null}
    </section>
  )
}

export default MealCancelPage
