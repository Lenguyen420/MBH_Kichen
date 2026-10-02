import {
  CalendarDays,
  ClipboardList,
  FileText,
  FlaskConical,
  Home,
  Utensils,
} from 'lucide-react'

export const navigationItems = [
  {
    label: 'Tổng quan',
    path: '/dashboard',
    icon: Home,
  },
  {
    label: 'Kế hoạch & Chế biến',
    icon: CalendarDays,
    children: [
      { label: 'Kế hoạch hôm nay', path: '/dashboard/kitchen-plan/today' },
      { label: 'Thực đơn', path: '/dashboard/kitchen-plan/menu' },
      { label: 'Theo dõi chế biến', path: '/dashboard/cooking/tracking' },
    ],
  },
  {
    label: 'Nhập - Xuất & Tồn',
    icon: ClipboardList,
    children: [
      { label: 'Nhập món', path: '/dashboard/meal-flow/import' },
      { label: 'Xuất món', path: '/dashboard/meal-flow/export' },
      { label: 'Món còn lại', path: '/dashboard/inventory/remaining' },
      { label: 'Lịch sử', path: '/dashboard/meal-flow/history' },
    ],
  },
  {
    label: 'Lưu mẫu & Hủy',
    icon: FlaskConical,
    children: [
      { label: 'Quản lý lưu mẫu', path: '/dashboard/samples/manage' },
      { label: 'Hủy món', path: '/dashboard/inventory/cancel' },
      { label: 'Lịch sử', path: '/dashboard/samples/history' },
    ],
  },
  {
    label: 'Báo cáo',
    path: '/dashboard/reports',
    icon: FileText,
  },
]

export const systemBrand = {
  name: 'KIDO CANTEEN',
  area: 'Quản lý Bếp',
  icon: Utensils,
}
