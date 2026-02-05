import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDashboard,
  faUserFriends,
  faCar,
  faBus,
  faMapLocationDot,
  faComments,
  faUserShield,
  faSignOutAlt,
  faCode,
  faCalendarCheck,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { RiMenu4Fill, RiCloseFill } from 'react-icons/ri';
import { COLORS } from '../../constants/colors';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Helper to check if a path is active
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    { icon: faDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: faUserFriends, label: 'Student Management', path: '/students' },
    { icon: faCar, label: 'Driver Management', path: '/drivers' },
    { icon: faBus, label: 'Bus Management', path: '/buses' },
    { icon: faMapLocationDot, label: 'Route Management', path: '/routes' },
    { icon: faCalendarCheck, label: 'Trip Management', path: '/trips' },
    { icon: faChartBar, label: 'Reports', path: '/reports' },
    { icon: faComments, label: 'Communication', path: '/communication' },
    { icon: faUserShield, label: 'Administration', path: '/admin' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-[1001] p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-black shadow-lg hover:bg-white/20 transition-all active:scale-95 border border-white/10"
        >
          <RiMenu4Fill size={24} />
        </button>
      )}

      <div
        className={`w-64 h-screen fixed left-0 top-0 text-white flex flex-col transition-transform duration-300 z-[1000] ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-2xl`}
        style={{ backgroundColor: COLORS.SIDEBAR_BG }}
      >
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute top-4 right-4 z-[1001] p-2 text-white hover:text-purple-200 transition-colors"
          >
            <RiCloseFill size={28} />
          </button>
        )}
        <div className="p-5 border-b border-white/10">
          <h2 className=" text-2xl m-0">School Management</h2>
        </div>

        <nav className="flex-1 py-5">
          {menuItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <div key={index} className="relative">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center gap-4 px-5 py-4 font-medium w-full text-left"
                  style={{
                    backgroundColor: active ? COLORS.SIDEBAR_ACTIVE : 'transparent',
                    color: active ? 'black' : 'white',
                    borderTopRightRadius: active ? '25px' : '0',
                    borderBottomRightRadius: active ? '25px' : '0',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </div>
            )
          })}
        </nav>
        <div className="mt-auto p-5 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 font-medium w-full text-left text-white hover:bg-white/10 rounded-xl transition-all"
            style={{ border: 'none', cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-red-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[999]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
