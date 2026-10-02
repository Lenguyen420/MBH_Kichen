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
import MealCancelPage from './page/MealCancelPage'
import MealSampleHistoryPage from './page/MealSampleHistoryPage'
import MealSampleManagePage from './page/MealSampleManagePage'
import NotFoundPage from './page/NotFoundPage'
import PlaceholderPage from './page/PlaceholderPage'
import ReportsPage from './page/ReportsPage'
import ShiftSummaryPage from './page/ShiftSummaryPage'

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
        <Route path="samples/manage" element={<MealSampleManagePage />} />
        <Route path="inventory/cancel" element={<MealCancelPage />} />
        <Route path="samples/history" element={<MealSampleHistoryPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="shift/summary" element={<ShiftSummaryPage />} />
        <Route path="*" element={<PlaceholderPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
