import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import FormModal from '../components/KitchenPlan/FormModal'
import KitchenPlanFilters from '../components/KitchenPlan/KitchenPlanFilters'
import KitchenPlanHeader from '../components/KitchenPlan/KitchenPlanHeader'
import MenuForm from '../components/KitchenPlan/MenuForm'
import MenuTable from '../components/KitchenPlan/MenuTable'
import {
  getMenuDishes,
  kitchenShiftOptions,
  mealOptions,
  readStoredKitchenDishes,
  readStoredKitchenMenus,
  readStoredKitchenPlans,
  saveStoredKitchenMenus,
  saveStoredKitchenPlans,
} from '../datas/kitchenPlanData'

function KitchenMenuPage() {
  const [dishList] = useState(readStoredKitchenDishes)
  const [menuList, setMenuList] = useState(readStoredKitchenMenus)
  const [selectedDate, setSelectedDate] = useState('2026-09-30')
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
      const shouldRelinkDish =
        plan.menuId === nextMenu.id && !nextMenu.dishIds.includes(plan.dishId)

      return shouldRelinkDish
        ? { ...plan, dishId: nextMenu.dishIds[0] }
        : plan
    })

    setMenuList(nextMenus)
    saveStoredKitchenMenus(nextMenus)
    saveStoredKitchenPlans(fixedPlans)
    setSelectedDate(nextMenu.date)
    setSelectedMeal(nextMenu.meal)
    setSelectedShift(nextMenu.shift)
    setSearchValue('')
    closeModal()
  }

  function copyMenu(menu) {
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
        description="Xem thực đơn theo ngày, bữa hoặc ca. Các món trong thực đơn được dùng để lập kế hoạch chế biến."
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
          description="Thực đơn là nguồn dữ liệu để lập kế hoạch chế biến theo ngày, bữa và ca."
          onClose={closeModal}
        >
          <MenuForm
            mode={activeModal.mode}
            menu={activeModal.menu}
            dishes={dishList}
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
