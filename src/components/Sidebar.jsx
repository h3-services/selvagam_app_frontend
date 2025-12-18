import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDashboard,
  faUserFriends,
  faCar,
  faBus,
  faMapLocationDot
} from '@fortawesome/free-solid-svg-icons';
import { RiMenu4Fill, RiCloseFill } from 'react-icons/ri';
import { COLORS } from '../constants/colors';

const Sidebar = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: faDashboard, label: 'Dashboard', page: 'dashboard' },
    { icon: faUserFriends, label: 'Parent Management', page: 'parent-management' },
    { icon: faCar, label: 'Driver Management', page: 'driver-management' },
    { icon: faBus, label: 'Bus Management', page: 'bus-management' },
    { icon: faMapLocationDot, label: 'Route Management', page: 'route-management' },
  ];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 text-[black]"
        >
          <RiMenu4Fill size={34} />
        </button>
      )}

      <div
        className={`w-64 h-screen fixed left-0 top-0 text-white flex flex-col transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ backgroundColor: COLORS.SIDEBAR_BG }}
      >
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute top-4 right-4 z-50 p-2 text-white"
          >
            <RiCloseFill size={34} />
          </button>
        )}
        <div className="p-5 border-b border-white/10">
          <h2 className=" text-2xl m-0">Admin Panel</h2>
        </div>

        <nav className="flex-1 py-5">
          {menuItems.map((item, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => { setActiveIndex(index); onNavigate(item.page); }}
                className="flex items-center gap-4 px-5 py-4 font-medium w-full text-left"
                style={{
                  backgroundColor: activeIndex === index ? COLORS.SIDEBAR_ACTIVE : 'transparent',
                  color: activeIndex === index ? 'black' : 'white',
                  borderTopRightRadius: activeIndex === index ? '25px' : '0',
                  borderBottomRightRadius: activeIndex === index ? '25px' : '0',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </div>
          ))}
        </nav>

      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
