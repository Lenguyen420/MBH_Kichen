import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import FormModal from '../components/KitchenPlan/FormModal'
import KitchenPlanFilters from '../components/KitchenPlan/KitchenPlanFilters'
import KitchenPlanHeader from '../components/KitchenPlan/KitchenPlanHeader'
import MenuForm from '../components/KitchenPlan/MenuForm'
import MenuTable from '../components/KitchenPlan/MenuTable'
import {
  buildPlanRows,
  getMenuDishes,
  kitchenShiftOptions,
  mealOptions,
  readStoredKitchenDishes,
  readStoredKitchenMenus,
  readStoredKitchenPlans,
  saveStoredKitchenMenus,
  saveStoredKitchenPlans,
} from '../datas/kitchenPlanData'
import { isShiftLocked } from '../datas/shiftCloseData'
import { getCurrentDate } from './mealFlowUtils'

function KitchenMenuPage() {
  const [dishList] = useState(readStoredKitchenDishes)
  const [menuList, setMenuList] = useState(readStoredKitchenMenus)
  const [planList, setPlanList] = useState(readStoredKitchenPlans)
  const [selectedDate, setSelectedDate] = useState(getCurrentDate)
  const [selectedMeal, setSelectedMeal] = useState('Tất cả')
  const [selectedShift, setSelectedShift] = useState('Tất cả')
  const [searchValue, setSearchValue] = useState('')
  const [activeModal, setActiveModal] = useState(null)

  const filteredMenus = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase()

    return menuList.filter((menu) => {
      const menuDishes = getMenuDishes(menu, dishList)
      const matchDate = menu.date === selectedDate
      const matchMeal = selectedMeal === 'Tất cả' || menu.meal === selectedMeal
      const matchShift =
        selectedShift === 'Tất cả' || menu.shift === selectedShift
      const matchSearch =
        !keyword ||
        menu.title.toLowerCase().includes(keyword) ||
        menuDishes.some((dish) => dish.name.toLowerCase().includes(keyword))

      return matchDate && matchMeal && matchShift && matchSearch
    })
  }, [dishList, menuList, searchValue, selectedDate, selectedMeal, selectedShift])

  function openModal(mode, menu) {
    setActiveModal({ mode, menu })
  }

  function closeModal() {
    setActiveModal(null)
  }

  function saveMenu(menuValue) {
    if (isShiftLocked(menuValue.date, menuValue.shift)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể sửa thực đơn.')
      return
    }

    const nextMenu = {
      id: menuValue.id || `menu-${Date.now()}`,
      date: menuValue.date,
      meal: menuValue.meal,
      shift: menuValue.shift,
      title: menuValue.title,
      dishIds: menuValue.dishIds,
      locked: Boolean(menuValue.locked),
    }
    const nextMenus = menuValue.id
      ? menuList.map((menu) => (menu.id === menuValue.id ? nextMenu : menu))
      : [nextMenu, ...menuList]
    const storedPlans = readStoredKitchenPlans()
    const fixedPlans = storedPlans.map((plan) => {
      const planMatchesMenu =
        (plan.date === nextMenu.date ||
          menuList.find((menu) => menu.id === plan.menuId)?.date === nextMenu.date) &&
        (plan.meal === nextMenu.meal ||
          menuList.find((menu) => menu.id === plan.menuId)?.meal === nextMenu.meal) &&
        (plan.shift === nextMenu.shift ||
          menuList.find((menu) => menu.id === plan.menuId)?.shift === nextMenu.shift)
      const shouldLinkPlannedDish =
        planMatchesMenu && nextMenu.dishIds.includes(plan.dishId)
      const shouldRelinkDish =
        plan.menuId === nextMenu.id && !nextMenu.dishIds.includes(plan.dishId)

      if (shouldLinkPlannedDish) {
        return {
          ...plan,
          menuId: nextMenu.id,
          date: nextMenu.date,
          meal: nextMenu.meal,
          shift: nextMenu.shift,
        }
      }

      return shouldRelinkDish
        ? { ...plan, dishId: nextMenu.dishIds[0] }
        : plan
    })

    setMenuList(nextMenus)
    setPlanList(fixedPlans)
    saveStoredKitchenMenus(nextMenus)
    saveStoredKitchenPlans(fixedPlans)
    setSelectedDate(nextMenu.date)
    setSelectedMeal(nextMenu.meal)
    setSelectedShift(nextMenu.shift)
    setSearchValue('')
    closeModal()
  }

  function copyMenu(menu) {
    if (isShiftLocked(menu.date, menu.shift)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể sao chép thực đơn.')
      return
    }

    const copiedMenu = {
      ...menu,
      id: `menu-${Date.now()}`,
      title: `${menu.title} - bản sao`,
      locked: false,
    }
    const nextMenus = [copiedMenu, ...menuList]

    setMenuList(nextMenus)
    saveStoredKitchenMenus(nextMenus)
    setSelectedDate(copiedMenu.date)
    setSelectedMeal(copiedMenu.meal)
    setSelectedShift(copiedMenu.shift)
    setSearchValue('')
  }

  function lockMenu(menu) {
    if (isShiftLocked(menu.date, menu.shift)) {
      window.alert('Ca đã được quản lý duyệt và khóa. Không thể đổi trạng thái thực đơn.')
      return
    }

    const nextMenus = menuList.map((item) =>
      item.id === menu.id ? { ...item, locked: true } : item,
    )

    setMenuList(nextMenus)
    saveStoredKitchenMenus(nextMenus)
  }

  return (
    <section className="space-y-6">
      <KitchenPlanHeader
        title="Thực đơn"
        description="Tạo thực đơn từ các món đã có trong kế hoạch chế biến theo ngày, bữa và ca."
        actionLabel="Tạo thực đơn"
        actionIcon={Plus}
        onAction={() => openModal('create')}
      />

      <KitchenPlanFilters
        date={selectedDate}
        meal={selectedMeal}
        shift={selectedShift}
        mealOptions={mealOptions}
        shiftOptions={kitchenShiftOptions}
        searchValue={searchValue}
        onDateChange={setSelectedDate}
        onMealChange={setSelectedMeal}
        onShiftChange={setSelectedShift}
        onSearchChange={setSearchValue}
      />

      <MenuTable
        menus={filteredMenus}
        dishList={dishList}
        onView={(menu) => openModal('view', menu)}
        onEdit={(menu) => openModal('edit', menu)}
        onCopy={copyMenu}
        onLock={lockMenu}
      />

      {activeModal ? (
        <FormModal
          title={
            activeModal.mode === 'create'
              ? 'Tạo thực đơn'
              : activeModal.mode === 'edit'
                ? 'Sửa thực đơn'
                : 'Chi tiết thực đơn'
          }
          description="Chỉ các món đã được lập trong kế hoạch cùng ngày, bữa và ca mới xuất hiện để chọn vào thực đơn."
          onClose={closeModal}
        >
          <MenuForm
            mode={activeModal.mode}
            menu={activeModal.menu}
            dishes={dishList}
            planRows={buildPlanRows(planList, menuList, dishList)}
            mealOptions={mealOptions}
            shiftOptions={kitchenShiftOptions}
            onCancel={closeModal}
            onSubmit={saveMenu}
          />
        </FormModal>
      ) : null}
    </section>
  )
}

export default KitchenMenuPage
