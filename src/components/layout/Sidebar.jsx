import { useState, useEffect, useRef } from 'react';
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
  faChartBar,
  faSchool,
  faUserGraduate,
  faUserGroup,
  faUsers,
  faChevronDown,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { RiMenu4Fill, RiCloseFill } from 'react-icons/ri';
import { COLORS } from '../../constants/colors';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import Logo from '../../assets/Logo.png';

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

  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredItemTop, setHoveredItemTop] = useState(0);
  const [pointerTop, setPointerTop] = useState(0);
  const [pinnedItem, setPinnedItem] = useState(null);
  const [activeFlyout, setActiveFlyout] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const sidebarRef = useRef(null);

  // Manage Flyout Visibility with Animation Time
  useEffect(() => {
    const currentTrigger = hoveredItem || pinnedItem;
    
    if (currentTrigger) {
      setActiveFlyout(currentTrigger);
      setIsExiting(false);
    } else if (activeFlyout) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setActiveFlyout(null);
        setIsExiting(false);
      }, 800); // Match the 0.8s animation duration
      return () => clearTimeout(timer);
    }
  }, [hoveredItem, pinnedItem, activeFlyout]);

  // Close pinned item when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setPinnedItem(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { icon: faUserGraduate, label: 'Students', path: '/students' },
    { icon: faUserGroup, label: 'Parents', path: '/parents' },
    { icon: faSchool, label: 'Classes', path: '/classes' },
    { 
      label: 'Transport Hub', 
      icon: faBus, 
      id: 'transport',
      subItems: [
        { icon: faCar, label: 'Drivers', path: '/drivers' },
        { icon: faBus, label: 'Buses', path: '/buses' },
        { icon: faMapLocationDot, label: 'Routes', path: '/routes' },
        { icon: faCalendarCheck, label: 'Trips', path: '/trips' },
      ]
    },
    { icon: faUsers, label: 'Directory', path: '/student-directory' },
    { icon: faChartBar, label: 'Reports', path: '/reports' },
    { icon: faComments, label: 'Communication', path: '/communication' },
    { icon: faUserShield, label: 'Settings', path: '/admin' },
  ];

  // Logic to determine if any sub-item is active
  const isSubItemActive = (subItems) => {
    return subItems.some(item => location.pathname.startsWith(item.path));
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
    setPinnedItem(null);
    setHoveredItem(null); // Force flyout to vanish immediately
  };

  const handleItemClick = (item) => {
    if (item.subItems) {
      setPinnedItem(pinnedItem === item.id ? null : item.id);
    } else {
      handleNavigation(item.path);
      setPinnedItem(null);
    }
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
    <div ref={sidebarRef}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-[1001] p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-black shadow-lg hover:bg-white/20 transition-all active:scale-95 border border-white/10"
        >
          <RiMenu4Fill size={24} />
        </button>
      )}

      <div
        className={`w-64 h-screen fixed left-0 top-0 flex flex-col transition-transform duration-500 ease-out z-[1000] ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ 
          background: `linear-gradient(180deg, ${COLORS.SIDEBAR_BG} 0%, ${COLORS.SIDEBAR_GRADIENT_END} 100%)` 
        }}
      >
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute top-4 right-4 z-[1001] p-2 text-white hover:text-blue-200 transition-colors"
          >
            <RiCloseFill size={28} />
          </button>
        )}
        
        {/* Clean Tech Dots Overlay - Full Background */}
        <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>

        <div 
          className="p-8 pb-4 flex flex-col items-center gap-2 cursor-pointer relative z-10"
          onClick={() => handleNavigation('/dashboard')}
        >
          <div className="relative group">
            <div className="absolute -inset-8 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
            <div className="w-24 h-24 flex items-center justify-center relative">
               <img src={Logo} alt="Selvagam Logo" className="w-full h-full object-contain filter drop-shadow-[0_12px_25px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white tracking-[6px] uppercase leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Selvagam
            </h1>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto custom-scrollbar relative z-10 text-blue-950">
          {menuItems.map((item, index) => {
            const hasSubItems = !!item.subItems;
            const subActive = hasSubItems && isSubItemActive(item.subItems);
            const active = hasSubItems ? subActive : location.pathname.startsWith(item.path);
            const isHovered = hoveredItem === item.id;
            const isPinned = pinnedItem === item.id;

            return (
              <div 
                key={index} 
                className="px-4"
                onMouseEnter={(e) => {
                  if (hasSubItems) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const estimatedCardHeight = 360; // Estimated max height of the transport hub card
                    const viewportHeight = window.innerHeight;
                    
                    // Initial target top (centered to item)
                    let targetTop = rect.top - (estimatedCardHeight / 2) + (rect.height / 2);
                    
                    // Guard: Don't go above screen top
                    if (targetTop < 20) targetTop = 20;
                    
                    // Guard: Don't go below screen bottom
                    if (targetTop + estimatedCardHeight > viewportHeight - 20) {
                      targetTop = viewportHeight - estimatedCardHeight - 20;
                    }
                    
                    setHoveredItem(item.id);
                    setHoveredItemTop(targetTop);
                    // Store the actual item top to align the pointer arrow
                    setPointerTop(rect.top + (rect.height / 2) - targetTop);
                  }
                }}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="relative group/nav">
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 font-black text-sm relative overflow-hidden group outline-none ${
                       active 
                        ? 'text-white shadow-[0_10px_25px_-5px_rgba(58,123,255,0.4)] translate-x-1' 
                        : isPinned
                        ? 'text-white border border-white/40 bg-white/10 translate-x-1'
                        : 'text-blue-950 hover:text-blue-700 hover:translate-x-1'
                    }`}
                  >
                    {/* Active Background Gradient */}
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 z-0"></div>
                    )}
                    
                    {/* Hover Glow */}
                    {!(active || isPinned) && (
                      <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}

                    <div className="relative z-10 flex items-center gap-4 w-full">
                      <div className="flex items-center justify-center w-6">
                        <FontAwesomeIcon 
                          icon={item.icon} 
                          className={`text-lg transition-all duration-500 ${active || isPinned ? 'scale-110 text-white' : 'opacity-60 group-hover/nav:scale-125 group-hover/nav:opacity-100 group-hover/nav:rotate-6'}`} 
                        />
                      </div>
                      
                      <div className="flex flex-col justify-center min-h-[1.5rem]">
                        <span className="tracking-wide leading-none">{item.label}</span>
                        {hasSubItems && subActive && (
                          <span className="text-[10px] font-bold opacity-80 mt-1 capitalize animate-in fade-in slide-in-from-top-1">
                            {item.subItems.find(s => location.pathname.startsWith(s.path))?.label}
                          </span>
                        )}
                      </div>
                      
                      {hasSubItems && (
                        <FontAwesomeIcon 
                          icon={faChevronRight} 
                          className={`ml-auto text-[10px] transition-transform duration-500 ${(isHovered || isPinned) ? 'rotate-90 text-white opacity-100' : 'opacity-40'}`} 
                        />
                      )}
                      
                      {!hasSubItems && active && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse"></div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )
          })}
        </nav>

        {/* Floating Flyout Cards - The "Interactive Hub" Redesign */}
        {menuItems.map((item, index) => {
          if (!item.subItems || activeFlyout !== item.id) return null;

          return (
            <div 
              key={`flyout-${index}`}
              className="fixed left-64 ml-5 w-72 z-[2000] perspective-1000"
              style={{ top: hoveredItemTop - 20 }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Invisible Bridge */}
              <div className="absolute -left-6 top-0 bottom-0 w-8"></div>

              <div 
                className="bg-white/5 backdrop-blur-[30px] rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3),0_30px_60px_-30px_rgba(0,0,0,0.5),0_0_50px_-10px_rgba(58,123,255,0.2)] border border-white/20 p-4 overflow-hidden"
                style={{ 
                  animation: `${isExiting ? 'hubExit' : 'hubEntrance'} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`
                }}
              >
                <div className="px-4 py-3 mb-4 rounded-3xl bg-blue-600/5 border border-blue-600/10">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[3px] text-center opacity-80 leading-tight">
                    {item.label}
                    {item.subItems.find(s => location.pathname.startsWith(s.path)) && (
                      <span className="block mt-1 text-blue-800 text-[11px] tracking-normal capitalize">
                        {item.subItems.find(s => location.pathname.startsWith(s.path)).label}
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {item.subItems.map((sub, sIndex) => {
                    const subActive = location.pathname.startsWith(sub.path);


                    return (
                      <button
                        key={sIndex}
                        onClick={() => handleNavigation(sub.path)}
                        className={`w-full group/sub text-left px-4 py-3.5 rounded-[2rem] transition-all duration-500 relative overflow-hidden flex items-center gap-4 active:scale-95 ${
                          subActive 
                            ? 'bg-blue-600 shadow-xl shadow-blue-500/30 translate-x-1' 
                            : 'hover:bg-white/[0.08] hover:translate-x-2'
                        }`}
                        style={{ 
                          animation: `premiumPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${sIndex * 0.1}s`,
                          opacity: 0,
                          transform: 'scale(0.8) translateY(20px)'
                        }}
                      >
                        {/* Hover Light Sweep */}
                        {!subActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/sub:translate-x-full transition-transform duration-1000 ease-out"></div>
                        )}

                        {/* Icon Bubble */}
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                          subActive 
                            ? 'bg-white/20 shadow-inner' 
                            : 'bg-blue-600/10 group-hover/sub:bg-blue-600 group-hover/sub:rotate-[15deg] group-hover/sub:scale-110'
                        }`}>
                          <FontAwesomeIcon 
                            icon={sub.icon} 
                            className={`text-base transition-transform duration-500 ${
                              subActive ? 'text-white' : 'text-blue-600 group-hover/sub:text-white group-hover/sub:-rotate-[15deg]'
                            }`} 
                          />
                        </div>

                        <div className="flex flex-col relative z-10">
                          <span className={`text-[14px] font-black tracking-tight leading-none transition-colors duration-300 ${
                            subActive ? 'text-white' : 'text-blue-950 group-hover/sub:text-blue-700'
                          }`}>
                            {sub.label}
                          </span>

                        </div>

                        {/* Active Laser Indicator */}
                        {subActive && (
                          <div className="absolute right-0 top-4 bottom-4 w-1 bg-white rounded-l-full shadow-[0_0_10px_white]"></div>
                        )}
                        
                        {/* Hover Dot */}
                        {!subActive && (
                          <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-600 scale-0 group-hover/sub:scale-100 transition-transform duration-300 delay-100"></div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
              
              {/* Connection Indicator - Glassy */}
              <div 
                className="absolute -left-2 w-5 h-5 bg-white/5 backdrop-blur-[30px] border-l border-t border-white/20 rotate-[-45deg] rounded-sm transition-all duration-300"
                style={{ top: pointerTop - 10 }}
              ></div>
            </div>
          )
        })}

        <style>{`
          @keyframes hubEntrance {
            from { 
              opacity: 0; 
              transform: translateX(-40px) scale(0.9); 
              filter: blur(10px);
            }
            to { 
              opacity: 1; 
              transform: translateX(0) scale(1); 
              filter: blur(0);
            }
          }
          @keyframes hubExit {
            from { 
              opacity: 1; 
              transform: translateX(0) scale(1); 
              filter: blur(0);
            }
            to { 
              opacity: 0; 
              transform: translateX(-40px) scale(0.9); 
              filter: blur(10px);
            }
          }
          @keyframes premiumPop {
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .custom-scrollbar::-webkit-scrollbar { width: 0; }
          .perspective-1000 { perspective: 1000px; }
        `}</style>

        <div className="mt-auto p-4 relative z-10 px-6">
          <button
            onClick={handleLogout}
            className="flex items-center justify-between px-5 py-4 font-black w-full text-blue-950 bg-black/5 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-300 group shadow-sm active:scale-95"
            style={{ border: 'none', cursor: 'pointer' }}
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 text-red-500 group-hover:rotate-12 transition-transform" />
              <span className="text-xs tracking-tight">Logout</span>
            </div>
            <RiCloseFill size={18} className="opacity-20 group-hover:opacity-100" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[999]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
