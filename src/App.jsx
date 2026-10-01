import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import CookingTrackingPage from './page/CookingTrackingPage'
import DashboardPage from './page/DashboardPage'
import KitchenMenuPage from './page/KitchenMenuPage'
import KitchenPlanTodayPage from './page/KitchenPlanTodayPage'
import LoginPage from './page/LoginPage'
import {
  MealExportPage,
  MealHistoryPage,
  MealImportPage,
  MealInventoryPage,
} from './page/MealFlowPages'
import NotFoundPage from './page/NotFoundPage'
import PlaceholderPage from './page/PlaceholderPage'

function App() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="dashboard" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="kitchen-plan/today" element={<KitchenPlanTodayPage />} />
        <Route path="kitchen-plan/menu" element={<KitchenMenuPage />} />
        <Route path="cooking/tracking" element={<CookingTrackingPage />} />
        <Route path="meal-flow/import" element={<MealImportPage />} />
        <Route path="meal-flow/export" element={<MealExportPage />} />
        <Route path="inventory/remaining" element={<MealInventoryPage />} />
        <Route path="meal-flow/history" element={<MealHistoryPage />} />
        <Route path="*" element={<PlaceholderPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
