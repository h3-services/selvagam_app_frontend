import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faArrowLeft, faCircleNotch, faTrash, faUserGraduate, faFilter, faChevronDown, faGraduationCap, faCheck, faBan, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import { parentService } from '../../services/parentService';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import ParentList from './ParentList';
import AddParentForm from './AddParentForm';
import ParentDetail from './ParentDetail';
import LinkStudentModal from './LinkStudentModal';
import { COLORS } from '../../constants/colors';

const ParentManagementHome = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { parentId, status: statusSlug } = useParams();

    const statusSlugMap = useMemo(() => ({
        'active': 'Active',
        'archive': 'Archive'
    }), []);

    const [activeTab, setActiveTab] = useState("Active");

    // Sync activeTab with URL status parameter
    useEffect(() => {
        if (statusSlug && statusSlugMap[statusSlug]) {
            setActiveTab(statusSlugMap[statusSlug]);
        } else if (!statusSlug && location.pathname === '/parents') {
            setActiveTab('Active');
        }
    }, [statusSlug, location.pathname, statusSlugMap]);

    const handleTabChange = (tabKey) => {
        const slugMap = {
            'Active': 'active',
            'Archive': 'archive'
        };
        const slug = slugMap[tabKey] || 'active';
        navigate(`/parents/view/${slug}`);
    };

    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || "";

    const handleSearchChange = (value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) newParams.set('search', value);
        else newParams.delete('search');
        setSearchParams(newParams);
    };
    const [showForm, setShowForm] = useState(false);
    const [selectedParent, setSelectedParent] = useState(null);
    const [editingParent, setEditingParent] = useState(null);
    const [showLinkModal, setShowLinkModal] = useState(false);

    // Actions State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showBulkMenu, setShowBulkMenu] = useState(false);

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    // Sync state with URL
    useEffect(() => {
        if (!loading && parents.length > 0) {
            if (parentId) {
                const parent = parents.find(p => p.parent_id === parentId);
                if (parent) {
                    setSelectedParent(parent);
                    
                    // Handle modals/forms within detail view
                    if (location.pathname.endsWith('/edit')) {
                        setEditingParent(parent);
                        setShowForm(true);
                        setShowLinkModal(false);
                    } else if (location.pathname.endsWith('/link')) {
                        setShowLinkModal(true);
                        setShowForm(false);
                        setEditingParent(null);
                    } else {
                        setShowForm(false);
                        setShowLinkModal(false);
                        setEditingParent(null);
                    }
                }
            } else {
                setSelectedParent(null);
                
                // Handle global forms
                if (location.pathname === '/parents/add') {
                    setShowForm(true);
                    setEditingParent(null);
                } else {
                    setShowForm(false);
                    setEditingParent(null);
                }
                setShowLinkModal(false);
            }
        }
    }, [location.pathname, parentId, loading, parents]);



    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch data with individual error handling to prevent 500s from blocking the whole view
            const [parentsData, studentsData, classData] = await Promise.all([
                parentService.getAllParents({ active_filter: 'ACTIVE_ONLY' }).catch(err => {
                    console.error("Error fetching parents:", err);
                    return [];
                }),
                studentService.getAllStudents().catch(err => {
                    console.error("Error fetching students:", err);
                    return [];
                }),
                classService.getAllClasses().catch(err => {
                    console.error("Error fetching classes:", err);
                    return [];
                })
            ]);

            // Map students and classes to parents
            const parentsWithStudents = parentsData.map(parent => {
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
                        transportStatus: s.transport_status,
                        dob: s.dob,
                        gender: s.gender || 'NOT PROVIDED',
                        studyYear: s.study_year || 'N/A'
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
        
        if (activeTab === "Active") {
            result = result.filter(p => !p.parents_active_status || p.parents_active_status === 'ACTIVE');
        } else if (activeTab === "Archive") {
            result = result.filter(p => p.parents_active_status && p.parents_active_status !== 'ACTIVE');
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
    }, [parents, searchQuery, activeTab]);

    const handleAddParent = async (newParentData) => {
        try {
            await parentService.createParent(newParentData);
            await fetchData();
            setShowForm(false);
        } catch (error) {
            console.error("Error adding parent:", error);
            let errorMessage = "Failed to create parent profile. Please verify registry protocols.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            alert(errorMessage);
        }
    };

    const handleUpdateParent = async (parentId, parentData) => {
        try {
            setLoading(true);
            await parentService.updateParent(parentId, parentData);
            await fetchData();
            setShowForm(false);
            setEditingParent(null);
        } catch (error) {
            console.error("Error updating parent:", error);
            alert("Failed to update parent profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditParent = (parent) => {
        navigate(`/parents/${parent.parent_id}/edit`);
    };

    const handleLinkStudent = (parent) => {
        navigate(`/parents/${parent.parent_id}/detail/link`);
    };

    const handleBulkStatusUpdate = async (newStatus) => {
        if (!selectedRows.length) return;
        setLoading(true);
        try {
            await Promise.all(selectedRows.map(parent => 
                parentService.updateParentStatus(parent.parent_id, newStatus)
            ));
            setShowBulkMenu(false);
            setSelectedRows([]);
            await fetchData();
        } catch (error) {
            console.error("Bulk status update failed:", error);
            alert("Some updates failed. Please refresh and try again.");
        } finally {
            setLoading(false);
        }
    };

    const [statusToSet, setStatusToSet] = useState('INACTIVE');

    const handleStatusChangeRequest = (id, targetStatus = 'INACTIVE') => {
        setItemToDelete(id);
        setStatusToSet(targetStatus);
        setShowDeleteConfirm(true);
    };

    const confirmStatusChange = async () => {
        if (itemToDelete) {
            try {
                setLoading(true);
                await parentService.updateParentStatus(itemToDelete, statusToSet);
                
                // Update local state immediately
                setParents(prev => prev.map(p => 
                    p.parent_id === itemToDelete 
                    ? { ...p, parents_active_status: statusToSet } 
                    : p
                ));
                
                setItemToDelete(null);
                setShowDeleteConfirm(false);
                
                // Refresh data to be safe
                await fetchData();
            } catch (error) {
                console.error(`Error changing parent status to ${statusToSet}:`, error);
                alert(`Failed to ${statusToSet === 'ACTIVE' ? 'activate' : 'deactivate'} parent.`);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            {!selectedParent && (
                <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 sticky top-0 z-30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className='ml-14 lg:ml-0'>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Parent Management
                            </h1>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* View Mode Toggle (Segmented Control) */}
                            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
                                <button
                                    onClick={() => handleTabChange('Active')}
                                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                                        activeTab === 'Active' 
                                        ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' 
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Active Parents
                                </button>
                                <button
                                    onClick={() => handleTabChange('Archive')}
                                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                                        activeTab === 'Archive' 
                                        ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' 
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Archived Records
                                </button>
                            </div>
                            
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search parents..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 w-full md:w-80 bg-blue-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                                />
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 px-2 lg:px-8 pt-4 pb-4 overflow-hidden flex flex-col w-full">
                <div className="flex-1 flex flex-col min-h-0 lg:bg-white lg:rounded-[2.5rem] lg:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] lg:border lg:border-white lg:px-6 lg:pt-2 lg:pb-3 overflow-hidden">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-16 h-16 rounded-[24px] bg-blue-50 flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-2xl text-blue-600" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading...</p>
                        </div>
                    ) : selectedParent ? (
                        <ParentDetail 
                            selectedParent={selectedParent}
                            onBack={() => navigate('/parents')}
                            onDelete={(id) => handleStatusChangeRequest(id, 'INACTIVE')}
                            onUpdate={() => fetchData()}
                            onEdit={handleEditParent}
                            onLink={() => navigate(`/parents/${selectedParent.parent_id}/detail/link`)}
                        />
                    ) : (
                        <ParentList 
                            filteredParents={filteredParents} 
                            handleDelete={(id) => handleStatusChangeRequest(id, activeTab === 'Active' ? 'INACTIVE' : 'ACTIVE')}
                            isInactiveView={activeTab === 'Archive'}
                            onSelectionChanged={setSelectedRows}
                            onViewParent={(p) => navigate(`/parents/${p.parent_id}/detail`)}
                        />
                    )}
                </div>
            </div>

            {/* Bulk Actions Floating Pill */}
            {selectedRows.length > 0 && !selectedParent && (
                <>
                    {showBulkMenu && (
                        <div 
                            className="fixed inset-0 bg-slate-900/10 backdrop-blur-md z-[2001] animate-in fade-in duration-500"
                            onClick={() => setShowBulkMenu(false)}
                        />
                    )}
                    
                    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[2002] flex flex-col items-center gap-4">
                    {showBulkMenu && (
                        <div className="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-2 w-64 animate-in slide-in-from-bottom-8 zoom-in duration-300 origin-bottom">
                            <div className="px-4 py-3 text-[11px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 flex items-center justify-between mb-2">
                                <span>Bulk Operations</span>
                                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[9px] shadow-sm">
                                    {selectedRows.length} Selected
                                </span>
                            </div>
                            <div className="space-y-1 p-1">
                                {activeTab === 'Archive' && (
                                    <button 
                                        onClick={() => handleBulkStatusUpdate('ACTIVE')}
                                        className="w-full flex items-center gap-3 px-3 py-3 text-[11px] font-black text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all group uppercase tracking-widest"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <FontAwesomeIcon icon={faCheck} className="text-sm text-emerald-500" />
                                        </div>
                                        Activate Selected
                                    </button>
                                )}
                                {activeTab === 'Active' && (
                                    <button 
                                        onClick={() => handleBulkStatusUpdate('INACTIVE')}
                                        className="w-full flex items-center gap-3 px-3 py-3 text-[11px] font-black text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-all group uppercase tracking-widest"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <FontAwesomeIcon icon={faBan} className="text-sm text-amber-500" />
                                        </div>
                                        Archive Selected
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={() => setShowBulkMenu(!showBulkMenu)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.15)] transition-all active:scale-95 group border-2 ${
                            showBulkMenu 
                            ? 'bg-slate-900 border-slate-700 text-white' 
                            : 'bg-white border-white text-blue-600 hover:shadow-[0_20px_45px_rgba(0,0,0,0.2)]'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            showBulkMenu ? 'bg-white/10' : 'bg-blue-600 text-white'
                        }`}>
                            <FontAwesomeIcon icon={showBulkMenu ? faCheck : faUsers} className="text-xs" />
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${showBulkMenu ? 'text-slate-400' : 'text-blue-500'}`}>
                                {selectedRows.length} Parents Selected
                            </span>
                            <span className={`text-[13px] font-bold mt-0.5 ${showBulkMenu ? 'text-white' : 'text-slate-900'}`}>
                                {showBulkMenu ? 'Close Menu' : 'Actions for Selected'}
                            </span>
                        </div>
                        <FontAwesomeIcon 
                            icon={faChevronDown} 
                            className={`text-[10px] transition-transform duration-300 ml-2 ${showBulkMenu ? 'rotate-180 text-slate-400' : 'text-blue-300'}`} 
                        />
                    </button>
                    </div>
                </>
            )}

            {/* Floating Add Button */}
            {!showForm && !showBulkMenu && (
                <button
                    onClick={() => navigate('/parents/add')}
                    className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-[24px] shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center z-40"
                    style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                >
                    <FontAwesomeIcon icon={faUserPlus} className="text-xl sm:text-2xl" />
                </button>
            )}

            {/* Add Parent Form Drawer */}
            <AddParentForm 
                show={showForm} 
                onClose={() => {
                    const backPath = selectedParent ? `/parents/${selectedParent.parent_id}/detail` : '/parents';
                    navigate(backPath);
                }} 
                onAdd={handleAddParent} 
                onUpdate={handleUpdateParent}
                initialData={editingParent}
            />

            {/* Link Student Modal */}
            <LinkStudentModal
                show={showLinkModal}
                onClose={() => navigate(`/parents/${selectedParent.parent_id}/detail`)}
                parent={selectedParent}
                onRefresh={fetchData}
            />

            {/* Status Change Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setShowDeleteConfirm(false)}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl border border-white p-8 w-full max-w-sm animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${statusToSet === 'ACTIVE' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                <FontAwesomeIcon 
                                    icon={statusToSet === 'ACTIVE' ? faCheck : faTrash} 
                                    className={`text-2xl ${statusToSet === 'ACTIVE' ? 'text-emerald-600' : 'text-red-600'}`} 
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {statusToSet === 'ACTIVE' ? 'Activate Parent' : 'Deactivate Parent'}
                            </h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                {statusToSet === 'ACTIVE' 
                                    ? 'Are you sure you want to restore this parent profile to the active list?' 
                                    : 'Are you sure you want to deactivate this parent? They will be moved to the Archived Records list.'}
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all active:scale-95 uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmStatusChange}
                                    className={`flex-1 px-4 py-3 rounded-xl text-white font-bold text-sm shadow-lg transition-all active:scale-95 uppercase tracking-widest ${
                                        statusToSet === 'ACTIVE' 
                                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
                                            : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                                    }`}
                                >
                                    {statusToSet === 'ACTIVE' ? 'Activate' : 'Deactivate'}
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
