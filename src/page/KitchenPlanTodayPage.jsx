import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import FormModal from '../components/KitchenPlan/FormModal'
import KitchenPlanFilters from '../components/KitchenPlan/KitchenPlanFilters'
import KitchenPlanHeader from '../components/KitchenPlan/KitchenPlanHeader'
import PlanForm from '../components/KitchenPlan/PlanForm'
import PlanSummaryCards from '../components/KitchenPlan/PlanSummaryCards'
import TodayPlanTable from '../components/KitchenPlan/TodayPlanTable'
import {
  buildPlanRows,
  kitchenShiftOptions,
  mealOptions,
  planStatusOptions,
  readStoredKitchenDishes,
  readStoredKitchenMenus,
  readStoredKitchenPlans,
  saveStoredKitchenPlans,
} from '../datas/kitchenPlanData'

function KitchenPlanTodayPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [dishList] = useState(readStoredKitchenDishes)
  const [menuList] = useState(readStoredKitchenMenus)
  const [planList, setPlanList] = useState(readStoredKitchenPlans)
  const queryPlanId = searchParams.get('planId')
  const queryAction = searchParams.get('action')
  const queryRow = buildPlanRows(planList, menuList, dishList).find(
    (row) => row.id === queryPlanId,
  )
  const [selectedDate, setSelectedDate] = useState(
    queryRow?.menu?.date || '2026-09-30',
  )
  const [selectedMeal, setSelectedMeal] = useState(
    queryRow?.menu?.meal || 'Tất cả',
  )
  const [selectedShift, setSelectedShift] = useState(
    queryRow?.menu?.shift || 'Tất cả',
  )
  const [selectedStatus, setSelectedStatus] = useState('Tất cả')
  const [activeModal, setActiveModal] = useState(() => {
    if ((queryAction === 'view' || queryAction === 'edit') && queryRow) {
      return { mode: queryAction, plan: queryRow }
    }

    return null
  })

  const rows = useMemo(() => {
    return buildPlanRows(planList, menuList, dishList).filter((row) => {
      const matchDate = row.menu?.date === selectedDate
      const matchMeal = selectedMeal === 'Tất cả' || row.menu?.meal === selectedMeal
      const matchShift =
        selectedShift === 'Tất cả' || row.menu?.shift === selectedShift
      const matchStatus =
        selectedStatus === 'Tất cả' || row.status === selectedStatus

      return matchDate && matchMeal && matchShift && matchStatus
    })
  }, [
    dishList,
    menuList,
    planList,
    selectedDate,
    selectedMeal,
    selectedShift,
    selectedStatus,
  ])

  const summary = useMemo(() => {
    const totalQuantity = rows.reduce(
      (total, row) => total + row.expectedQuantity,
      0,
    )
    const latestDeadline =
      rows.map((row) => row.deadline).sort((a, b) => b.localeCompare(a))[0] ||
      '--:--'
    const activeMenus = new Set(rows.map((row) => row.menuId)).size

    return {
      totalDishes: rows.length,
      totalQuantity,
      latestDeadline,
      activeMenus,
    }
  }, [rows])

  function openModal(mode, plan) {
    setActiveModal({ mode, plan })
  }

  function closeModal() {
    setActiveModal(null)
    setSearchParams({})
  }

  function savePlan(planValue) {
    const nextPlan = {
      id: planValue.id || `plan-${Date.now()}`,
      menuId: planValue.menuId,
      dishId: planValue.dishId,
      expectedQuantity: planValue.expectedQuantity,
      plannedStartAt: planValue.plannedStartAt,
      deadline: planValue.deadline,
      assignedTo: planValue.assignedTo,
      serviceArea: planValue.serviceArea,
      note: planValue.note,
      status: planValue.status,
      confirmed: planValue.status !== 'Chờ xác nhận',
    }
    const nextPlans = planValue.id
      ? planList.map((plan) => (plan.id === planValue.id ? nextPlan : plan))
      : [nextPlan, ...planList]
    const selectedMenu = menuList.find((menu) => menu.id === nextPlan.menuId)

    setPlanList(nextPlans)
    saveStoredKitchenPlans(nextPlans)

    if (selectedMenu) {
      setSelectedDate(selectedMenu.date)
      setSelectedMeal(selectedMenu.meal)
      setSelectedShift(selectedMenu.shift)
    }

    closeModal()
  }

  function confirmPlan(row) {
    const nextPlans = planList.map((plan) =>
      plan.id === row.id
        ? { ...plan, confirmed: true, status: 'Đã chuyển bếp' }
        : plan,
    )

    setPlanList(nextPlans)
    saveStoredKitchenPlans(nextPlans)
  }

  function copyPreviousDayPlans() {
    const selectedTime = new Date(selectedDate).getTime()
    const previousDate = new Date(selectedTime - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)
    const previousPlans = buildPlanRows(planList, menuList, dishList).filter(
      (row) =>
        row.menu?.date === previousDate &&
        (selectedMeal === 'Tất cả' || row.menu?.meal === selectedMeal) &&
        (selectedShift === 'Tất cả' || row.menu?.shift === selectedShift),
    )
    const targetMenu = menuList.find(
      (menu) =>
        menu.date === selectedDate &&
        (selectedMeal === 'Tất cả' || menu.meal === selectedMeal) &&
        (selectedShift === 'Tất cả' || menu.shift === selectedShift),
    )

    if (!previousPlans.length || !targetMenu) {
      return
    }

    const copiedPlans = previousPlans.map((plan) => ({
      id: `plan-${Date.now()}-${plan.id}`,
      menuId: targetMenu.id,
      dishId: targetMenu.dishIds.includes(plan.dishId)
        ? plan.dishId
        : targetMenu.dishIds[0],
      expectedQuantity: plan.expectedQuantity,
      plannedStartAt: plan.plannedStartAt,
      deadline: plan.deadline,
      assignedTo: plan.assignedTo,
      serviceArea: plan.serviceArea,
      note: `Sao chép từ ${previousDate}`,
      status: 'Chờ xác nhận',
      confirmed: false,
    }))
    const nextPlans = [...copiedPlans, ...planList]

    setPlanList(nextPlans)
    saveStoredKitchenPlans(nextPlans)
  }

  return (
    <section className="space-y-6">
      <KitchenPlanHeader
        title="Kế hoạch hôm nay"
        description="Theo dõi danh sách món cần làm, số lượng dự kiến và mốc thời gian cần hoàn thành trong từng ca."
        actionLabel="Thêm kế hoạch"
        actionIcon={Plus}
        onAction={() => openModal('create')}
      />

      

      <PlanSummaryCards summary={summary} />

      <KitchenPlanFilters
        date={selectedDate}
        meal={selectedMeal}
        shift={selectedShift}
        status={selectedStatus}
        mealOptions={mealOptions}
        shiftOptions={kitchenShiftOptions}
        statusOptions={planStatusOptions}
        onDateChange={setSelectedDate}
        onMealChange={setSelectedMeal}
        onShiftChange={setSelectedShift}
        onStatusChange={setSelectedStatus}
      />

      <TodayPlanTable
        rows={rows}
        onView={(row) => openModal('view', row)}
        onEdit={(row) => openModal('edit', row)}
        onConfirm={confirmPlan}
        onCopy={copyPreviousDayPlans}
      />

      {activeModal ? (
        <FormModal
          title={
            activeModal.mode === 'create'
              ? 'Thêm kế hoạch'
              : activeModal.mode === 'edit'
                ? 'Sửa kế hoạch'
                : 'Chi tiết kế hoạch'
          }
          description="Kế hoạch luôn được liên kết với thực đơn và món trong thực đơn đã chọn."
          onClose={closeModal}
        >
          <PlanForm
            mode={activeModal.mode}
            plan={activeModal.plan}
            menus={menuList}
            dishList={dishList}
            onCancel={closeModal}
            onSubmit={savePlan}
          />
        </FormModal>
      ) : null}
    </section>
  )
}

export default KitchenPlanTodayPage
