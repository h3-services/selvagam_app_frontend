import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faPlus, 
    faCircleNotch, 
    faSchool, 
    faUsers, 
    faCalendarAlt,
    faArrowTrendUp,
    faShapes,
    faLayerGroup,
    faChartPie
} from '@fortawesome/free-solid-svg-icons';
import { classService } from '../../services/classService';
import ClassList from './ClassList';
import AddClassForm from './AddClassForm';
import PromoteStudentsModal from './PromoteStudentsModal';
import { COLORS } from '../../constants/colors';
const ClassManagementHome = () => {
    const navigate = useNavigate();
    const { classId } = useParams();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Derived States
    const isAddPath = location.pathname === '/classes/add';
    const isEditPath = !!classId && location.pathname.endsWith('/edit');
    const isPromotePath = location.pathname === '/classes/promote';
    const searchQuery = searchParams.get('search') || "";

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [editingClass, setEditingClass] = useState(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    // Synchronize editingClass when URL changes
    useEffect(() => {
        if (isEditPath && classId && classes.length > 0) {
            const cls = classes.find(c => c.class_id === classId);
            if (cls) {
                setEditingClass(cls);
            }
        } else if (!isEditPath) {
            setEditingClass(null);
        }
    }, [isEditPath, classId, classes]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isActionMenuClick = event.target.closest('.action-menu-container');
            const isActionMenuTrigger = event.target.closest('.action-menu-trigger');

            if (!isActionMenuClick && !isActionMenuTrigger) {
                if (activeMenuId) setActiveMenuId(null);
            }
        };
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenuId]);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const data = await classService.getAllClasses();
            setClasses(data || []);
        } catch (error) {
            console.error("Failed to fetch classes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (classId, newStatus) => {
        try {
            await classService.updateClassStatus(classId, newStatus);
            fetchClasses();
        } catch (error) {
            console.error("Failed to update class status:", error);
        }
    };

    const handleEditClass = (classData) => {
        navigate(`/classes/${classData.class_id}/edit`);
    };

    const handleSearchChange = (value) => {
        if (value) {
            setSearchParams({ search: value });
        } else {
            setSearchParams({});
        }
    };

    const filteredClasses = useMemo(() => {
        let result = classes;
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter((c) => {
                const fullId = `${c.class_name}-${c.section}`.toLowerCase();
                const reverseId = `${c.class_name}${c.section}`.toLowerCase();
                return (
                    c.class_name.toLowerCase().includes(lowerQuery) ||
                    (c.section || "").toLowerCase().includes(lowerQuery) ||
                    fullId.includes(lowerQuery) ||
                    reverseId.includes(lowerQuery)
                );
            });
        }
        return result;
    }, [classes, searchQuery]);

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className='ml-14 lg:ml-0'>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Class Management
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <button 
                            onClick={() => navigate('/classes/promote')}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-xs hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm order-2 md:order-1"
                        >
                            <FontAwesomeIcon icon={faArrowTrendUp} className="text-indigo-400 group-hover:text-blue-500" />
                            <span>PROMOTE STUDENTS</span>
                        </button>

                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search classes..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-full md:w-80 bg-blue-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-2 lg:px-8 pt-4 pb-4 flex flex-col min-h-0 overflow-hidden w-full">
                <div className="flex-1 flex flex-col min-h-0 lg:bg-white lg:rounded-[2.5rem] lg:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] lg:border lg:border-white lg:px-6 lg:pt-2 lg:pb-3 overflow-hidden">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-2xl text-blue-600" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading...</p>
                        </div>
                    ) : (
                        <ClassList 
                            classes={filteredClasses} 
                            activeMenuId={activeMenuId}
                            setActiveMenuId={setActiveMenuId}
                            onUpdateStatus={handleUpdateStatus}
                            onEditClass={handleEditClass}
                        />
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => navigate('/classes/add')}
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-2xl hover:shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center z-40 transform hover:-translate-y-1"
                style={{ backgroundColor: COLORS.SIDEBAR_BG }}
            >
                <FontAwesomeIcon icon={faPlus} className="text-xl sm:text-2xl" />
            </button>

            <AddClassForm 
                show={isAddPath || isEditPath} 
                onClose={() => navigate('/classes')} 
                onAdd={fetchClasses}
                onUpdate={fetchClasses}
                initialData={editingClass}
            />
            <PromoteStudentsModal 
                show={isPromotePath} 
                onClose={() => navigate('/classes')} 
                onRefresh={fetchClasses} 
            />
        </div>
    );
};

export default ClassManagementHome;
