import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroadcastTower, faUsers, faGraduationCap, faRoute, faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import ComposeMessage from './ComposeMessage';
import { classService } from '../../services/classService';
import { routeService } from '../../services/routeService';

const CommunicationHome = () => {
    const [category, setCategory] = useState('ALL'); // 'ALL' | 'CLASS' | 'ROUTE'
    const [classes, setClasses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classRes, routeRes] = await Promise.all([
                    classService.getAllClasses(),
                    routeService.getAllRoutes()
                ]);
                
                const activeClasses = (classRes || []).filter(c => (c.status || '').toUpperCase() === 'ACTIVE');
                const activeRoutes = (routeRes || []).filter(r => (r.routes_active_status || r.status || '').toUpperCase() === 'ACTIVE');

                setClasses(activeClasses);
                setRoutes(activeRoutes);
            } catch (error) {
                console.error("Failed to fetch categorized data:", error);
            }
        };
        fetchData();
    }, []);

    const CategoryButton = ({ id, label, icon, current }) => (
        <button
            onClick={() => {
                setCategory(id);
                setShowDropdown(false);
            }}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all font-black text-[11px] uppercase tracking-[0.2em] relative overflow-hidden group
                ${current === id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-blue-400 hover:text-blue-600 shadow-sm'}`}
        >
            <FontAwesomeIcon icon={icon} className={`${current === id ? 'text-blue-400' : 'text-slate-300 group-hover:text-blue-400'}`} />
            {label}
            {current === id && <div className="absolute top-0 right-0 w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-bl-xl rotate-12 translate-x-1 -translate-y-1"><FontAwesomeIcon icon={faCheck} className="text-[10px]" /></div>}
        </button>
    );

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-30">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 max-w-7xl mx-auto w-full">
                    <div className='ml-14 lg:ml-0'>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                            Communication Hub
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Announcement Control</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 max-w-2xl">
                        <CategoryButton id="ALL" label="All Parents" icon={faUsers} current={category} />
                        <CategoryButton id="CLASS" label="Class Wise" icon={faGraduationCap} current={category} />
                        <CategoryButton id="ROUTE" label="Route Wise" icon={faRoute} current={category} />
                    </div>
                </div>
            </div>

            {/* Sub-Selector Section */}
            {(category === 'CLASS' || category === 'ROUTE') && (
                <div className="bg-white/50 backdrop-blur-md border-b border-slate-200 p-4 animate-in slide-in-from-top-4 duration-300 z-20">
                    <div className="max-w-xl mx-auto relative px-4 sm:px-0">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 flex items-center justify-between text-slate-900 font-black text-sm hover:border-blue-400 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <FontAwesomeIcon icon={category === 'CLASS' ? faGraduationCap : faRoute} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Select {category === 'CLASS' ? 'Standard' : 'Travel Route'}</p>
                                    <p className="truncate max-w-[200px] sm:max-w-none">
                                        {category === 'CLASS' 
                                            ? (selectedClass ? `${selectedClass.class_name} - ${selectedClass.section}` : 'Choose a Class...') 
                                            : (selectedRoute ? selectedRoute.name : 'Choose a Route...')}
                                    </p>
                                </div>
                            </div>
                            <FontAwesomeIcon icon={faChevronDown} className={`text-slate-300 transition-transform duration-300 ${showDropdown ? 'rotate-180 text-blue-500' : ''}`} />
                        </button>

                        {showDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-slate-100 z-[100] overflow-hidden animate-in zoom-in-95 duration-200 p-2">
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-1 p-1">
                                    {category === 'CLASS' ? (
                                        classes.map((cls) => (
                                            <button
                                                key={cls.class_id}
                                                onClick={() => {
                                                    setSelectedClass(cls);
                                                    setShowDropdown(false);
                                                }}
                                                className={`px-4 py-3 rounded-xl text-xs font-black text-left transition-all ${selectedClass?.class_id === cls.class_id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}
                                            >
                                                {cls.class_name} - {cls.section}
                                            </button>
                                        ))
                                    ) : (
                                        routes.map((route) => (
                                            <button
                                                key={route.route_id}
                                                onClick={() => {
                                                    setSelectedRoute(route);
                                                    setShowDropdown(false);
                                                }}
                                                className={`px-4 py-3 rounded-xl text-xs font-black text-left transition-all ${selectedRoute?.route_id === route.route_id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`}
                                            >
                                                {route.name}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="flex-1 px-4 lg:px-8 pt-8 pb-12 overflow-y-auto custom-scrollbar shadow-inner bg-slate-50">
                <div className="max-w-4xl mx-auto pb-20">
                    <ComposeMessage 
                        targetCategory={category}
                        targetId={category === 'CLASS' ? selectedClass?.class_id : (category === 'ROUTE' ? selectedRoute?.route_id : null)}
                        targetLabel={category === 'ALL' ? 'All Registered Parents' : (category === 'CLASS' ? `${selectedClass?.class_name || '...'} - ${selectedClass?.section || '...'}` : (selectedRoute?.name || '...'))}
                    />
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default CommunicationHome;
