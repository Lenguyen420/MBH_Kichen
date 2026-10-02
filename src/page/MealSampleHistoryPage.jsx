import { useMemo, useState } from 'react'
import {
  Camera,
  CircleCheck,
  FlaskConical,
  History,
  Trash2,
} from 'lucide-react'
import KitchenPlanHeader from '../components/KitchenPlan/KitchenPlanHeader'
import MealHistoryTable from '../components/MealHistoryPage/MealHistoryTable'
import MealSampleTable from '../components/MealSamplePage/MealSampleTable'
import {
  buildHistoryRows,
  sampleStatusOptions,
} from '../datas/mealFlowData'
import {
  FlowFilters,
  SummaryCards,
} from './mealFlowPageComponents'
import {
  getCurrentDate,
  getMealFlowState,
} from './mealFlowUtils'

function MealSampleHistoryPage() {
  const state = useMemo(() => getMealFlowState(), [])
  const [dateFilter, setDateFilter] = useState(getCurrentDate)
  const [dishFilter, setDishFilter] = useState('Tất cả')
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const sampleRows = state.sampleRows.filter((row) => {
    const matchDate = row.sampledAt.startsWith(dateFilter)
    const matchDish = dishFilter === 'Tất cả' || row.dishId === dishFilter
    const matchStatus = statusFilter === 'Tất cả' || row.status === statusFilter

    return matchDate && matchDish && matchStatus
  })

  return (
    <section className="space-y-6">
      <KitchenPlanHeader title="Lịch sử lưu mẫu & hủy" description="Xem lại mẫu đã lưu, món đã hủy, người thực hiện, thời gian, lý do và hình ảnh liên quan." actionLabel="Dữ liệu truy xuất" actionIcon={History} />
      <SummaryCards cards={[
        { label: 'Mẫu đã lưu', value: state.sampleRows.length, icon: FlaskConical },
        { label: 'Mẫu đã xử lý', value: state.sampleRows.filter((row) => row.status === 'Đã xử lý').length, icon: CircleCheck },
        { label: 'Phiếu hủy', value: state.exportRows.filter((row) => row.status === 'Hủy').length, icon: Trash2 },
        { label: 'Ảnh đính kèm', value: [...state.sampleRows, ...state.exportRows].filter((row) => row.imageUrl).length, icon: Camera },
      ]} />
      <FlowFilters date={dateFilter} dish={dishFilter} status={statusFilter} dishes={state.dishList} statusOptions={sampleStatusOptions} onDateChange={setDateFilter} onDishChange={setDishFilter} onStatusChange={setStatusFilter} />
      <MealSampleTable rows={sampleRows} title="Lịch sử lưu mẫu" />
      <MealHistoryTable rows={buildHistoryRows(state.importRows, state.exportRows).filter((row) => row.type === 'Hủy')} />
    </section>
  )
}

export default MealSampleHistoryPage
