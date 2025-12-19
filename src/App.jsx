import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import DashboardOverview from './components/DashboardOverview'
import ParentAccess from './components/ParentAccess'
import DriverManagement from './components/DriverManagement'
import BusManagement from './components/BusManagement'
import RouteManagement from './components/RouteManagement'
import ComingSoon from './components/ComingSoon'
import Communication from './components/Communication'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Dashboard Layout Wrapper - No specific path prefix, so children determine URL */}
        <Route element={<Dashboard />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/parents" element={<ParentAccess />} />
          <Route path="/drivers" element={<DriverManagement />} />
          <Route path="/buses" element={<BusManagement />} />
          <Route path="/routes" element={<RouteManagement />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="*" element={<ComingSoon />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
