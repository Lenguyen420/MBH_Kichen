import {
  buildCookingRows,
  readStoredCookingTracking,
  readStoredKitchenDishes,
  readStoredKitchenMenus,
  readStoredKitchenPlans,
} from './kitchenPlanData'

export const MEAL_IMPORTS_KEY = 'kido_canteen_meal_imports'
export const MEAL_EXPORTS_KEY = 'kido_canteen_meal_exports'

export const receiverAreaOptions = [
  'Quầy bán',
  'Khu bán trú',
  'Lớp học',
  'Điểm phục vụ khác',
]

export const importReceiverAreaOptions = [
  'Khu sẵn sàng phục vụ',
  'Tủ giữ nóng',
  'Khay chờ chia suất',
  'Tủ mát đồ uống',
  'Bàn kiểm phẩm',
]

export const importStatusOptions = ['Chờ xác nhận', 'Đã xác nhận']
export const exportStatusOptions = ['Đã xuất', 'Thu hồi']
export const inventoryStatusOptions = [
  'Còn sử dụng',
  'Sắp hết hạn',
  'Quá hạn',
  'Tồn lớn',
  'Đã hết',
]
export const transactionTypeOptions = ['Nhập món', 'Xuất món', 'Thu hồi', 'Hủy']

export const mealImports = [
  {
    id: 'IMP-20260929-001',
    cookingId: 'track-004',
    planId: 'plan-000',
    dishId: 'dish-005',
    batchCode: 'ME-20260929-BTN-01',
    quantity: 140,
    importedAt: '2026-09-29T08:58',
    importedBy: 'Phạm Hoàng Nam',
    receiverArea: 'Khu sẵn sàng phục vụ',
    note: 'Nhập mẻ bún thịt nướng cho quầy số 1.',
    status: 'Đã xác nhận',
  },
  {
    id: 'IMP-20260930-001',
    cookingId: 'track-001',
    planId: 'plan-001',
    dishId: 'dish-001',
    batchCode: 'ME-20260930-CGN-01',
    quantity: 150,
    importedAt: '2026-09-30T09:05',
    importedBy: 'Nguyễn Minh Anh',
    receiverArea: 'Tủ giữ nóng',
    note: 'Nhập trước cho khu bán trú, còn lại chờ chia thêm.',
    status: 'Đã xác nhận',
  },
  {
    id: 'IMP-20260930-002',
    cookingId: 'track-002',
    planId: 'plan-002',
    dishId: 'dish-002',
    batchCode: 'ME-20260930-CT-01',
    quantity: 180,
    importedAt: '2026-09-30T09:10',
    importedBy: 'Nguyễn Minh Anh',
    receiverArea: 'Khu sẵn sàng phục vụ',
    note: 'Nhập trước 180 suất, còn 40 suất giữ nóng.',
    status: 'Đã xác nhận',
  },
  {
    id: 'IMP-20260930-003',
    cookingId: 'track-003',
    planId: 'plan-003',
    dishId: 'dish-003',
    batchCode: 'ME-20260930-TA-01',
    quantity: 120,
    importedAt: '2026-09-30T09:28',
    importedBy: 'Lê Thị Hương',
    receiverArea: 'Khay chờ chia suất',
    note: 'Chia trước cho căn tin, phần còn lại giữ trong xửng.',
    status: 'Đã xác nhận',
  },
  {
    id: 'IMP-20260930-004',
    cookingId: 'track-001',
    planId: 'plan-001',
    dishId: 'dish-001',
    batchCode: 'ME-20260930-CGN-02',
    quantity: 26,
    importedAt: '2026-09-30T09:18',
    importedBy: 'Nguyễn Minh Anh',
    receiverArea: 'Bàn kiểm phẩm',
    note: 'Phiếu nhập bổ sung chờ xác nhận.',
    status: 'Chờ xác nhận',
  },
]

