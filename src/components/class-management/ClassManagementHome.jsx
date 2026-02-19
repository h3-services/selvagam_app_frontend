import { useState, useEffect, useMemo } from 'react';
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
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPromoteModal, setShowPromoteModal] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [editingClass, setEditingClass] = useState(null);

    useEffect(() => {
        fetchClasses();
    }, []);

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
        setEditingClass(classData);
        setShowAddModal(true);
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
        <div className="h-full flex flex-col bg-[#f1f5f9] relative animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-0 py-4 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 lg:px-0">
                    <div className='ml-20 lg:ml-0'>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            <FontAwesomeIcon icon={faShapes} className="text-blue-600 text-xl" />
                            Class Management
                        </h1>
                        <p className="hidden sm:block text-sm text-gray-500 mt-1">Manage academic classes, sections, and student promotion</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <button 
                            onClick={() => setShowPromoteModal(true)}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm order-2 md:order-1"
                        >
                            <FontAwesomeIcon icon={faArrowTrendUp} className="text-indigo-400 group-hover:text-blue-500" />
                            <span>Promote Students</span>
                        </button>

                        <div className="relative group w-full md:w-auto order-1 md:order-2">
                            <input
                                type="text"
                                placeholder="Search classes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-full md:w-64 lg:w-80 bg-blue-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-0 pt-2 pb-8 flex flex-col min-h-0 overflow-hidden w-full">
                <div className="flex-1 flex flex-col min-h-0">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-none lg:rounded-3xl shadow-none lg:shadow-xl border-0 lg:border border-slate-50">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-2xl text-blue-600" />
                            </div>
                            <p className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Loading Class Structure...</p>
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
                onClick={() => {
                    setEditingClass(null);
                    setShowAddModal(true);
                }}
                className="fixed bottom-8 right-8 w-16 h-16 text-white rounded-full shadow-2xl hover:shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center z-40 transform hover:-translate-y-1"
                style={{ backgroundColor: COLORS.SIDEBAR_BG }}
            >
                <FontAwesomeIcon icon={faPlus} className="text-2xl" />
            </button>

            <AddClassForm 
                show={showAddModal} 
                onClose={() => {
                    setShowAddModal(false);
                    setEditingClass(null);
                }} 
                onAdd={fetchClasses}
                onUpdate={fetchClasses}
                initialData={editingClass}
            />
            <PromoteStudentsModal show={showPromoteModal} onClose={() => setShowPromoteModal(false)} onRefresh={fetchClasses} />
        </div>
    );
};

export default ClassManagementHome;
