import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { COLORS } from '../constants/colors';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.PAGE_BG }}>
      <Sidebar />
      <div className="lg:ml-64 flex-1">
        <div className="bg-[#f2f2f2] h-full w-full" style={{ borderTopLeftRadius: '50px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
