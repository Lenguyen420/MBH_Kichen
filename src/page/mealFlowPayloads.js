import { createMealFlowId } from '../datas/mealFlowData'

export function createExportPayload(formValue, count) {
  const sourceRow = formValue.sourceRow

  return {
    id: createMealFlowId('EXP', formValue.exportedAt, count),
    importId: sourceRow.id,
    dishId: sourceRow.dishId || sourceRow.dish?.id,
    batchCode: sourceRow.batchCode,
    quantity: formValue.quantity,
    receiverPlace: formValue.receiverPlace,
    deliveredBy: formValue.deliveredBy,
    receivedBy: formValue.receivedBy,
    exportedAt: formValue.exportedAt,
    note: formValue.note,
    status: 'Đã xuất',
  }
}

export function createCancelPayload(formValue, count) {
  const sourceRow = formValue.sourceRow
  const canceledAt = formValue.canceledAt
  const quantity = Math.min(
    Number(formValue.quantity || 0),
    Math.max(sourceRow.remainingQuantity, 0),
  )

  return {
    id: createMealFlowId('CAN', canceledAt, count),
    importId: sourceRow.id,
    dishId: sourceRow.dishId,
    batchCode: sourceRow.batchCode,
    quantity,
    receiverPlace: 'Hủy món',
    deliveredBy: formValue.canceledBy,
    receivedBy: formValue.confirmedBy,
    exportedAt: canceledAt,
    note: formValue.reason,
    cancelSource: formValue.cancelSource,
    confirmedBy: formValue.confirmedBy,
    imageUrl: formValue.imageUrl,
    imageName: formValue.imageName,
    status: 'Hủy',
  }
}

export function createSamplePayload(formValue, count) {
  const sourceRow = formValue.sourceRow

  return {
    id: formValue.id || createMealFlowId('SAM', formValue.sampledAt, count),
    importId:
      sourceRow.sourceType === 'cooking'
        ? ''
        : sourceRow.importId || sourceRow.id,
    cookingId: sourceRow.cookingId || sourceRow.id,
    planId: sourceRow.planId,
    dishId: sourceRow.dishId,
    batchCode: sourceRow.batchCode,
    quantity: formValue.quantity,
    sampledAt: formValue.sampledAt,
    sampledBy: formValue.sampledBy,
    storageLocation: formValue.storageLocation,
    storageStartedAt: formValue.storageStartedAt,
    expectedEndAt: formValue.expectedEndAt,
    imageUrl: formValue.imageUrl,
    imageName: formValue.imageName,
    note: formValue.note,
    processedAt: formValue.processedAt || '',
    processedBy: formValue.processedBy || '',
    status: formValue.status || 'Đang lưu',
  }
}