export const mealExports = [
  {
    id: 'EXP-20260930-001',
    importId: 'IMP-20260930-001',
    dishId: 'dish-001',
    batchCode: 'ME-20260930-CGN-01',
    quantity: 90,
    receiverPlace: 'Khu bán trú',
    deliveredBy: 'Trần Quốc Bảo',
    receivedBy: 'Cô Lan',
    exportedAt: '2026-09-30T10:05',
    note: 'Giao suất trưa cho khối 3.',
    status: 'Đã xuất',
  },
  {
    id: 'EXP-20260930-002',
    importId: 'IMP-20260930-002',
    dishId: 'dish-002',
    batchCode: 'ME-20260930-CT-01',
    quantity: 120,
    receiverPlace: 'Lớp học',
    deliveredBy: 'Trần Quốc Bảo',
    receivedBy: 'Cô Hạnh',
    exportedAt: '2026-09-30T10:15',
    note: 'Giao cho khối 2.',
    status: 'Đã xuất',
  },
  {
    id: 'EXP-20260930-003',
    importId: 'IMP-20260930-002',
    dishId: 'dish-002',
    batchCode: 'ME-20260930-CT-01',
    quantity: 10,
    receiverPlace: 'Lớp học',
    deliveredBy: 'Trần Quốc Bảo',
    receivedBy: 'Cô Hạnh',
    exportedAt: '2026-09-30T11:05',
    note: 'Thu hồi phần chưa dùng.',
    status: 'Thu hồi',
  },
  {
    id: 'EXP-20260930-004',
    importId: 'IMP-20260930-003',
    dishId: 'dish-003',
    batchCode: 'ME-20260930-TA-01',
    quantity: 80,
    receiverPlace: 'Quầy bán',
    deliveredBy: 'Võ Thanh Tùng',
    receivedBy: 'Chị Mai',
    exportedAt: '2026-09-30T10:30',
    note: 'Xuất khay trứng hấp cho quầy chính.',
    status: 'Đã xuất',
  },
  {
    id: 'EXP-20260929-001',
    importId: 'IMP-20260929-001',
    dishId: 'dish-005',
    batchCode: 'ME-20260929-BTN-01',
    quantity: 135,
    receiverPlace: 'Quầy bán',
    deliveredBy: 'Phạm Hoàng Nam',
    receivedBy: 'Chị Thảo',
    exportedAt: '2026-09-29T09:20',
    note: 'Xuất bán sáng cho quầy số 1.',
    status: 'Đã xuất',
  },
]

