import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/LoginHome';
import Dashboard from './components/layout/DashboardLayout';
import DashboardOverview from './components/dashboard/DashboardHome';
import StudentManagement from './components/student-management/StudentManagementHome';
import ParentManagement from './components/parent-management/ParentManagementHome';
import InactiveParentManagement from './components/parent-management/InactiveParentManagement';
import ClassManagement from './components/class-management/ClassManagementHome';
import DriverManagement from './components/driver-management/DriverManagementHome';
import BusManagement from './components/bus-management/BusManagementHome';
import RouteManagement from './components/route-management/RouteManagementHome';
import TripManagement from './components/trip-management/TripManagementHome';
import ComingSoon from './components/layout/ComingSoon';
import Communication from './components/communication/CommunicationHome';
import SuperAdmin from './components/super-admin/SuperAdminHome';
import Reports from './components/reports/ReportsHome';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Dashboard Layout Wrapper - No specific path prefix, so children determine URL */}
        <Route element={<Dashboard />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/parents" element={<ParentManagement />} />
          <Route path="/parents/inactive" element={<InactiveParentManagement />} />
          <Route path="/classes" element={<ClassManagement />} />
          <Route path="/drivers" element={<DriverManagement />} />
          <Route path="/buses" element={<BusManagement />} />
          <Route path="/routes" element={<RouteManagement />} />
          <Route path="/trips" element={<TripManagement />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/admin" element={<SuperAdmin />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<ComingSoon />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
