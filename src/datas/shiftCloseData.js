export const SHIFT_CLOSE_KEY = 'kido_canteen_shift_closings'

function readStorageList(key, fallback) {
  const storedValue = localStorage.getItem(key)

  if (!storedValue) {
    return fallback
  }

  try {
    const storedList = JSON.parse(storedValue)

    return Array.isArray(storedList) ? storedList : fallback
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

export function readStoredShiftClosings() {
  return readStorageList(SHIFT_CLOSE_KEY, [])
}

export function saveStoredShiftClosings(shiftClosings) {
  localStorage.setItem(SHIFT_CLOSE_KEY, JSON.stringify(shiftClosings))
}

export function getShiftClosingId(date, shift) {
  return `SHIFT-${date}-${shift}`.replaceAll(' ', '-')
}

export function findShiftClosing(date, shift, shiftClosings = readStoredShiftClosings()) {
  return shiftClosings.find((item) => item.date === date && item.shift === shift)
}

export function isShiftLocked(date, shift, shiftClosings = readStoredShiftClosings()) {
  return Boolean(findShiftClosing(date, shift, shiftClosings)?.locked)
}

export function getRowShiftDate(row) {
  return row?.menu?.date || row?.completedRow?.menu?.date || row?.date || ''
}

export function getRowShiftName(row) {
  return row?.menu?.shift || row?.completedRow?.menu?.shift || row?.shift || ''
}

export function isRowShiftLocked(row, shiftClosings = readStoredShiftClosings()) {
  const date = getRowShiftDate(row)
  const shift = getRowShiftName(row)

  return Boolean(date && shift && isShiftLocked(date, shift, shiftClosings))
}

export function buildShiftClosingReport({ date, shift, state }) {
  const importRows = state.importRows.filter(
    (row) => row.completedRow?.menu?.date === date && row.completedRow?.menu?.shift === shift,
  )
  const importIds = new Set(importRows.map((row) => row.id))
  const exportRows = state.exportRows.filter((row) => importIds.has(row.importId))
  const inventoryRows = state.inventoryRows.filter((row) => importIds.has(row.id))
  const sampleRows = state.sampleRows.filter(
    (row) => row.completedRow?.menu?.date === date && row.completedRow?.menu?.shift === shift,
  )
  const cancelRows = exportRows.filter((row) => row.status === 'Hủy')

  return {
    importCount: importRows.length,
    importedQuantity: importRows.reduce((total, row) => total + Number(row.quantity || 0), 0),
    exportedQuantity: exportRows
      .filter((row) => row.status === 'Đã xuất')
      .reduce((total, row) => total + Number(row.quantity || 0), 0),
    recalledQuantity: exportRows
      .filter((row) => row.status === 'Thu hồi')
      .reduce((total, row) => total + Number(row.quantity || 0), 0),
    canceledQuantity: cancelRows.reduce((total, row) => total + Number(row.quantity || 0), 0),
    remainingQuantity: inventoryRows.reduce(
      (total, row) => total + Math.max(row.remainingQuantity, 0),
      0,
    ),
    sampleCount: sampleRows.length,
    pendingSampleCount: sampleRows.filter((row) => row.status !== 'Đã xử lý').length,
    cancelCount: cancelRows.length,
  }
}
