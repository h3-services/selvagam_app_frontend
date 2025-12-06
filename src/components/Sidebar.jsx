import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDashboard, 
  faUsers, 
  faBox, 
  faChartLine, 
  faCog 
} from '@fortawesome/free-solid-svg-icons';
import { RiMenu4Fill } from 'react-icons/ri';
import { COLORS } from '../constants/colors';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { icon: faDashboard, label: 'Dashboard', path: '/' },
    { icon: faSearch, label: 'Search', path: '/search' },
    { icon: faUsers, label: 'Users', path: '/users' },
    { icon: faBox, label: 'Products', path: '/products' },
    { icon: faChartLine, label: 'Analytics', path: '/analytics' },
    { icon: faCog, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 text-[black]"
      >
        <RiMenu4Fill size={34}  />
      </button>
      
      <div 
        className={`w-64 h-screen fixed left-0 top-0 text-white flex flex-col transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ backgroundColor: COLORS.SIDEBAR_BG }}
      >
      <div className="p-5 border-b border-white/10">
        <h2 className=" text-2xl m-0">Admin Panel</h2>
      </div>
      
        <nav className="flex-1 py-5">
          {menuItems.map((item, index) => (
            <div key={index} className="relative">
              <a 
                href={item.path} 
                onClick={(e) => { e.preventDefault(); setActiveIndex(index); }}
                className="flex items-center gap-4 px-5 py-4 no-underline font-medium"
                style={{
                  backgroundColor: activeIndex === index ? COLORS.SIDEBAR_ACTIVE : 'transparent',
                  color: activeIndex === index ? 'black' : 'white',
                  borderTopRightRadius: activeIndex === index ? '25px' : '0',
                  borderBottomRightRadius: activeIndex === index ? '25px' : '0',
                }}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
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
