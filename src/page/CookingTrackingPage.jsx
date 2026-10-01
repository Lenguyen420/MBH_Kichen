import { useMemo, useState } from 'react'
import { ChefHat } from 'lucide-react'
import TrackingForm from '../components/CookingTracking/TrackingForm'
import TrackingTable from '../components/CookingTracking/TrackingTable'
import FormModal from '../components/KitchenPlan/FormModal'
import KitchenPlanFilters from '../components/KitchenPlan/KitchenPlanFilters'
import KitchenPlanHeader from '../components/KitchenPlan/KitchenPlanHeader'
import {
  buildCookingRows,
  cookingStatusOptions,
  kitchenShiftOptions,
  mealOptions,
  readStoredCookingTracking,
  readStoredKitchenDishes,
  readStoredKitchenMenus,
  readStoredKitchenPlans,
  saveStoredCookingTracking,
} from '../datas/kitchenPlanData'

function getCurrentTime() {
  return new Date().toTimeString().slice(0, 5)
}

function CookingTrackingPage() {
  const [dishList] = useState(readStoredKitchenDishes)
  const [menuList] = useState(readStoredKitchenMenus)
  const [planList] = useState(readStoredKitchenPlans)
  const [trackingList, setTrackingList] = useState(readStoredCookingTracking)
  const [selectedDate, setSelectedDate] = useState('2026-09-30')
  const [selectedMeal, setSelectedMeal] = useState('Tất cả')
  const [selectedShift, setSelectedShift] = useState('Tất cả')
  const [selectedStatus, setSelectedStatus] = useState('Tất cả')
  const [activeModal, setActiveModal] = useState(null)

  const rows = useMemo(() => {
    return buildCookingRows(planList, trackingList, menuList, dishList).filter(
      (row) => {
        const matchDate = row.menu?.date === selectedDate
        const matchMeal = selectedMeal === 'Tất cả' || row.menu?.meal === selectedMeal
        const matchShift =
          selectedShift === 'Tất cả' || row.menu?.shift === selectedShift
        const matchStatus =
          selectedStatus === 'Tất cả' || row.status === selectedStatus

        return matchDate && matchMeal && matchShift && matchStatus
      },
    )
  }, [
    dishList,
    menuList,
    planList,
    selectedDate,
    selectedMeal,
    selectedShift,
    selectedStatus,
    trackingList,
  ])

  function upsertTracking(row, changes) {
    const nextTracking = {
      id: row.id,
      planId: row.planId,
      cookingQuantity: row.cookingQuantity,
      actualQuantity: row.actualQuantity,
      startedAt: row.startedAt,
      estimatedDoneAt: row.estimatedDoneAt,
      completedAt: row.completedAt,
      staff: row.staff,
      status: row.status,
      issueNote: row.issueNote,
      note: row.note,
      imageUrl: row.imageUrl,
      imageName: row.imageName,
      ...changes,
    }
    const exists = trackingList.some((item) => item.planId === row.planId)
    const nextList = exists
      ? trackingList.map((item) =>
          item.planId === row.planId ? nextTracking : item,
        )
      : [nextTracking, ...trackingList]

    setTrackingList(nextList)
    saveStoredCookingTracking(nextList)
  }

  function startCooking(row) {
    upsertTracking(row, {
      startedAt: row.startedAt || getCurrentTime(),
      status: 'Đang chế biến',
      note: row.note || 'Đã bắt đầu chế biến',
    })
  }

  function saveTracking(rowValue) {
    upsertTracking(rowValue, {
      cookingQuantity: rowValue.cookingQuantity,
      actualQuantity: rowValue.actualQuantity,
      startedAt: rowValue.startedAt,
      completedAt:
        activeModal?.mode === 'complete'
          ? rowValue.completedAt || getCurrentTime()
          : rowValue.completedAt,
      status: activeModal?.mode === 'complete' ? 'Hoàn thành' : rowValue.status,
      issueNote: rowValue.issueNote,
      note: rowValue.note,
      imageName: rowValue.imageName,
      imageUrl: '',
    })
    setActiveModal(null)
  }

  return (
    <section className="space-y-6">
      <KitchenPlanHeader
        title="Theo dõi chế biến"
        description="Theo dõi luồng Chờ làm, Đang chế biến và Hoàn thành. Dữ liệu được lấy từ các kế hoạch đã xác nhận."
        actionLabel="Từ kế hoạch đã xác nhận"
        actionIcon={ChefHat}
      />

      <KitchenPlanFilters
        date={selectedDate}
        meal={selectedMeal}
        shift={selectedShift}
        status={selectedStatus}
        mealOptions={mealOptions}
        shiftOptions={kitchenShiftOptions}
        statusOptions={cookingStatusOptions}
        onDateChange={setSelectedDate}
        onMealChange={setSelectedMeal}
        onShiftChange={setSelectedShift}
        onStatusChange={setSelectedStatus}
      />

      <TrackingTable
        rows={rows}
        onView={(row) => setActiveModal({ mode: 'view', row })}
        onStart={startCooking}
        onUpdate={(row) => setActiveModal({ mode: 'update', row })}
        onIssue={(row) => setActiveModal({ mode: 'issue', row })}
        onComplete={(row) => setActiveModal({ mode: 'complete', row })}
      />

      {activeModal ? (
        <FormModal
          title={
            activeModal.mode === 'view'
              ? 'Chi tiết chế biến'
              : activeModal.mode === 'complete'
                ? 'Hoàn thành món'
                : activeModal.mode === 'issue'
                  ? 'Báo lỗi / món hỏng'
                  : 'Cập nhật chế biến'
          }
          description="Cập nhật số lượng, thời gian thực tế, ghi chú và tình trạng món trong bếp."
          onClose={() => setActiveModal(null)}
        >
          <TrackingForm
            mode={activeModal.mode}
            row={activeModal.row}
            onCancel={() => setActiveModal(null)}
            onSubmit={saveTracking}
          />
        </FormModal>
      ) : null}
    </section>
  )
}

export default CookingTrackingPage
