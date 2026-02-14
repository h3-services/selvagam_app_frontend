import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faArrowLeft, faCircleNotch, faTrash, faUserGraduate, faFilter, faChevronDown, faGraduationCap, faCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import { parentService } from '../../services/parentService';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import ParentList from './ParentList';
import AddParentForm from './AddParentForm';
import { COLORS } from '../../constants/colors';

const ParentManagementHome = () => {
    const navigate = useNavigate();
    // State
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedParent, setSelectedParent] = useState(null);
    const [classFilter, setClassFilter] = useState("All Classes");
    const [classList, setClassList] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);

    // Actions State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

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

            // Extract unique class names for filter
            const uniqueClasses = [...new Set(classData.map(c => `${c.class_name} - ${c.section}`))].sort();
            setClassList(uniqueClasses);

            // Filter for ACTIVE parents only
            const activeParentsOnly = parentsData.filter(p => !p.parents_active_status || p.parents_active_status === 'ACTIVE');

            // Map students and classes to parents
            const parentsWithStudents = activeParentsOnly.map(parent => {
                const parentChildren = studentsData.filter(student => 
                    student.parent_id === parent.parent_id || 
                    student.s_parent_id === parent.parent_id
                );
                
                const studentNames = parentChildren.map(s => s.name);
                const classNames = parentChildren.map(s => {
                    const studentClass = classData.find(c => c.class_id === s.class_id);
                    return studentClass ? `${studentClass.class_name} - ${studentClass.section}` : null;
                }).filter(Boolean);
                
                return {
                    ...parent,
                    linkedStudents: studentNames.length > 0 ? studentNames : ['No children linked'],
                    childClasses: classNames
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
                    (parent.linkedStudents || []).some(s => (s || "").toLowerCase().includes(lowerQuery))
            );
        }
        
        return result;
    }, [parents, searchQuery, classFilter]);

    const handleAddParent = async (newParentData) => {
        try {
            await parentService.createParent(newParentData);
            await fetchData();
            setShowForm(false);
        } catch (error) {
            console.error("Error adding parent:", error);
            alert("Failed to create parent. Please check your inputs.");
        }
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            try {
                // Set status to INACTIVE instead of deleting
                await parentService.updateParentStatus(itemToDelete, 'INACTIVE');
                // Remove from local state immediately so they vanish from the active list
                setParents(prev => prev.filter(p => p.parent_id !== itemToDelete));
                setItemToDelete(null);
                setShowDeleteConfirm(false);
            } catch (error) {
                console.error("Error deactivating parent:", error);
                alert("Failed to deactivate parent.");
            }
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className='ml-20 lg:ml-0'>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Parent Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage parent accounts and details</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/parents/inactive')}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                        >
                            <FontAwesomeIcon icon={faBan} className="text-slate-400 group-hover:text-blue-500" />
                            View Inactive
                        </button>

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
                                placeholder="Search parents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-72 lg:w-96 bg-blue-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-8 pt-2 pb-8 overflow-hidden flex flex-col">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-xl border border-gray-100">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faCircleNotch} spin className="text-2xl text-blue-600" />
                        </div>
                        <p className="text-gray-500 font-medium">Loading parents...</p>
                    </div>
                ) : (
                    <ParentList 
                        filteredParents={filteredParents} 
                        handleDelete={handleDelete}
                    />
                )}
            </div>

            {/* Floating Add Button */}
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
                    style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                >
                    <FontAwesomeIcon icon={faUserPlus} className="text-xl sm:text-2xl" />
                </button>
            )}

            {/* Add Parent Form Drawer - Placeholder */}
            {showForm && (
                <AddParentForm 
                    show={showForm} 
                    onClose={() => setShowForm(false)} 
                    onAdd={handleAddParent} 
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setShowDeleteConfirm(false)}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl border border-white p-8 w-full max-w-sm animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                                <FontAwesomeIcon icon={faTrash} className="text-2xl text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Deactivate Parent</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                Are you sure you want to deactivate this parent? They will be moved to the <span className="font-bold text-blue-600">Inactive Parents</span> list.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
                                >
                                    Deactivate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParentManagementHome;
