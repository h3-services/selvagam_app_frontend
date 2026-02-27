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
          <Route path="/students/view/:status" element={<StudentManagement />} />
          <Route path="/students/add" element={<StudentManagement />} />
          <Route path="/students/:studentId/detail" element={<StudentManagement />} />
          <Route path="/students/:studentId/detail/parent/:role" element={<StudentManagement />} />
          <Route path="/students/:studentId/edit" element={<StudentManagement />} />
          <Route path="/parents" element={<ParentManagement />} />
          <Route path="/parents/view/:status" element={<ParentManagement />} />
          <Route path="/parents/add" element={<ParentManagement />} />
          <Route path="/parents/:parentId/detail" element={<ParentManagement />} />
          <Route path="/parents/:parentId/detail/link" element={<ParentManagement />} />
          <Route path="/parents/:parentId/edit" element={<ParentManagement />} />
          <Route path="/parents/inactive" element={<InactiveParentManagement />} />
          <Route path="/classes" element={<ClassManagement />} />
          <Route path="/classes/add" element={<ClassManagement />} />
          <Route path="/classes/:classId/edit" element={<ClassManagement />} />
          <Route path="/classes/promote" element={<ClassManagement />} />
          <Route path="/drivers" element={<DriverManagement />} />
          <Route path="/drivers/view/:status" element={<DriverManagement />} />
          <Route path="/drivers/add" element={<DriverManagement />} />
          <Route path="/drivers/:driverId/detail" element={<DriverManagement />} />
          <Route path="/drivers/:driverId/edit" element={<DriverManagement />} />
          <Route path="/buses" element={<BusManagement />} />
          <Route path="/buses/add" element={<BusManagement />} />
          <Route path="/buses/:busId/detail" element={<BusManagement />} />
          <Route path="/buses/:busId/edit" element={<BusManagement />} />
          <Route path="/routes" element={<RouteManagement />} />
          <Route path="/routes/view/:status" element={<RouteManagement />} />
          <Route path="/routes/add" element={<RouteManagement />} />
          <Route path="/routes/:routeId/detail" element={<RouteManagement />} />
          <Route path="/routes/:routeId/edit" element={<RouteManagement />} />
          <Route path="/trips" element={<TripManagement />} />
          <Route path="/trips/:tripId/detail" element={<TripManagement />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/communication/view/:category" element={<Communication />} />
          <Route path="/admin" element={<SuperAdmin />} />
          <Route path="/admin/add" element={<SuperAdmin />} />
          <Route path="/admin/:adminId/edit" element={<SuperAdmin />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<ComingSoon />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
