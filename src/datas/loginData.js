export const kitchenStaffAccounts = [
  {
    id: 1,
    fullName: 'Nguyễn Văn Bếp',
    email: 'beptruong@mbh.com',
    password: '123456',
    role: 'Bếp trưởng',
    station: 'Bếp chính',
  },
  {
    id: 2,
    fullName: 'Trần Thị Suất',
    email: 'nhanvienbep@mbh.com',
    password: '123456',
    role: 'Nhân viên bếp',
    station: 'Sơ chế',
  },
  {
    id: 3,
    fullName: 'Lê Minh Kho',
    email: 'quanlykho@mbh.com',
    password: '123456',
    role: 'Quản lý kho bếp',
    station: 'Kho nguyên liệu',
  },
]

export const CURRENT_STAFF_KEY = 'kido_canteen_current_staff'
export const LOGIN_TOAST_KEY = 'kido_canteen_login_toast'

export function findKitchenStaffAccount(email, password) {
  return kitchenStaffAccounts.find(
    (account) =>
      account.email.toLowerCase() === email.trim().toLowerCase() &&
      account.password === password,
  )
}

export function getPublicStaffInfo(account) {
  const { password: _password, ...publicInfo } = account

  return publicInfo
}
