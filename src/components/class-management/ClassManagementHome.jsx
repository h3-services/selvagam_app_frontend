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

    useEffect(() => {
        fetchClasses();
    }, []);

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

    const filteredClasses = useMemo(() => {
        let result = classes;
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(
                (c) =>
                    c.class_name.toLowerCase().includes(lowerQuery) ||
                    (c.section || "").toLowerCase().includes(lowerQuery) ||
                    String(c.academic_year).includes(lowerQuery)
            );
        }
        return result;
    }, [classes, searchQuery]);

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className='ml-20 lg:ml-0'>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            <FontAwesomeIcon icon={faShapes} className="text-indigo-600 text-xl" />
                            Class Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Manage academic classes, sections, and student promotion</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowPromoteModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
                        >
                            <FontAwesomeIcon icon={faArrowTrendUp} className="text-indigo-400 group-hover:text-indigo-500" />
                            Promote Students
                        </button>

                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search classes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-64 lg:w-80 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-8 pt-8 pb-8 overflow-y-auto custom-scrollbar">
                <div className="max-w-[1600px] mx-auto">
                    {loading ? (
                        <div className="h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl shadow-xl border border-slate-50">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-2xl text-indigo-600" />
                            </div>
                            <p className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Loading Class Structure...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-indigo-100">
                                        {classes.length} Total Hubs
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-emerald-100 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        System Synced
                                    </div>
                                </div>
                            </div>
                            
                            <ClassList 
                                classes={filteredClasses} 
                                onRefresh={fetchClasses} 
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setShowAddModal(true)}
                className="fixed bottom-8 right-8 w-16 h-16 text-white rounded-full shadow-2xl hover:shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center z-40 transform hover:-translate-y-1"
                style={{ backgroundColor: COLORS.SIDEBAR_BG }}
            >
                <FontAwesomeIcon icon={faPlus} className="text-2xl" />
            </button>

            <AddClassForm show={showAddModal} onClose={() => setShowAddModal(false)} onAdd={fetchClasses} />
            <PromoteStudentsModal show={showPromoteModal} onClose={() => setShowPromoteModal(false)} onRefresh={fetchClasses} />
        </div>
    );
};

export default ClassManagementHome;
