import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { COLORS } from '../../constants/colors';

const Dashboard = () => {
  return (
    <div className="h-screen flex transition-colors duration-300" style={{ backgroundColor: COLORS.PAGE_BG, fontFamily: "'Outfit', sans-serif" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen lg:ml-64 transition-all duration-300">
        <div className="flex-1 bg-slate-50 w-full overflow-hidden rounded-none lg:rounded-tl-[50px] flex flex-col relative">
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