function readStorageList(key, fallback) {
  const storedValue = localStorage.getItem(key)

  if (!storedValue) {
    return fallback
  }

  try {
    const storedList = JSON.parse(storedValue)

    if (!Array.isArray(storedList) || !Array.isArray(fallback)) {
      return storedList
    }

    const storedIds = new Set(storedList.map((item) => item.id))
    const missingFallbackItems = fallback.filter((item) => !storedIds.has(item.id))

    return [...storedList, ...missingFallbackItems]
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

export function readStoredMealImports() {
  return readStorageList(MEAL_IMPORTS_KEY, mealImports)
}

export function saveStoredMealImports(importList) {
  localStorage.setItem(MEAL_IMPORTS_KEY, JSON.stringify(importList))
}

export function readStoredMealExports() {
  return readStorageList(MEAL_EXPORTS_KEY, mealExports)
}

export function saveStoredMealExports(exportList) {
  localStorage.setItem(MEAL_EXPORTS_KEY, JSON.stringify(exportList))
}

export function buildCompletedCookingRows() {
  return buildCookingRows(
    readStoredKitchenPlans(),
    readStoredCookingTracking(),
    readStoredKitchenMenus(),
    readStoredKitchenDishes(),
  ).filter((row) => row.status === 'Hoàn thành' && row.actualQuantity > 0)
}

export function buildMealImportRows(importList, completedRows, dishList) {
  return importList.map((mealImport) => {
    const completedRow = completedRows.find(
      (row) => row.planId === mealImport.planId,
    )
    const dish = dishList.find((item) => item.id === mealImport.dishId)

    return {
      ...mealImport,
      dish,
      completedRow,
    }
  })
}

export function buildMealExportRows(exportList, importRows, dishList) {
  return exportList.map((mealExport) => {
    const sourceImport = importRows.find((item) => item.id === mealExport.importId)
    const dish = dishList.find((item) => item.id === mealExport.dishId)

    return {
      ...mealExport,
      dish,
      sourceImport,
    }
  })
}

export function getNetExportedQuantity(exportList, importId) {
  return exportList
    .filter((item) => item.importId === importId)
    .reduce((total, item) => {
      if (item.status === 'Thu hồi') {
        return total - Number(item.quantity || 0)
      }

      return total + Number(item.quantity || 0)
    }, 0)
}

export function buildInventoryRows(importRows, exportList) {
  const now = new Date('2026-10-01T12:00:00')

  return importRows
    .filter((row) => row.status === 'Đã xác nhận')
    .map((row) => {
      const exportedQuantity = getNetExportedQuantity(exportList, row.id)
      const cancelTransactions = exportList
        .filter((item) => item.importId === row.id && item.status === 'Hủy')
        .sort((left, right) => right.exportedAt.localeCompare(left.exportedAt))
      const latestCancel = cancelTransactions[0]
      const remainingQuantity = Number(row.quantity || 0) - exportedQuantity
      const recommendedUseMinutes = row.dish?.recommendedUseMinutes || 120
      const importedDate = new Date(row.importedAt)
      const expiresAt = new Date(
        importedDate.getTime() + recommendedUseMinutes * 60 * 1000,
      )
      const minutesLeft = Math.round((expiresAt.getTime() - now.getTime()) / 60000)
      const status =
        remainingQuantity <= 0
          ? 'Đã hết'
          : minutesLeft < 0
            ? 'Quá hạn'
            : minutesLeft <= 30
              ? 'Sắp hết hạn'
              : remainingQuantity >= Math.max(50, row.quantity * 0.4)
                ? 'Tồn lớn'
                : 'Còn sử dụng'

      return {
        ...row,
        importedQuantity: Number(row.quantity || 0),
        exportedQuantity,
        remainingQuantity,
        expiresAt: expiresAt.toISOString().slice(0, 16),
        minutesLeft,
        status,
        cancelInfo: latestCancel
          ? {
              canceledAt: latestCancel.exportedAt,
              canceledBy: latestCancel.deliveredBy,
              reason: latestCancel.note,
              quantity: latestCancel.quantity,
            }
          : null,
      }
    })
}

export function buildHistoryRows(importRows, exportRows) {
  const importHistory = importRows.map((item) => ({
    id: item.id,
    type: 'Nhập món',
    dish: item.dish,
    completedQuantity: item.completedRow?.actualQuantity || 0,
    quantity: item.quantity,
    batchCode: item.batchCode,
    actor: item.importedBy,
    partner: item.receiverArea,
    happenedAt: item.importedAt,
    note: item.note,
  }))
  const exportHistory = exportRows.map((item) => ({
    id: item.id,
    type:
      item.status === 'Thu hồi'
        ? 'Thu hồi'
        : item.status === 'Hủy'
          ? 'Hủy'
          : 'Xuất món',
    dish: item.dish,
    completedQuantity: item.sourceImport?.completedRow?.actualQuantity || 0,
    quantity: item.quantity,
    batchCode: item.batchCode,
    actor: item.deliveredBy,
    partner: item.receiverPlace,
    happenedAt: item.exportedAt,
    note: item.note,
  }))

  return [...importHistory, ...exportHistory].sort((left, right) =>
    right.happenedAt.localeCompare(left.happenedAt),
  )
}

export function createMealFlowId(prefix, dateTime, count) {
  const datePart = dateTime.slice(0, 10).replaceAll('-', '')
  const nextNumber = String(count + 1).padStart(3, '0')

  return `${prefix}-${datePart}-${nextNumber}`
}
