export const dashboardStats = [
  {
    key: 'total',
    label: 'Tổng món hôm nay',
    value: 18,
    note: '+3 món so với hôm qua',
    tone: 'blue',
  },
  {
    key: 'processing',
    label: 'Đang làm',
    value: 5,
    note: '2 món cần ưu tiên',
    tone: 'green',
  },
  {
    key: 'completed',
    label: 'Đã hoàn thành',
    value: 11,
    note: 'Đúng tiến độ',
    tone: 'amber',
  },
  {
    key: 'served',
    label: 'Đã bán/Phục vụ',
    value: 920,
    note: '+120 suất ca trưa',
    tone: 'red',
  },
  {
    key: 'remaining',
    label: 'Tồn',
    value: 42,
    note: 'Cần xử lý trước 13:30',
    tone: 'violet',
  },
  {
    key: 'cancelled',
    label: 'Đã hủy',
    value: 6,
    note: 'Có 1 lý do cần xác nhận',
    tone: 'slate',
  },
]

export const cookingItems = [
  {
    id: 1,
    planId: 'plan-001',
    name: 'Cơm gà sốt nấm',
    quantity: 180,
    startedAt: '08:15',
    estimatedDoneAt: '09:00',
    status: 'Đang chế biến',
  },
  {
    id: 2,
    planId: 'plan-002',
    name: 'Canh rau củ',
    quantity: 220,
    startedAt: '08:35',
    estimatedDoneAt: '09:10',
    status: 'Sắp hoàn thành',
  },
  {
    id: 3,
    planId: 'plan-003',
    name: 'Trứng hấp thịt',
    quantity: 160,
    startedAt: '08:45',
    estimatedDoneAt: '09:25',
    status: 'Đang chế biến',
  },
]

export const kitchenAlerts = [
  {
    id: 1,
    title: 'Món sắp quá thời gian',
    detail: 'Cơm gà sốt nấm còn 8 phút',
    level: 'warning',
  },
  {
    id: 2,
    title: 'Món tồn cần xử lý',
    detail: '42 suất cần kiểm tra trước 13:30',
    level: 'info',
  },
  {
    id: 3,
    title: 'Mẫu lưu sắp đến hạn',
    detail: '2 mẫu cần xử lý trong hôm nay',
    level: 'danger',
  },
]

export const shiftOptions = ['Ca sáng', 'Ca trưa', 'Ca chiều']
