import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faCircleNotch, faCheckCircle, faFilter, faChevronDown, faGraduationCap, faCheck, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import { parentService } from '../../services/parentService';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import ParentList from './ParentList';
import { COLORS } from '../../constants/colors';

const InactiveParentManagement = () => {
    const navigate = useNavigate();
    // State
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState("All Classes");
    const [classList, setClassList] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showActivateConfirm, setShowActivateConfirm] = useState(false);
    const [itemToActivate, setItemToActivate] = useState(null);
    const filterRef = useRef(null);

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    // Close filter when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isFilterOpen && filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [isFilterOpen]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [parentsData, studentsData, classData] = await Promise.all([
                parentService.getAllParents(),
                studentService.getAllStudents(),
                classService.getAllClasses()
            ]);

            // Filter for INACTIVE parents only
            const inactiveParentsOnly = parentsData.filter(p => p.parents_active_status === 'INACTIVE');

            // Extract unique class names for filter
            const uniqueClasses = [...new Set(classData.map(c => `${c.class_name} - ${c.section}`))].sort();
            setClassList(uniqueClasses);

            // Map students and classes to parents
            const parentsWithStudents = inactiveParentsOnly.map(parent => {
                const parentChildren = studentsData.filter(student => 
                    student.parent_id === parent.parent_id || 
                    student.s_parent_id === parent.parent_id
                );
                
                const linkedStudents = parentChildren.map(s => {
                    const studentClass = classData.find(c => c.class_id === s.class_id);
                    return {
                        id: s.student_id,
                        name: s.name,
                        class: studentClass ? `${studentClass.class_name} - ${studentClass.section}` : 'N/A',
                        status: s.status || s.student_status || 'CURRENT',
                        transportStatus: s.transport_status
                    };
                });

                const classNames = parentChildren.map(s => {
                    const studentClass = classData.find(c => c.class_id === s.class_id);
                    return studentClass ? `${studentClass.class_name} - ${studentClass.section}` : null;
                }).filter(Boolean);
                
                return {
                    ...parent,
                    linkedStudents: linkedStudents,
                    childClasses: [...new Set(classNames)]
                };
            });

            setParents(parentsWithStudents);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredParents = useMemo(() => {
        let result = parents;
        
        if (classFilter !== "All Classes") {
            result = result.filter(parent => parent.childClasses && parent.childClasses.includes(classFilter));
        }
        
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(
                (parent) =>
                    (parent.name || "").toLowerCase().includes(lowerQuery) ||
                    String(parent.phone || "").includes(lowerQuery) ||
                    (parent.linkedStudents || []).some(s => {
                        const searchTarget = typeof s === 'object' ? s.name : s;
                        return (searchTarget || "").toLowerCase().includes(lowerQuery);
                    })
            );
        }
        
        return result;
    }, [parents, searchQuery, classFilter]);

    const handleActivate = (id) => {
        setItemToActivate(id);
        setShowActivateConfirm(true);
    };

    const confirmActivate = async () => {
        if (itemToActivate) {
            try {
                await parentService.updateParentStatus(itemToActivate, 'ACTIVE');
                // Remove from local state since this is the "Inactive" view
                setParents(prev => prev.filter(p => p.parent_id !== itemToActivate));
                setItemToActivate(null);
                setShowActivateConfirm(false);
            } catch (error) {
                console.error("Error activating parent:", error);
                alert("Failed to activate parent.");
            }
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className='ml-20 lg:ml-0 flex items-center gap-4'>
                        <button 
                            onClick={() => navigate('/parents')}
                            className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm border border-gray-100"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inactive Parents</h1>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Premium Class Filter Dropdown */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all duration-300 font-bold text-sm ${
                                    isFilterOpen 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-indigo-100' 
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:text-blue-600'
                                }`}
                            >
                                <FontAwesomeIcon icon={faFilter} className={isFilterOpen ? 'text-white' : 'text-indigo-400'} />
                                <span>{classFilter}</span>
                                <FontAwesomeIcon icon={faChevronDown} className={`text-xs transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isFilterOpen && (
                                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Filter by Child's Class</p>
                                    </div>
                                    <button
                                        onClick={() => { setClassFilter("All Classes"); setIsFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between transition-colors ${
                                            classFilter === "All Classes" ? 'bg-blue-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <FontAwesomeIcon icon={faGraduationCap} className="text-xs opacity-50" />
                                            All Classes
                                        </div>
                                        {classFilter === "All Classes" && <FontAwesomeIcon icon={faCheck} className="text-xs" />}
                                    </button>
                                    {classList.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => { setClassFilter(c); setIsFilterOpen(false); }}
                                            className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between transition-colors ${
                                                classFilter === c ? 'bg-blue-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                                {c}
                                            </div>
                                            {classFilter === c && <FontAwesomeIcon icon={faCheck} className="text-xs" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search records..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-64 md:w-80 bg-blue-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-0 lg:px-8 pt-4 pb-4 overflow-hidden flex flex-col w-full">
                <div className="flex-1 flex flex-col min-h-0 lg:bg-white lg:rounded-[2.5rem] lg:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] lg:border lg:border-white lg:px-6 lg:pt-2 lg:pb-3 overflow-hidden">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-2xl text-blue-600" />
                            </div>
                            <p className="text-gray-500 font-medium tracking-wide">Syncing Archive...</p>
                        </div>
                    ) : (
                        <ParentList 
                            filteredParents={filteredParents} 
                            handleDelete={handleActivate}
                            isInactiveView={true}
                        />
                    )}
                </div>
            </div>

            {/* Activate Confirmation Modal */}
            {showActivateConfirm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setShowActivateConfirm(false)}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl border border-white p-8 w-full max-w-sm animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                                <FontAwesomeIcon icon={faUserCheck} className="text-2xl text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Activate Parent</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                Are you sure you want to set this parent as Active?
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowActivateConfirm(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmActivate}
                                    className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                                >
                                    Activate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InactiveParentManagement;
