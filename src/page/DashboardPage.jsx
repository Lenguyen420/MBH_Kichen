import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AlertPanel from '../components/Dashboard/AlertPanel'
import CookingList from '../components/Dashboard/CookingList'
import DashboardFilters from '../components/Dashboard/DashboardFilters'
import DashboardStatGrid from '../components/Dashboard/DashboardStatGrid'
import { kitchenAlerts, shiftOptions } from '../datas/dashboardData'
import {
  buildCookingRows,
  readStoredCookingTracking,
  readStoredKitchenDishes,
  readStoredKitchenMenus,
  readStoredKitchenPlans,
} from '../datas/kitchenPlanData'
import { getCurrentDate } from './mealFlowUtils'

function DashboardPage() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(getCurrentDate)
  const [selectedShift, setSelectedShift] = useState(shiftOptions[1])
  const dishList = readStoredKitchenDishes()
  const menuList = readStoredKitchenMenus()
  const planList = readStoredKitchenPlans()
  const trackingList = readStoredCookingTracking()
  const cookingRows = buildCookingRows(
    planList,
    trackingList,
    menuList,
    dishList,
  ).filter(
    (row) => row.menu?.date === selectedDate && row.menu?.shift === selectedShift,
  )
  const dashboardStats = [
    {
      key: 'total',
      label: 'Tổng món hôm nay',
      value: cookingRows.length,
      note: `${selectedShift}`,
      tone: 'blue',
      path: '/dashboard/kitchen-plan/today',
    },
    {
      key: 'processing',
      label: 'Đang làm',
      value: cookingRows.filter((row) => row.status === 'Đang chế biến').length,
      note: 'Theo dõi chế biến',
      tone: 'green',
      path: '/dashboard/cooking/tracking',
    },
    {
      key: 'completed',
      label: 'Đã hoàn thành',
      value: cookingRows.filter((row) => row.status === 'Hoàn thành').length,
      note: 'Sẵn sàng nhập món',
      tone: 'amber',
      path: '/dashboard/meal-flow/import',
    },
    {
      key: 'served',
      label: 'Đã bán/Phục vụ',
      value: 920,
      note: '+120 suất ca trưa',
      tone: 'red',
      path: '/dashboard/meal-flow/export',
    },
    {
      key: 'remaining',
      label: 'Tồn',
      value: 42,
      note: 'Cần xử lý trước 13:30',
      tone: 'violet',
      path: '/dashboard/inventory/remaining',
    },
    {
      key: 'cancelled',
      label: 'Đã hủy',
      value: 6,
      note: 'Có 1 lý do cần xác nhận',
      tone: 'slate',
      path: '/dashboard/inventory/cancel',
    },
  ]
  const cookingItems = cookingRows.map((row) => ({
    id: row.id,
    planId: row.planId,
    name: row.dish?.name,
    quantity: row.plannedQuantity,
    startedAt: row.startedAt || row.plan?.plannedStartAt,
    estimatedDoneAt: row.estimatedDoneAt,
    status: row.status,
  }))

  function openPlanAction(action, item) {
    navigate(`/dashboard/kitchen-plan/today?action=${action}&planId=${item.planId}`)
  }

  function openStatPage(stat) {
    if (stat.path) {
      navigate(stat.path)
    }
  }

  return (
    <section className="space-y-6">
      <DashboardFilters
        selectedDate={selectedDate}
        selectedShift={selectedShift}
        onDateChange={setSelectedDate}
        onShiftChange={setSelectedShift}
      />

      <DashboardStatGrid stats={dashboardStats} onOpen={openStatPage} />

      <div className="grid gap-6 2xl:grid-cols-[1fr_380px]">
        <CookingList
          items={cookingItems}
          onView={(item) => openPlanAction('view', item)}
          onEdit={(item) => openPlanAction('edit', item)}
          onComplete={(item) => openPlanAction('edit', item)}
        />
        <AlertPanel alerts={kitchenAlerts} />
      </div>
    </section>
  )
}

export default DashboardPage
