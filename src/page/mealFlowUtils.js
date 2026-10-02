import { readStoredKitchenDishes } from '../datas/kitchenPlanData'
import {
  buildCompletedCookingRows,
  buildInventoryRows,
  buildMealExportRows,
  buildMealImportRows,
  buildSampleRows,
  readStoredMealExports,
  readStoredMealImports,
  readStoredMealSamples,
} from '../datas/mealFlowData'

export const inputClass =
  'h-11 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 text-sm font-semibold outline-none focus:border-blue-400'

export const textareaClass =
  'min-h-20 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-3 text-sm font-semibold outline-none focus:border-blue-400'

export function formatDateTime(value) {
  if (!value) {
    return '--'
  }

  const [date = '', time = ''] = value.split('T')

  return `${date.split('-').reverse().join('/')} ${time}`
}

export function formatDateTimeWithPeriod(value) {
  if (!value) {
    return '--'
  }

  const [date = '', time = ''] = value.split('T')
  const [hourValue = '0', minuteValue = '00'] = time.split(':')
  const hour = Number(hourValue)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12

  return `${date.split('-').reverse().join('/')} ${String(displayHour).padStart(2, '0')}:${minuteValue} ${period}`
}

export function getCurrentDateTime() {
  const now = new Date()
  const timezoneOffset = now.getTimezoneOffset() * 60000

  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

export function getCurrentDate() {
  return getCurrentDateTime().slice(0, 10)
}

export function getMealFlowState() {
  const dishList = readStoredKitchenDishes()
  const completedRows = buildCompletedCookingRows()
  const importList = readStoredMealImports()
  const exportList = readStoredMealExports()
  const sampleList = readStoredMealSamples()
  const importRows = buildMealImportRows(importList, completedRows, dishList)
  const exportRows = buildMealExportRows(exportList, importRows, dishList)
  const inventoryRows = buildInventoryRows(importRows, exportList)
  const sampleRows = buildSampleRows(sampleList, importRows, completedRows, dishList)

  return {
    completedRows,
    dishList,
    exportList,
    exportRows,
    importList,
    importRows,
    inventoryRows,
    sampleList,
    sampleRows,
  }
}
