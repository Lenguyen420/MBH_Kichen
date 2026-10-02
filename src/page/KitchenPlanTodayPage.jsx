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
  saveStoredKitchenDishes,
  saveStoredKitchenPlans,
} from '../datas/kitchenPlanData'
import { isShiftLocked } from '../datas/shiftCloseData'
import { getCurrentDate } from './mealFlowUtils'

function createDishId(name, index) {
  const normalizedName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return `dish-plan-${normalizedName || Date.now()}-${index}`
}

function KitchenPlanTodayPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [dishList, setDishList] = useState(readStoredKitchenDishes)
  const [menuList] = useState(readStoredKitchenMenus)
  const [planList, setPlanList] = useState(readStoredKitchenPlans)
  const queryPlanId = searchParams.get('planId')
  const queryAction = searchParams.get('action')
  const queryRow = buildPlanRows(planList, menuList, dishList).find(
    (row) => row.id === queryPlanId,
  )
  const [selectedDate, setSelectedDate] = useState(
    queryRow?.menu?.date || getCurrentDate(),
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
    if (isShiftLocked(planValue.date, planValue.shift)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể sửa kế hoạch.')
      return
    }

    const planMenuId = `planned-${planValue.date}-${planValue.meal}-${planValue.shift}`
    const nextDishList = [...dishList]
    const nextPlanItems = planValue.items.map((item, index) => {
      const dishName = item.dishName.trim()
      const ingredients = item.ingredients.trim()
      const existingDish = nextDishList.find(
        (dish) => dish.name.trim().toLowerCase() === dishName.toLowerCase(),
      )
      const dishId = item.dishId || existingDish?.id || createDishId(dishName, index)
      const nextDish = {
        ...(existingDish || {}),
        id: dishId,
        name: dishName,
        group: existingDish?.group || 'Món kế hoạch',
        unit: existingDish?.unit || 'suất',
        price: existingDish?.price || 0,
        standardPortion: ingredients,
        ingredients,
        cookDuration: existingDish?.cookDuration || 30,
        recommendedUseMinutes: existingDish?.recommendedUseMinutes || 120,
        requiresSample: item.requiresSample ?? true,
      }
      const existingDishIndex = nextDishList.findIndex((dish) => dish.id === dishId)

      if (existingDishIndex >= 0) {
        nextDishList[existingDishIndex] = nextDish
      } else {
        nextDishList.push(nextDish)
      }

      return {
        id: item.id || `plan-${Date.now()}-${index}`,
        menuId: planMenuId,
        date: planValue.date,
        meal: planValue.meal,
        shift: planValue.shift,
        dishId,
        dishName,
        ingredients,
        expectedQuantity: item.expectedQuantity,
        plannedStartAt: item.plannedStartAt,
        deadline: item.deadline,
        assignedTo: item.assignedTo,
        serviceArea: item.serviceArea,
        note: item.note,
        status: item.status,
        confirmed: item.status !== 'Chờ xác nhận',
      }
    })
    const nextPlans = nextPlanItems.some((item) => planList.some((plan) => plan.id === item.id))
      ? planList.map((plan) => nextPlanItems.find((item) => item.id === plan.id) || plan)
      : [...nextPlanItems, ...planList]

    setDishList(nextDishList)
    setPlanList(nextPlans)
    saveStoredKitchenDishes(nextDishList)
    saveStoredKitchenPlans(nextPlans)
    setSelectedDate(planValue.date)
    setSelectedMeal(planValue.meal)
    setSelectedShift(planValue.shift)

    closeModal()
  }

  function confirmPlan(row) {
    if (isShiftLocked(row.menu?.date, row.menu?.shift)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể xác nhận kế hoạch.')
      return
    }

    const nextPlans = planList.map((plan) =>
      plan.id === row.id
        ? { ...plan, confirmed: true, status: 'Đã chuyển bếp' }
        : plan,
    )

    setPlanList(nextPlans)
    saveStoredKitchenPlans(nextPlans)
  }

  function copyPreviousDayPlans() {
    if (selectedShift !== 'Tất cả' && isShiftLocked(selectedDate, selectedShift)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể sao chép kế hoạch.')
      return
    }

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

    if (!previousPlans.length) {
      return
    }

    const copiedPlans = previousPlans.map((plan) => ({
      id: `plan-${Date.now()}-${plan.id}`,
      menuId: targetMenu?.id || `planned-${selectedDate}-${selectedMeal}-${selectedShift}`,
      date: selectedDate,
      meal: selectedMeal === 'Tất cả' ? plan.menu?.meal : selectedMeal,
      shift: selectedShift === 'Tất cả' ? plan.menu?.shift : selectedShift,
      dishId: targetMenu?.dishIds.includes(plan.dishId)
        ? plan.dishId
        : plan.dishId,
      dishName: plan.dish?.name || plan.dishName,
      ingredients: plan.dish?.ingredients || plan.ingredients || plan.dish?.standardPortion,
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
        description="Lập danh sách món bếp cần chuẩn bị trong ngày, định lượng từng món và mốc thời gian cần hoàn thành."
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
          description="Chọn ngày, bữa, ca và thêm một hoặc nhiều món vào kế hoạch trước khi lưu."
          onClose={closeModal}
        >
          <PlanForm
            mode={activeModal.mode}
            plan={activeModal.plan}
            onCancel={closeModal}
            onSubmit={savePlan}
          />
        </FormModal>
      ) : null}
    </section>
  )
}

export default KitchenPlanTodayPage
