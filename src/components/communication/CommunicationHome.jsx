import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroadcastTower, faUsers, faGraduationCap, faRoute, faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import ComposeMessage from './ComposeMessage';
import { classService } from '../../services/classService';
import { routeService } from '../../services/routeService';

const CommunicationHome = () => {
    const navigate = useNavigate();
    const { category: categorySlug } = useParams();
    const location = useLocation();

    const categorySlugMap = useMemo(() => ({
        'all': 'ALL',
        'class': 'CLASS',
        'route': 'ROUTE',
        'location': 'LOCATION'
    }), []);

    const [category, setCategory] = useState('ALL'); // 'ALL' | 'CLASS' | 'ROUTE' | 'LOCATION'

    // Sync category with URL parameter
    useEffect(() => {
        if (categorySlug && categorySlugMap[categorySlug]) {
            setCategory(categorySlugMap[categorySlug]);
        } else if (!categorySlug && location.pathname === '/communication') {
            setCategory('ALL');
        }
    }, [categorySlug, location.pathname, categorySlugMap]);

    const handleCategoryChange = (cat) => {
        const slug = cat.toLowerCase();
        navigate(`/communication/view/${slug}`);
    };

    const [classes, setClasses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedRoutes, setSelectedRoutes] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classRes, routeRes, stopRes] = await Promise.all([
                    classService.getAllClasses(),
                    routeService.getAllRoutes(),
                    routeService.getAllRouteStops()
                ]);
                
                const activeClasses = (classRes || []).filter(c => (c.status || '').toUpperCase() === 'ACTIVE');
                const activeRoutes = (routeRes || []).filter(r => (r.routes_active_status || r.status || '').toUpperCase() === 'ACTIVE');
                
                // Extract unique location names from stops
                const uniqueLocations = [...new Set((stopRes || [])
                    .map(s => s.location)
                    .filter(loc => !!loc && loc.trim() !== "")
                )].sort();

                setClasses(activeClasses);
                setRoutes(activeRoutes);
                setLocations(uniqueLocations);
            } catch (error) {
                console.error("Failed to fetch categorized data:", error);
            }
        };
        fetchData();
    }, []);


    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-30">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 max-w-7xl mx-auto w-full">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                            Communication Hub
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Announcement Control</p>
                    </div>

                    <div className="flex flex-row items-center gap-2 sm:gap-3 flex-1 w-full sm:max-w-2xl px-2">
                        <CategoryButton id="ALL" label="Parents" icon={faUsers} current={category} onClick={() => { handleCategoryChange('ALL'); setShowDropdown(false); }} />
                        <CategoryButton id="CLASS" label="Class" icon={faGraduationCap} current={category} onClick={() => { handleCategoryChange('CLASS'); setShowDropdown(false); }} />
                        <CategoryButton id="ROUTE" label="Route" icon={faRoute} current={category} onClick={() => { handleCategoryChange('ROUTE'); setShowDropdown(false); }} />
                        <CategoryButton id="LOCATION" label="Location" icon={faUsers} current={category} onClick={() => { handleCategoryChange('LOCATION'); setShowDropdown(false); }} />
                    </div>
                </div>
            </div>

            {/* Sub-Selector Section */}
            {(category === 'CLASS' || category === 'ROUTE' || category === 'LOCATION') && (
                <div className="bg-white/50 backdrop-blur-md border-b border-slate-200 p-4 animate-in slide-in-from-top-4 duration-300 z-20">
                    <div className="max-w-xl mx-auto relative px-4 sm:px-0">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="w-full bg-white border-2 border-slate-200 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-slate-900 font-black text-xs sm:text-sm hover:border-blue-400 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <FontAwesomeIcon icon={category === 'CLASS' ? faGraduationCap : (category === 'ROUTE' ? faRoute : faUsers)} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                        Select {category === 'CLASS' ? 'Standards' : (category === 'ROUTE' ? 'Travel Routes' : 'Grouping Locations')}
                                    </p>
                                    <p className="truncate max-w-[200px] sm:max-w-none">
                                        {category === 'CLASS' 
                                            ? (selectedClasses.length > 0 ? `${selectedClasses.length} Classes Selected` : 'Choose Classes...') 
                                            : (category === 'ROUTE' 
                                                ? (selectedRoutes.length > 0 ? `${selectedRoutes.length} Routes Selected` : 'Choose Routes...')
                                                : (selectedLocations.length > 0 ? `${selectedLocations.length} Locations Selected` : 'Choose Locations...'))}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {((category === 'CLASS' && selectedClasses.length > 0) || (category === 'ROUTE' && selectedRoutes.length > 0) || (category === 'LOCATION' && selectedLocations.length > 0)) && (
                                    <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full animate-bounce">
                                        {category === 'CLASS' ? selectedClasses.length : (category === 'ROUTE' ? selectedRoutes.length : selectedLocations.length)}
                                    </span>
                                )}
                                <FontAwesomeIcon icon={faChevronDown} className={`text-slate-300 transition-transform duration-300 ${showDropdown ? 'rotate-180 text-blue-500' : ''}`} />
                            </div>
                        </button>

                        {showDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-slate-100 z-[100] overflow-hidden animate-in zoom-in-95 duration-200 p-2">
                                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-2">
                                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Multi-Select Enabled</span>
                                    <button 
                                        onClick={() => {
                                            if (category === 'CLASS') setSelectedClasses([]);
                                            else if (category === 'ROUTE') setSelectedRoutes([]);
                                            else setSelectedLocations([]);
                                        }}
                                        className="text-[10px] font-black text-rose-500 tracking-tight hover:underline"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-1 p-1">
                                    {category === 'CLASS' ? (
                                        classes.map((cls) => {
                                            const isSelected = selectedClasses.some(c => c.class_id === cls.class_id);
                                            return (
                                                <button
                                                    key={cls.class_id}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedClasses(prev => prev.filter(c => c.class_id !== cls.class_id));
                                                        } else {
                                                            setSelectedClasses(prev => [...prev, cls]);
                                                        }
                                                    }}
                                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black text-left transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
                                                >
                                                    <span>{cls.class_name} - {cls.section}</span>
                                                    {isSelected && <FontAwesomeIcon icon={faCheck} className="text-blue-400" />}
                                                </button>
                                            );
                                        })
                                    ) : category === 'ROUTE' ? (
                                        routes.map((route) => {
                                            const isSelected = selectedRoutes.some(r => r.route_id === route.route_id);
                                            return (
                                                <button
                                                    key={route.route_id}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedRoutes(prev => prev.filter(r => r.route_id !== route.route_id));
                                                        } else {
                                                            setSelectedRoutes(prev => [...prev, route]);
                                                        }
                                                    }}
                                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black text-left transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
                                                >
                                                    <span>{route.name}</span>
                                                    {isSelected && <FontAwesomeIcon icon={faCheck} className="text-blue-400" />}
                                                </button>
                                            );
                                        })
                                    ) : (
                                        locations.map((loc) => {
                                            const isSelected = selectedLocations.includes(loc);
                                            return (
                                                <button
                                                    key={loc}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedLocations(prev => prev.filter(l => l !== loc));
                                                        } else {
                                                            setSelectedLocations(prev => [...prev, loc]);
                                                        }
                                                    }}
                                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black text-left transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
                                                >
                                                    <span>{loc}</span>
                                                    {isSelected && <FontAwesomeIcon icon={faCheck} className="text-blue-400" />}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                                <div className="p-2 mt-2 border-t border-slate-100">
                                    <button 
                                        onClick={() => setShowDropdown(false)}
                                        className="w-full bg-indigo-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-indigo-700 transition-all"
                                    >
                                        Apply Selection
                                    </button>
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
                        targetIds={category === 'CLASS' ? selectedClasses.map(c => c.class_id) : (category === 'ROUTE' ? selectedRoutes.map(r => r.route_id) : (category === 'LOCATION' ? selectedLocations : []))}
                        targetLabel={category === 'ALL' ? 'All Registered Parents' : (category === 'CLASS' ? (selectedClasses.length > 0 ? `${selectedClasses.length} Classes` : 'None') : (category === 'ROUTE' ? (selectedRoutes.length > 0 ? `${selectedRoutes.length} Routes` : 'None') : (selectedLocations.length > 0 ? `${selectedLocations.length} Locations` : 'None')))}
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

const CategoryButton = ({ id, label, icon, current, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-3 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl border transition-all font-black text-[8px] sm:text-[11px] uppercase tracking-wider sm:tracking-[0.2em] relative overflow-hidden group
            ${current === id 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg sm:shadow-xl shadow-indigo-100' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 shadow-sm'}`}
    >
        <FontAwesomeIcon icon={icon} className={`${current === id ? 'text-blue-400' : 'text-slate-300 group-hover:text-blue-400'}`} />
        {label}
        {current === id && (
            <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-bl-xl rotate-12 translate-x-1 -translate-y-1">
                <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
            </div>
        )}
    </button>
);

export default CommunicationHome;
