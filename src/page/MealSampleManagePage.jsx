import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Camera,
  Clock3,
  FlaskConical,
  History,
  Plus,
} from 'lucide-react'
import FormModal from '../components/KitchenPlan/FormModal'
import KitchenPlanHeader from '../components/KitchenPlan/KitchenPlanHeader'
import MealSampleForm from '../components/MealSamplePage/MealSampleForm'
import MealSampleTable from '../components/MealSamplePage/MealSampleTable'
import SampleProcessForm from '../components/MealSamplePage/SampleProcessForm'
import {
  getSampleCandidates,
  readStoredMealSamples,
  sampleStatusOptions,
  saveStoredMealSamples,
} from '../datas/mealFlowData'
import { isRowShiftLocked } from '../datas/shiftCloseData'
import {
  buildCookingRows,
  readStoredCookingTracking,
  readStoredKitchenDishes,
  readStoredKitchenMenus,
  readStoredKitchenPlans,
  saveStoredCookingTracking,
} from '../datas/kitchenPlanData'
import {
  FlowFilters,
  SummaryCards,
} from './mealFlowPageComponents'
import { createSamplePayload } from './mealFlowPayloads'
import {
  getCurrentDate,
  getCurrentDateTime,
  getMealFlowState,
} from './mealFlowUtils'

function completeCookingAfterSample(row) {
  const trackingList = readStoredCookingTracking()
  const completedAt = getCurrentDateTime().slice(11, 16)
  const nextTracking = {
    id: row.id,
    planId: row.planId,
    cookingQuantity: row.cookingQuantity || row.plannedQuantity,
    actualQuantity: row.actualQuantity || row.cookingQuantity || row.plannedQuantity,
    startedAt: row.startedAt || row.plan?.plannedStartAt || '',
    estimatedDoneAt: row.estimatedDoneAt,
    completedAt,
    staff: row.staff,
    status: 'Hoàn thành',
    issueNote: row.issueNote || '',
    note: row.note || 'Đã lưu mẫu và hoàn thành chế biến',
    imageUrl: row.imageUrl || '',
    imageName: row.imageName || '',
  }
  const exists = trackingList.some((item) => item.planId === row.planId)
  const nextList = exists
    ? trackingList.map((item) =>
        item.planId === row.planId ? { ...item, ...nextTracking } : item,
      )
    : [nextTracking, ...trackingList]

  saveStoredCookingTracking(nextList)
}

function createCookingBatchCode(row) {
  const datePart = row.menu?.date?.replaceAll('-', '') || getCurrentDate().replaceAll('-', '')
  const dishPart = row.dish?.id?.slice(-3)?.toUpperCase() || 'MON'

  return `CB-${datePart}-${dishPart}-${row.planId}`
}

function MealSampleManagePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [mealSamples, setMealSamples] = useState(readStoredMealSamples)
  const [dateFilter, setDateFilter] = useState(getCurrentDate)
  const [dishFilter, setDishFilter] = useState('Tất cả')
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const state = getMealFlowState()
  const queryPlanId = searchParams.get('planId')
  const queryCookingId = searchParams.get('cookingId')
  const completeAfterSample = searchParams.get('completeAfterSample') === '1'
  const sampleRows = state.sampleRows
  const sampledPlanIds = new Set(sampleRows.map((sample) => sample.planId))
  const cookingCandidate = buildCookingRows(
    readStoredKitchenPlans(),
    readStoredCookingTracking(),
    readStoredKitchenMenus(),
    readStoredKitchenDishes(),
  ).find(
    (row) =>
      row.dish?.requiresSample &&
      !sampledPlanIds.has(row.planId) &&
      ((queryPlanId && row.planId === queryPlanId) ||
        (queryCookingId && row.id === queryCookingId)),
  )
  const candidates = [
    ...(cookingCandidate
      ? [
          {
            ...cookingCandidate,
            id: `cooking-${cookingCandidate.id}`,
            sourceType: 'cooking',
            cookingId: cookingCandidate.id,
            dishId: cookingCandidate.dish?.id,
            batchCode: createCookingBatchCode(cookingCandidate),
            quantity: cookingCandidate.actualQuantity || cookingCandidate.cookingQuantity || cookingCandidate.plannedQuantity,
            importedAt: `${cookingCandidate.menu?.date}T${cookingCandidate.completedAt || cookingCandidate.estimatedDoneAt}`,
            importedBy: cookingCandidate.staff,
            receiverArea: 'Theo dõi chế biến',
          },
        ]
      : []),
    ...getSampleCandidates(state.importRows, sampleRows),
  ]
  const [activeModal, setActiveModal] = useState(() =>
    (queryPlanId || queryCookingId) && cookingCandidate
      ? { mode: 'create' }
      : null,
  )
  const rows = sampleRows.filter((row) => {
    const matchDate = row.sampledAt.startsWith(dateFilter)
    const matchDish = dishFilter === 'Tất cả' || row.dishId === dishFilter
    const matchStatus = statusFilter === 'Tất cả' || row.status === statusFilter

    return matchDate && matchDish && matchStatus
  })

  function saveSample(formValue) {
    if (isRowShiftLocked(formValue.sourceRow)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể lưu mẫu.')
      return
    }

    const nextSample = createSamplePayload(formValue, mealSamples.length)
    const nextList = formValue.id
      ? mealSamples.map((item) => (item.id === formValue.id ? nextSample : item))
      : [nextSample, ...mealSamples]

    setMealSamples(nextList)
    saveStoredMealSamples(nextList)
    setActiveModal(null)
    setSearchParams({})

    if (completeAfterSample && cookingCandidate) {
      completeCookingAfterSample(cookingCandidate)
      navigate('/dashboard/meal-flow/import')
    }
  }

  function closeModal() {
    setActiveModal(null)
    if (queryPlanId || queryCookingId) {
      setSearchParams({})
    }
  }

  function processSample(formValue) {
    const sourceRow = sampleRows.find((row) => row.id === formValue.id)

    if (isRowShiftLocked(sourceRow)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể xử lý mẫu.')
      return
    }

    const nextList = mealSamples.map((item) =>
      item.id === formValue.id
        ? {
            ...item,
            processedAt: formValue.processedAt,
            processedBy: formValue.processedBy,
            status: 'Đã xử lý',
          }
        : item,
    )

    setMealSamples(nextList)
    saveStoredMealSamples(nextList)
    setActiveModal(null)
  }

  return (
    <section className="space-y-6">
      <KitchenPlanHeader title="Quản lý lưu mẫu" description="Ghi nhận mẫu món ăn theo mẻ đã hoàn thành, không nhập lại tên món và tự cảnh báo mẻ bắt buộc chưa lưu mẫu." actionLabel="Lưu mẫu" actionIcon={Plus} onAction={() => setActiveModal({ mode: 'create' })} />
      <SummaryCards cards={[
        { label: 'Mẫu đang theo dõi', value: sampleRows.filter((row) => row.status !== 'Đã xử lý').length, icon: FlaskConical },
        { label: 'Chưa lưu bắt buộc', value: candidates.length, icon: Clock3 },
        { label: 'Đến hạn/quá hạn', value: sampleRows.filter((row) => ['Đến hạn', 'Quá hạn'].includes(row.status)).length, icon: History },
        { label: 'Có hình ảnh', value: sampleRows.filter((row) => row.imageUrl).length, icon: Camera },
      ]} />
      <FlowFilters date={dateFilter} dish={dishFilter} status={statusFilter} dishes={state.dishList} statusOptions={sampleStatusOptions} onDateChange={setDateFilter} onDishChange={setDishFilter} onStatusChange={setStatusFilter} />
      <MealSampleTable
        rows={rows}
        onEdit={(row) => setActiveModal({ mode: 'edit', row })}
        onProcess={(row) => setActiveModal({ mode: 'process', row })}
      />
      {activeModal ? (
        <FormModal
          title={
            activeModal.mode === 'process'
              ? 'Xử lý mẫu'
              : activeModal.mode === 'edit'
                ? 'Chỉnh sửa mẫu lưu'
                : 'Lưu mẫu món'
          }
          description={
            activeModal.mode === 'process'
              ? 'Ghi nhận thời gian xử lý và người thực hiện để chuyển mẫu sang đã xử lý.'
              : 'Chọn mẻ đã nhập từ món hoàn thành, hệ thống tự lấy tên món và mã mẻ.'
          }
          onClose={closeModal}
        >
          {activeModal.mode === 'process' ? (
            <SampleProcessForm row={activeModal.row} onCancel={closeModal} onSubmit={processSample} />
          ) : (
            <MealSampleForm candidates={activeModal.row ? [activeModal.row.sourceImport].filter(Boolean) : candidates} sampleRow={activeModal.row} onCancel={closeModal} onSubmit={saveSample} />
          )}
        </FormModal>
      ) : null}
    </section>
  )
}

export default MealSampleManagePage
