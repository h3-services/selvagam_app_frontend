import { useState } from 'react';
import Sidebar from './Sidebar';
import ParentAccess from './ParentAccess';
import DriverManagement from './DriverManagement';
import BusManagement from './BusManagement';
import RouteManagement from './RouteManagement';
import ComingSoon from './ComingSoon';
import DashboardOverview from './DashboardOverview';
import { COLORS } from '../constants/colors';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'parent-management':
        return <ParentAccess />;
      case 'driver-management':
        return <DriverManagement />;
      case 'bus-management':
        return <BusManagement />;
      case 'route-management':
        return <RouteManagement />;
      case 'dashboard':
        return <DashboardOverview />;
      case 'search':
        return <ComingSoon />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.PAGE_BG }}>
      <Sidebar onNavigate={setCurrentPage} />
      <div className="lg:ml-64 flex-1">
        <div className="bg-[#f2f2f2] h-full w-full" style={{ borderTopLeftRadius: '50px' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
