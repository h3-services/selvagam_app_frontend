import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { COLORS } from '../../constants/colors';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faBus, faMapLocationDot, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getSubNavItems = () => {
    const transportPaths = ['/drivers', '/buses', '/routes', '/trips'];
    if (transportPaths.some(path => location.pathname.startsWith(path))) {
      return [
        { icon: faCar, label: 'Drivers', path: '/drivers' },
        { icon: faBus, label: 'Buses', path: '/buses' },
        { icon: faMapLocationDot, label: 'Routes', path: '/routes' },
        { icon: faCalendarCheck, label: 'Trips', path: '/trips' },
      ];
    }
    return null;
  };

  const subNavItems = getSubNavItems();

  return (
    <div className="h-screen flex transition-colors duration-300" style={{ backgroundColor: COLORS.PAGE_BG, fontFamily: "'Outfit', sans-serif" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen lg:ml-64 transition-all duration-300">
        <div className="flex-1 bg-white w-full overflow-hidden rounded-none lg:rounded-tl-[50px] flex flex-col relative">
          
          {/* Mobile Horizontal Sub-Nav */}
          {subNavItems && (
            <div className="lg:hidden flex border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 overflow-x-auto no-scrollbar scroll-smooth">
              <div className="flex px-4 py-2 gap-2 min-w-full">
                {subNavItems.map((item, index) => {
                  const active = location.pathname.startsWith(item.path);
                  return (
                    <button
                      key={index}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all text-xs font-bold border ${
                        active 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                          : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      <FontAwesomeIcon icon={item.icon} size="sm" className={active ? 'text-white' : 'text-blue-500/50'} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto no-scrollbar">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
