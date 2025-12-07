import { useState } from 'react';
import Sidebar from './Sidebar';
import ParentAccess from './ParentAccess';
import DriverManagement from './DriverManagement';
import ComingSoon from './ComingSoon';
import { COLORS } from '../constants/colors';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('parent-management');

  const renderPage = () => {
    switch(currentPage) {
      case 'parent-management':
        return <ParentAccess />;
      case 'driver-management':
        return <DriverManagement />;
      case 'dashboard':
      case 'search':
        return <ComingSoon />;
      default:
        return <ParentAccess />;
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
