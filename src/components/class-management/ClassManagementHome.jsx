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
                    c.section.toLowerCase().includes(lowerQuery) ||
                    String(c.academic_year).includes(lowerQuery)
            );
        }
        return result;
    }, [classes, searchQuery]);

    const stats = useMemo(() => ({
        total: classes.length,
        active: classes.filter(c => c.status === 'ACTIVE').length,
        inactive: classes.filter(c => c.status === 'INACTIVE').length,
    }), [classes]);

    return (
        <div className="h-full flex flex-col bg-[#F8FAFC] relative animate-fade-in overflow-hidden">
            {/* Header - Glassmorphic Modern Sidebar Navigation Style */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-gray-100/50 px-10 py-6 sticky top-0 z-30">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 max-w-[1700px] mx-auto">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-[22px] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50">
                                <FontAwesomeIcon icon={faShapes} className="text-xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                                    Structure <span className="text-indigo-600">Sync</span>
                                </h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 opacity-70">Academic Hierarchy Management</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Locate class..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-slate-100/50 border border-slate-200/50 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-slate-400"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        </div>
                        
                        <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden lg:block"></div>

                        <button 
                            className="bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider border border-slate-200 shadow-sm transition-all active:scale-95 flex items-center gap-3"
                            onClick={() => setShowPromoteModal(true)}
                        >
                            <FontAwesomeIcon icon={faArrowTrendUp} className="text-indigo-500" /> Promote
                        </button>

                        <button 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-3"
                            onClick={() => setShowAddModal(true)}
                        >
                            <FontAwesomeIcon icon={faPlus} /> New Class
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
                <div className="max-w-[1700px] mx-auto space-y-10">
                    
                    {/* Abstract Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-7 rounded-[35px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-indigo-200 transition-all duration-500">
                            <div className="w-16 h-16 rounded-[24px] bg-indigo-50 flex items-center justify-center text-indigo-500 text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                <FontAwesomeIcon icon={faSchool} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Hubs</p>
                                <p className="text-3xl font-bold text-slate-900 leading-none">{stats.total}</p>
                            </div>
                        </div>
                        <div className="bg-white p-7 rounded-[35px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-blue-200 transition-all duration-500">
                            <div className="w-16 h-16 rounded-[24px] bg-blue-50 flex items-center justify-center text-blue-500 text-2xl group-hover:scale-110 transition-all duration-500">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Session</p>
                                <p className="text-2xl font-bold text-slate-900 leading-none">25-26 FY</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                System Synchronized
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-[400px] flex flex-col items-center justify-center bg-white rounded-[45px] border border-slate-100 shadow-sm border-dashed">
                                <div className="w-20 h-20 rounded-full border-4 border-indigo-50 border-t-indigo-500 animate-spin mb-6"></div>
                                <p className="text-slate-400 font-black uppercase tracking-[3px] text-xs">Calibrating Hubs...</p>
                            </div>
                        ) : (
                            <ClassList 
                                classes={filteredClasses} 
                                onRefresh={fetchClasses} 
                            />
                        )}
                    </div>
                </div>
            </div>

            <AddClassForm show={showAddModal} onClose={() => setShowAddModal(false)} onAdd={fetchClasses} />
            <PromoteStudentsModal show={showPromoteModal} onClose={() => setShowPromoteModal(false)} onRefresh={fetchClasses} />
        </div>
    );
};

export default ClassManagementHome;
