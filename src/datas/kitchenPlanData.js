export const mealOptions = ['Bữa sáng', 'Bữa trưa', 'Bữa xế']

export const kitchenShiftOptions = ['Ca sáng', 'Ca trưa', 'Ca chiều']

export const serviceAreaOptions = ['Căn tin', 'Bán trú', 'Lớp học', 'Quầy phụ']

export const staffGroupOptions = [
  'Tổ bếp nóng',
  'Tổ canh',
  'Tổ hấp',
  'Tổ đồ uống',
]

export const planStatusOptions = ['Chờ xác nhận', 'Đã xác nhận', 'Đã chuyển bếp']

export const cookingStatusOptions = ['Chờ làm', 'Đang chế biến', 'Hoàn thành']

export const KITCHEN_MENUS_KEY = 'kido_canteen_menus'
export const KITCHEN_PLANS_KEY = 'kido_canteen_plans'
export const KITCHEN_DISHES_KEY = 'kido_canteen_dishes'
export const COOKING_TRACKING_KEY = 'kido_canteen_cooking_tracking'

export const dishes = [
  {
    id: 'dish-001',
    name: 'Cơm gà sốt nấm',
    group: 'Món chính',
    unit: 'suất',
    price: 32000,
    standardPortion: '220g cơm, 90g gà, 40g sốt nấm',
    cookDuration: 45,
    recommendedUseMinutes: 120,
    requiresSample: true,
  },
  {
    id: 'dish-002',
    name: 'Canh rau củ',
    group: 'Món canh',
    unit: 'suất',
    price: 12000,
    standardPortion: '180ml canh, 80g rau củ',
    cookDuration: 35,
    recommendedUseMinutes: 90,
    requiresSample: true,
  },
  {
    id: 'dish-003',
    name: 'Trứng hấp thịt',
    group: 'Món mặn',
    unit: 'suất',
    price: 18000,
    standardPortion: '1 phần trứng hấp 120g',
    cookDuration: 40,
    recommendedUseMinutes: 120,
    requiresSample: true,
  },
  {
    id: 'dish-004',
    name: 'Sữa đậu nành',
    group: 'Đồ uống',
    unit: 'ly',
    price: 8000,
    standardPortion: '220ml',
    cookDuration: 25,
    recommendedUseMinutes: 60,
    requiresSample: false,
  },
  {
    id: 'dish-005',
    name: 'Bún thịt nướng',
    group: 'Món chính',
    unit: 'suất',
    price: 35000,
    standardPortion: '180g bún, 100g thịt, 60g rau',
    cookDuration: 50,
    recommendedUseMinutes: 120,
    requiresSample: true,
  },
  {
    id: 'dish-006',
    name: 'Cháo thịt bằm',
    group: 'Món sáng',
    unit: 'suất',
    price: 18000,
    standardPortion: '250ml cháo, 60g thịt',
    cookDuration: 45,
    recommendedUseMinutes: 90,
    requiresSample: true,
  },
]

export const menus = [
  {
    id: 'menu-2026-09-29-lunch',
    date: '2026-09-29',
    meal: 'Bữa trưa',
    shift: 'Ca trưa',
    title: 'Thực đơn trưa thứ Ba',
    dishIds: ['dish-005', 'dish-002', 'dish-004'],
    locked: true,
  },
  {
    id: 'menu-2026-09-30-lunch',
    date: '2026-09-30',
    meal: 'Bữa trưa',
    shift: 'Ca trưa',
    title: 'Thực đơn trưa thứ Tư',
    dishIds: ['dish-001', 'dish-002', 'dish-003', 'dish-004'],
    locked: false,
  },
  {
    id: 'menu-2026-09-30-breakfast',
    date: '2026-09-30',
    meal: 'Bữa sáng',
    shift: 'Ca sáng',
    title: 'Thực đơn sáng thứ Tư',
    dishIds: ['dish-006', 'dish-004'],
    locked: false,
  },
  {
    id: 'menu-2026-10-01-lunch',
    date: '2026-10-01',
    meal: 'Bữa trưa',
    shift: 'Ca trưa',
    title: 'Thực đơn trưa thứ Năm',
    dishIds: ['dish-005', 'dish-002', 'dish-004'],
    locked: false,
  },
]

export const todayKitchenPlans = [
  {
    id: 'plan-000',
    menuId: 'menu-2026-09-29-lunch',
    dishId: 'dish-005',
    expectedQuantity: 150,
    plannedStartAt: '08:00',
    deadline: '09:00',
    assignedTo: 'Tổ bếp nóng',
    serviceArea: 'Căn tin',
    note: 'Ưu tiên quầy số 1',
    status: 'Đã xác nhận',
    confirmed: true,
  },
  {
    id: 'plan-001',
    menuId: 'menu-2026-09-30-lunch',
    dishId: 'dish-001',
    expectedQuantity: 180,
    plannedStartAt: '08:15',
    deadline: '09:00',
    assignedTo: 'Tổ bếp nóng',
    serviceArea: 'Bán trú',
    note: 'Phục vụ khối 3 trước 10 phút',
    status: 'Đã chuyển bếp',
    confirmed: true,
  },
  {
    id: 'plan-002',
    menuId: 'menu-2026-09-30-lunch',
    dishId: 'dish-002',
    expectedQuantity: 220,
    plannedStartAt: '08:35',
    deadline: '09:10',
    assignedTo: 'Tổ canh',
    serviceArea: 'Lớp học',
    note: 'Chia theo thùng giữ nhiệt',
    status: 'Đã chuyển bếp',
    confirmed: true,
  },
  {
    id: 'plan-003',
    menuId: 'menu-2026-09-30-lunch',
    dishId: 'dish-003',
    expectedQuantity: 160,
    plannedStartAt: '08:45',
    deadline: '09:25',
    assignedTo: 'Tổ hấp',
    serviceArea: 'Căn tin',
    note: 'Kiểm tra khay hấp trước khi ra món',
    status: 'Đã xác nhận',
    confirmed: true,
  },
  {
    id: 'plan-004',
    menuId: 'menu-2026-09-30-lunch',
    dishId: 'dish-004',
    expectedQuantity: 220,
    plannedStartAt: '09:00',
    deadline: '09:30',
    assignedTo: 'Tổ đồ uống',
    serviceArea: 'Quầy phụ',
    note: 'Giữ lạnh trước khi phục vụ',
    status: 'Chờ xác nhận',
    confirmed: false,
  },
]

export const cookingTracking = [
  {
    id: 'track-001',
    planId: 'plan-001',
    cookingQuantity: 180,
    actualQuantity: 0,
    startedAt: '08:18',
    estimatedDoneAt: '09:00',
    completedAt: '',
    staff: 'Tổ bếp nóng',
    status: 'Đang chế biến',
    issueNote: '',
    note: 'Đang nấu sốt nấm',
    imageUrl: '',
  },
  {
    id: 'track-002',
    planId: 'plan-002',
    cookingQuantity: 220,
    actualQuantity: 220,
    startedAt: '08:35',
    estimatedDoneAt: '09:10',
    completedAt: '09:05',
    staff: 'Tổ canh',
    status: 'Hoàn thành',
    issueNote: '',
    note: 'Đã chuyển sang nhập món',
    imageUrl: '',
  },
]

export function getDishById(dishId, dishList = dishes) {
  return dishList.find((dish) => dish.id === dishId)
}

export function getMenuById(menuId, menuList = menus) {
  return menuList.find((menu) => menu.id === menuId)
}

export function getMenuDishes(menu, dishList = dishes) {
  return menu.dishIds
    .map((dishId) => getDishById(dishId, dishList))
    .filter(Boolean)
}

export function buildPlanRows(planList, menuList = menus, dishList = dishes) {
  return planList.map((plan) => ({
    ...plan,
    plannedStartAt: plan.plannedStartAt || plan.startedAt || '',
    serviceArea: plan.serviceArea || 'Căn tin',
    note: plan.note || '',
    confirmed: Boolean(plan.confirmed || plan.status === 'Đã xác nhận'),
    dish: getDishById(plan.dishId, dishList),
    menu: getMenuById(plan.menuId, menuList),
  }))
}

export function buildCookingRows(
  planList,
  trackingList,
  menuList = menus,
  dishList = dishes,
) {
  const planRows = buildPlanRows(planList, menuList, dishList).filter(
    (plan) => plan.confirmed,
  )

  return planRows.map((plan) => {
    const tracking = trackingList.find((item) => item.planId === plan.id)

    return {
      ...tracking,
      id: tracking?.id || `track-${plan.id}`,
      planId: plan.id,
      dish: plan.dish,
      menu: plan.menu,
      plannedQuantity: plan.expectedQuantity,
      cookingQuantity: tracking?.cookingQuantity ?? plan.expectedQuantity,
      actualQuantity: tracking?.actualQuantity ?? 0,
      startedAt: tracking?.startedAt || '',
      estimatedDoneAt: tracking?.estimatedDoneAt || plan.deadline,
      completedAt: tracking?.completedAt || '',
      staff: tracking?.staff || plan.assignedTo,
      status: tracking?.status || 'Chờ làm',
      issueNote: tracking?.issueNote || '',
      note: tracking?.note || plan.note || '',
      imageUrl: tracking?.imageUrl || '',
      imageName: tracking?.imageName || tracking?.imageUrl || '',
      plan,
    }
  })
}

export function getTodayPlanRows() {
  return buildPlanRows(todayKitchenPlans)
}

function readStorageList(key, fallback) {
  const storedValue = localStorage.getItem(key)

  if (!storedValue) {
    return fallback
  }

  try {
    return JSON.parse(storedValue)
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

export function readStoredKitchenMenus() {
  return readStorageList(KITCHEN_MENUS_KEY, menus)
}

export function saveStoredKitchenMenus(menuList) {
  localStorage.setItem(KITCHEN_MENUS_KEY, JSON.stringify(menuList))
}

export function readStoredKitchenPlans() {
  return readStorageList(KITCHEN_PLANS_KEY, todayKitchenPlans)
}

export function saveStoredKitchenPlans(planList) {
  localStorage.setItem(KITCHEN_PLANS_KEY, JSON.stringify(planList))
}

export function readStoredKitchenDishes() {
  return readStorageList(KITCHEN_DISHES_KEY, dishes)
}

export function saveStoredKitchenDishes(dishList) {
  localStorage.setItem(KITCHEN_DISHES_KEY, JSON.stringify(dishList))
}

export function readStoredCookingTracking() {
  return readStorageList(COOKING_TRACKING_KEY, cookingTracking)
}

export function saveStoredCookingTracking(trackingList) {
  localStorage.setItem(COOKING_TRACKING_KEY, JSON.stringify(trackingList))
}
