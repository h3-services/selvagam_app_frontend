import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClock, faUserPlus, faArrowLeft, faCircleNotch, faUser, faFilter, faChevronDown, faGraduationCap, faCheck, faArchive, faUsers, faBus, faWalking, faUserCheck, faUserSlash, faUserTie, faBan } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import { COLORS } from '../../constants/colors';
import StudentList from './StudentList';
import StudentDetail from './StudentDetail';
import AddStudentForm from './AddStudentForm';
import { studentService } from '../../services/studentService';
import { parentService } from '../../services/parentService';
import { classService } from '../../services/classService';

const StudentManagementHome = () => {
    const navigate = useNavigate();
    // State
    const [students, setStudents] = useState([]);
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [activeTab, setActiveTab] = useState("Active");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    const moreDropdownRef = useRef(null);

    // Actions State
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [deactivatingItemId, setDeactivatingItemId] = useState(null);
    const [deactivationReason, setDeactivationReason] = useState("");
    const [showParentStatusModal, setShowParentStatusModal] = useState(false);
    const [pendingStudentStatusUpdate, setPendingStudentStatusUpdate] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showBulkMenu, setShowBulkMenu] = useState(false);
    const [showBulkParentStatusModal, setShowBulkParentStatusModal] = useState(false);
    const [pendingBulkUpdate, setPendingBulkUpdate] = useState(null);
    const [bulkParentSelection, setBulkParentSelection] = useState([]);

    // Fetch students when tab changes
    useEffect(() => {
        fetchAllData();
    }, [activeTab]);

    // Map tab to API filter params
    const getFiltersForTab = (tab) => {
        switch (tab) {
            case 'Active':
                return { active_filter: 'ACTIVE_ONLY' };
            case 'LongAbsent':
                return { student_status: 'LONG_ABSENT' };
            case 'NonBusUsers':
                return { transport_status: 'INACTIVE' };
            case 'Discontinue':
                return { student_status: 'DISCONTINUED' };
            case 'Alumni':
                return { student_status: 'ALUMNI' };
            default:
                return {};
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const filters = getFiltersForTab(activeTab);
            const [studentData, parentData, classData] = await Promise.all([
                studentService.getAllStudents(filters).catch(err => {
                    console.error("Error fetching students:", err);
                    return [];
                }),
                parentService.getAllParents().catch(err => {
                    console.error("Error fetching parents:", err);
                    return [];
                }),
                classService.getAllClasses().catch(err => {
                    console.error("Error fetching classes:", err);
                    return [];
                })
            ]);
            
            setParents(parentData);

            // Map API data to UI structure, linking parents and classes
            const mappedStudents = studentData.map(s => {
                const parent1 = parentData.find(p => p.parent_id === s.parent_id);
                const parent2 = s.s_parent_id ? parentData.find(p => p.parent_id === s.s_parent_id) : null;
                const studentClass = classData.find(c => c.class_id === s.class_id);
                
                return {
                    id: s.student_id,
                    name: s.name,
                    className: studentClass ? `${studentClass.class_name} - ${studentClass.section}` : 'N/A',
                    primaryParent: parent1 ? parent1.name : (s.parent_id || 'Unknown'),
                    parent1Name: parent1 ? parent1.name : (s.parent_id || 'Unknown'),
                    parent2Name: parent2 ? parent2.name : '',
                    parentEmail: parent1 ? parent1.email : 'N/A',
                    mobile: parent1 ? parent1.phone : (s.emergency_contact || 'N/A'),
                    emergencyContact: s.emergency_contact || 'N/A',
                    studyYear: s.study_year || 'N/A',
                    location: parent1 ? `${parent1.street}, ${parent1.city}, ${parent1.district}` : 'Route: ' + (s.pickup_route_id ? s.pickup_route_id.substring(0, 8) : 'None'),
                    date: s.created_at ? s.created_at.split('T')[0] : 'N/A',
                    status: s.transport_status === 'ACTIVE' ? 'Approved' : 'Inactive',
                    studentStatus: s.status || s.student_status || 'CURRENT',
                    originalData: s, // Keep reference to original data
                    parentData: parent1 // Keep reference to primary parent data
                };
            });
            setStudents(mappedStudents);
            
            // Sync current selection if viewing a detail
            if (selectedStudent) {
                const refreshedStudent = mappedStudents.find(s => s.id === selectedStudent.id);
                if (refreshedStudent) {
                    setSelectedStudent(refreshedStudent);
                }
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only handle click outside if its NOT a menu button or menu item
            const isActionMenuClick = event.target.closest('.action-menu-container');
            const isActionMenuTrigger = event.target.closest('.action-menu-trigger');

            if (!isActionMenuClick && !isActionMenuTrigger) {
                if (activeMenuId) setActiveMenuId(null);
            }
        };
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenuId]);

    // Close more dropdown on outside click
    useEffect(() => {
        const handleDropdownOutside = (event) => {
            if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
                setShowMoreDropdown(false);
            }
        };
        window.addEventListener('mousedown', handleDropdownOutside);
        return () => window.removeEventListener('mousedown', handleDropdownOutside);
    }, []);

    const moreTabOptions = [
        { key: 'LongAbsent', label: 'Long Absent', icon: faClock, color: 'text-amber-500' },
        { key: 'NonBusUsers', label: 'Non-Bus Users', icon: faWalking, color: 'text-orange-500' },
        { key: 'Discontinue', label: 'Discontinue', icon: faBan, color: 'text-rose-500' },
        { key: 'Alumni', label: 'Alumni', icon: faGraduationCap, color: 'text-indigo-500' },
    ];

    const filteredStudents = useMemo(() => {
        let result = [...students];
        
        // No client-side tab filtering needed — API returns filtered data
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(
                (student) =>
                    (student.name || "").toLowerCase().includes(lowerQuery) ||
                    (student.primaryParent || "").toLowerCase().includes(lowerQuery) ||
                    (student.className || "").toLowerCase().includes(lowerQuery)
            );
        }
        return result;
    }, [students, searchQuery]);

    const handleAddStudent = async (newStudentData) => {
        try {
            // newStudentData now contains the full payload from AddStudentForm
            await studentService.createStudent(newStudentData);
            await fetchAllData(); // Refresh list
            setShowForm(false);
        } catch (error) {
            console.error("Error adding student:", error);
            
            // Extract meaningful error message for user feedback
            let errorMessage = "Failed to create student. Please check your inputs.";
            if (error.response?.data) {
                console.error("Validation Errors:", JSON.stringify(error.response.data, null, 2));
                // Try to extract specific error message from API response
                const apiError = error.response.data;
                if (apiError.message) {
                    errorMessage = apiError.message;
                } else if (apiError.detail) {
                    errorMessage = typeof apiError.detail === 'string' 
                        ? apiError.detail 
                        : JSON.stringify(apiError.detail);
                } else if (apiError.errors) {
                    errorMessage = Object.values(apiError.errors).flat().join(', ');
                }
            }
            
            alert(errorMessage);
            // Don't close the form - let user fix the errors
        }
    };

    const handleBulkStatusUpdate = async (newStatus) => {
        if (!selectedRows.length) return;
        
        // Prepare unique parents list with related students
        const parentsMap = new Map();
        selectedRows.forEach(s => {
            if (s.parentData && s.parentData.parent_id) {
                if (!parentsMap.has(s.parentData.parent_id)) {
                    parentsMap.set(s.parentData.parent_id, {
                        ...s.parentData,
                        relatedStudents: [s.name]
                    });
                } else {
                    parentsMap.get(s.parentData.parent_id).relatedStudents.push(s.name);
                }
            }
        });
        
        const uniqueParents = Array.from(parentsMap.values());
        
        // Smart Selection: Default select parents whose status contradicts the new student status
        const targetParentStatus = newStatus === 'CURRENT' ? 'ACTIVE' : 'INACTIVE';
        const smartSelection = uniqueParents
            .filter(p => (p.parents_active_status || 'ACTIVE') !== targetParentStatus)
            .map(p => p.parent_id);

        setPendingBulkUpdate({ newStatus, selectedRows, uniqueParents });
        setBulkParentSelection(smartSelection);
        setShowBulkParentStatusModal(true);
    };

    const confirmBulkUpdate = async (shouldUpdateParents) => {
        if (!pendingBulkUpdate) return;
        const { newStatus, selectedRows } = pendingBulkUpdate;

        setLoading(true);
        try {
            // 1. Update all selected students
            await Promise.all(selectedRows.map(student => 
                studentService.updateStudentStatus(student.id, newStatus)
            ));

            // 2. Update Selected Parents if confirmed
            if (shouldUpdateParents && bulkParentSelection.length > 0) {
                 const parentStatusToSet = newStatus === 'CURRENT' ? 'ACTIVE' : 'INACTIVE';
                 
                 
                 await Promise.all(bulkParentSelection.map(pid => {
                     // Corrected method name to updateParentStatus
                     return parentService.updateParentStatus 
                        ? parentService.updateParentStatus(pid, parentStatusToSet)
                        : Promise.resolve();
                 }));
                 
                 // Update local parent state
                 setParents(prev => prev.map(p => 
                    bulkParentSelection.includes(p.parent_id)
                    ? { ...p, parents_active_status: parentStatusToSet }
                    : p
                 ));
            }

            setShowBulkMenu(false);
            setSelectedRows([]);
            await fetchAllData();
        } catch (error) {
            console.error("Bulk status update failed:", error);
            alert("Some updates failed. Please refresh and try again.");
        } finally {
            setLoading(false);
            setShowBulkParentStatusModal(false);
            setPendingBulkUpdate(null);
            setBulkParentSelection([]);
        }
    };

    const handleBulkTransportUpdate = async (newStatus) => {
        if (!selectedRows.length) return;
        setLoading(true);
        try {
            await Promise.all(selectedRows.map(student => 
                studentService.updateTransportStatus(student.id, newStatus)
            ));
            setShowBulkMenu(false);
            setSelectedRows([]);
            await fetchAllData();
        } catch (error) {
            console.error("Bulk transport update failed:", error);
            alert("Some transport updates failed.");
        } finally {
            setLoading(false);
        }
    };
    
    // Status update handler
    // Status update handler
    const handleStatusUpdate = async (studentId, newStatus) => {
        const student = students.find(s => s.id === studentId);
        // We verify parent status field. Assuming 'parents_active_status' from context, strictly checking 'ACTIVE'.
        // If data is missing, we default to treating it as inconsistent or just skip modal for safety?
        // Let's safe check: if no parent data, skip.
        if (!student || !student.parentData) {
            await executeStatusUpdate(studentId, newStatus);
            return;
        }

        const parentStatus = student.parentData.parents_active_status || 'ACTIVE'; // Default to active if undefined? Or handle null. 
        // Note: Safe to assume if parents_active_status is missing, it might be an older record or default. 
        // Let's assume 'ACTIVE' if undefined for UX to prompt deactivation, OR verify typical API response.
        
        if (newStatus === 'CURRENT') {
            // Case: Reactivating Student
            if (parentStatus !== 'ACTIVE') {
                 // Parent is Inactive, prompt to Reactivate
                 setPendingStudentStatusUpdate({ studentId, newStatus });
                 setShowParentStatusModal(true);
            } else {
                 // Parent already Active, just sync student
                 await executeStatusUpdate(studentId, newStatus);
            }
        } else {
            // Case: Deactivating Student (Alumni, Long Absent, etc)
            if (parentStatus === 'ACTIVE') {
                 // Parent is Active, prompt to Deactivate
                 setPendingStudentStatusUpdate({ studentId, newStatus });
                 setShowParentStatusModal(true);
            } else {
                 // Parent already Inactive, just sync student
                 await executeStatusUpdate(studentId, newStatus);
            }
        }
    };

    const confirmParentStatusUpdate = async (parentStatusOrNull) => {
        if (!pendingStudentStatusUpdate) return;
        
        const { studentId, newStatus } = pendingStudentStatusUpdate;
        
        // 1. Update Student Status
        await executeStatusUpdate(studentId, newStatus);
        
        // 2. Update Parent Status if requested
        if (parentStatusOrNull) {
            const student = students.find(s => s.id === studentId);
            if (student && student.parentData) {
                try {
                    if (typeof parentService.updateParentStatus === 'function') {
                        await parentService.updateParentStatus(student.parentData.parent_id, parentStatusOrNull);
                    }
                   
                   // Update local parent state for UI reflection
                   setParents(prev => prev.map(p => 
                        p.parent_id === student.parentData.parent_id 
                        ? { ...p, parents_active_status: parentStatusOrNull } 
                        : p
                   ));
                   
                } catch (err) {
                    console.error("Failed to update parent status", err);
                    alert("Student updated, but failed to update parent status.");
                }
            }
        }
        
        setShowParentStatusModal(false);
        setPendingStudentStatusUpdate(null);
    };

    const executeStatusUpdate = async (studentId, newStatus) => {
        try {
            await studentService.updateStudentStatus(studentId, newStatus);
            // Update local state immediately so filtering (Active/Archive) reacts
            setStudents(prev => prev.map(s => 
                s.id === studentId ? { 
                    ...s, 
                    studentStatus: newStatus,
                    originalData: { ...s.originalData, status: newStatus } 
                } : s
            ));
            await fetchAllData(); // Then sync with server
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update student status");
        }
    };

    const handleTransportStatusUpdate = async (studentId, newStatus) => {
        try {
            await studentService.updateTransportStatus(studentId, newStatus);
            setStudents(prev => prev.map(s => 
                s.id === studentId ? { 
                    ...s, 
                    status: newStatus === 'ACTIVE' ? 'Approved' : 'Inactive',
                    originalData: { ...s.originalData, is_transport_user: newStatus === 'ACTIVE' } 
                } : s
            ));
            
            // If the selected student is the one being updated, refresh it too
            if (selectedStudent && selectedStudent.id === studentId) {
                setSelectedStudent(prev => ({
                    ...prev,
                    status: newStatus === 'ACTIVE' ? 'Approved' : 'Inactive',
                    originalData: { ...prev.originalData, is_transport_user: newStatus === 'ACTIVE' }
                }));
            }
            
            await fetchAllData();
        } catch (error) {
            console.error("Failed to update transport status:", error);
            alert("Failed to update transport status");
        }
    };

    const handleUpdateAction = async (studentId, studentData) => {
        try {
            setLoading(true);
            await studentService.updateStudent(studentId, studentData);
            await fetchAllData();
            setShowForm(false);
            setEditingStudent(null);
            
            // If we're currently viewing this student's details, refresh that view too
            if (activeTab === "Active" || activeTab === "LongAbsent") {
                // The fetchAllData handles students state, but we might need to update selectedStudent if open
                if (selectedStudent && selectedStudent.id === studentId) {
                    const updated = (await studentService.getAllStudents()).find(s => s.student_id === studentId);
                    if (updated) {
                         // Find parent/class to maintain UI structure
                         // For simplicity, we can just trigger a back-to-list or re-map
                         // but standard practice is usually closing details or full refresh
                    }
                    setSelectedStudent(null); // Return to list for best UX consistency
                }
            }
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Failed to update student: " + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student.originalData);
        setShowForm(true);
    };


    const handleDeactivate = (id) => {
        setDeactivatingItemId(id);
        setDeactivationReason("");
        setShowDeactivateModal(true);
    };

    const confirmDeactivation = () => {
        if (deactivatingItemId) {
            setStudents(students.map(s => s.id === deactivatingItemId ? { ...s, status: 'Inactive', deactivationReason } : s));
            setDeactivatingItemId(null);
            setDeactivationReason("");
            setShowDeactivateModal(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header - Hidden when viewing details to save space */}
            {!selectedStudent && (
                <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 sticky top-0 z-30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className='ml-20 lg:ml-0'>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Student Management
                            </h1>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* View Mode Toggle (Segmented Control) */}
                            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
                                <button
                                    onClick={() => setActiveTab('Active')}
                                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                                        activeTab === 'Active' 
                                        ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' 
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Active Students
                                </button>

                                {/* More Dropdown */}
                                <div className="relative" ref={moreDropdownRef}>
                                    <button
                                        onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                                        className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                                            moreTabOptions.some(opt => opt.key === activeTab)
                                            ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' 
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {moreTabOptions.find(opt => opt.key === activeTab)?.label || 'More'}
                                        <FontAwesomeIcon icon={faChevronDown} className={`text-[10px] transition-transform duration-300 ${showMoreDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {showMoreDropdown && (
                                        <div className="absolute top-full right-0 mt-3 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] px-3 pt-2 pb-1.5">Filter by</p>
                                            {moreTabOptions.map(opt => (
                                                <button
                                                    key={opt.key}
                                                    onClick={() => { setActiveTab(opt.key); setShowMoreDropdown(false); }}
                                                    className={`w-full text-left px-3 py-2.5 text-[11px] font-bold rounded-xl flex items-center gap-3 transition-all duration-200 group ${
                                                        activeTab === opt.key 
                                                        ? 'text-blue-600 bg-blue-50 shadow-sm' 
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] transition-all ${
                                                        activeTab === opt.key
                                                        ? 'bg-blue-100 text-blue-600'
                                                        : `bg-slate-50 ${opt.color} group-hover:scale-110`
                                                    }`}>
                                                        <FontAwesomeIcon icon={opt.icon} />
                                                    </div>
                                                    {opt.label}
                                                    {activeTab === opt.key && (
                                                        <FontAwesomeIcon icon={faCheck} className="ml-auto text-[9px] text-blue-500" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 w-64 md:w-80 bg-blue-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                                />
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Grid Content */}
            <div className="flex-1 px-2 lg:px-8 pt-4 pb-4 overflow-hidden flex flex-col w-full">
                <div className="flex-1 flex flex-col min-h-0 lg:bg-white lg:rounded-[2.5rem] lg:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] lg:border lg:border-white lg:px-6 lg:pt-2 lg:pb-3 overflow-hidden">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-2xl text-blue-600" />
                            </div>
                            <p className="text-gray-500 font-medium tracking-wide">Loading...</p>
                        </div>
                    ) : selectedStudent ? (
                        <StudentDetail
                            selectedStudent={selectedStudent}
                            onBack={() => setSelectedStudent(null)}
                            onUpdate={fetchAllData}
                            onEdit={handleEditStudent}
                            onTransportStatusUpdate={handleTransportStatusUpdate}
                        />
                    ) : (
                        <StudentList
                            filteredStudents={filteredStudents}
                            setSelectedStudent={setSelectedStudent}
                            setShowForm={setShowForm}
                            handleStatusUpdate={handleStatusUpdate}
                            handleTransportStatusUpdate={handleTransportStatusUpdate}
                            activeMenuId={activeMenuId}
                            setActiveMenuId={setActiveMenuId}
                            onSelectionChanged={setSelectedRows}
                            onEdit={handleEditStudent}
                        />
                    )}
                </div>
            </div>

            {/* Bulk Actions Floating Pill */}
            {selectedRows.length > 0 && !selectedStudent && (
                <>
                    {/* Full Screen Backdrop Blur when menu is open */}
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
                            <div className="space-y-1">
                                <div className="px-3 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Update Primary Status</div>
                                {(() => {
                                    const options = [
                                        { label: 'Set as Current', value: 'CURRENT', icon: faUserCheck, color: 'text-emerald-500', bgColor: 'bg-emerald-50/50' },
                                        { label: 'Mark as Alumni', value: 'ALUMNI', icon: faGraduationCap, color: 'text-blue-500', bgColor: 'bg-blue-50/50' },
                                        { label: 'Long Absent', value: 'LONG_ABSENT', icon: faUserSlash, color: 'text-rose-500', bgColor: 'bg-rose-50/50' },
                                        { label: 'Discontinue', value: 'DISCONTINUED', icon: faBan, color: 'text-red-500', bgColor: 'bg-red-50/50' }
                                    ];
                                    
                                    // Context-aware filtering of status options
                                    let displayedOptions = options;
                                    
                                    if (activeTab === 'Active') {
                                        // On Active tab, hide 'Set as Current'
                                        displayedOptions = displayedOptions.filter(o => o.value !== 'CURRENT');
                                    } else if (activeTab === 'LongAbsent') {
                                        // On Long Absent tab, hide 'Long Absent'
                                        displayedOptions = displayedOptions.filter(o => o.value !== 'LONG_ABSENT');
                                    }
                                    // Add conditions for other tabs (e.g., Alumni) if they exist in the future
                                        
                                    return displayedOptions.map(opt => (
                                        <button 
                                            key={opt.value}
                                            onClick={() => handleBulkStatusUpdate(opt.value)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-all group"
                                        >
                                            <div className={`w-8 h-8 rounded-lg ${opt.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <FontAwesomeIcon icon={opt.icon} className={`text-sm ${opt.color}`} />
                                            </div>
                                            {opt.label}
                                        </button>
                                    ));
                                })()}
                                
                                <div className="h-px bg-slate-100 my-2 mx-2" />
                                <div className="px-3 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Transport Fleet</div>
                                <div className="grid grid-cols-1 gap-2 p-1">
                                    {/* Enable button hidden per user request across different pages */}
                                    <button 
                                        onClick={() => handleBulkTransportUpdate('INACTIVE')}
                                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors group"
                                    >
                                        <FontAwesomeIcon icon={faWalking} className="text-sm group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase">Disable</span>
                                    </button>
                                </div>
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
                                {selectedRows.length} Students Selected
                            </span>
                            <span className={`text-[13px] font-bold mt-0.5 ${showBulkMenu ? 'text-white' : 'text-slate-900'}`}>
                                {showBulkMenu ? 'Close Selection Menu' : 'Actions for Selected'}
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

            {/* Add Student Form Drawer */}
            <AddStudentForm
                show={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditingStudent(null);
                }}
                onAdd={handleAddStudent}
                onUpdate={handleUpdateAction}
                parents={parents}
                initialData={editingStudent}
            />

            {/* Floating Add Button */}
            {!showForm && !selectedStudent && (
                <button
                    onClick={() => setShowForm(true)}
                    className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
                    style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                >
                    <FontAwesomeIcon icon={faUserPlus} className="text-xl sm:text-2xl" />
                </button>
            )}


            {/* Deactivation Reason Modal */}
            {showDeactivateModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setShowDeactivateModal(false)}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl border border-white p-8 w-full max-w-sm animate-in zoom-in slide-in-from-bottom-4 duration-300 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 mx-auto">
                            <FontAwesomeIcon icon={faClock} className="text-2xl text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Reason for Deactivation</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed text-center">
                            Please provide a reason why this person is being moved to inactive status.
                        </p>
                        <textarea
                            value={deactivationReason}
                            onChange={(e) => setDeactivationReason(e.target.value)}
                            placeholder="Enter reason here..."
                            className="w-full p-4 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 resize-none bg-gray-50/50 mb-6 min-h-[100px]"
                            autoFocus
                        />
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => setShowDeactivateModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeactivation}
                                disabled={!deactivationReason.trim()}
                                className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${deactivationReason.trim()
                                    ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
                    {/* Parent Status Update Modal */}
                    {/* Parent Status Update Modal */}
            {showParentStatusModal && pendingStudentStatusUpdate && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setShowParentStatusModal(false)}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl border border-white p-8 w-full max-w-sm animate-in zoom-in slide-in-from-bottom-4 duration-300 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 mx-auto">
                            <FontAwesomeIcon icon={faUserTie} className="text-2xl text-blue-600" />
                        </div>
                        
                        {(() => {
                             const student = students.find(s => s.id === pendingStudentStatusUpdate.studentId);
                             const parentStatus = student?.parentData?.parents_active_status || 'ACTIVE'; // Default to Active if missing
                             const isParentActive = parentStatus === 'ACTIVE';
                             
                             return (
                                 <>
                                     <h3 className="text-xl font-bold text-gray-900 mb-2">
                                         {isParentActive ? 'Deactivate Parent Account?' : 'Reactivate Parent Account?'}
                                     </h3>
                                     <p className="text-gray-500 text-sm mb-6 leading-relaxed text-center">
                                         {isParentActive 
                                             ? "The parent account is currently Active. Do you want to deactivate it as well?"
                                             : "The parent account is currently Inactive. Do you want to reactivate it as well?"}
                                     </p>
                                     
                                     <div className="flex flex-col gap-3 w-full">
                                         {isParentActive ? (
                                             <button
                                                 onClick={() => confirmParentStatusUpdate('INACTIVE')}
                                                 className="w-full px-4 py-3 rounded-xl bg-amber-50 text-amber-700 font-bold text-sm hover:bg-amber-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                                             >
                                                 <FontAwesomeIcon icon={faUserSlash} /> Yes, Deactivate Parent
                                             </button>
                                         ) : (
                                             <button
                                                 onClick={() => confirmParentStatusUpdate('ACTIVE')}
                                                 className="w-full px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                                             >
                                                 <FontAwesomeIcon icon={faUserCheck} /> Yes, Reactivate Parent
                                             </button>
                                         )}
                                         
                                         <button
                                             onClick={() => confirmParentStatusUpdate(null)}
                                             className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
                                         >
                                             {isParentActive ? "No, Keep Parent Active" : "No, Keep Parent Inactive"}
                                         </button>
                                     </div>
                                 </>
                             );
                        })()}
                    </div>
                </div>
            )}
            {/* Bulk Parent Status Update Modal */}
            {showBulkParentStatusModal && pendingBulkUpdate && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setShowBulkParentStatusModal(false)}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl border border-white p-6 w-full max-w-2xl animate-in zoom-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[85vh]">
                        
                        {(() => {
                             const { newStatus, uniqueParents } = pendingBulkUpdate;
                             const isActivating = newStatus === 'CURRENT';
                             const targetStatus = isActivating ? 'ACTIVE' : 'INACTIVE';
                             
                             const toggleParent = (pid) => {
                                 setBulkParentSelection(prev => 
                                     prev.includes(pid) ? prev.filter(id => id !== pid) : [...prev, pid]
                                 );
                             };

                             const toggleAll = () => {
                                 if (bulkParentSelection.length === uniqueParents.length) {
                                     setBulkParentSelection([]);
                                 } else {
                                     setBulkParentSelection(uniqueParents.map(p => p.parent_id));
                                 }
                             };
                             
                             return (
                                 <>
                                     <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                                         <div className={`w-12 h-12 rounded-2xl ${isActivating ? 'bg-emerald-50' : 'bg-amber-50'} flex items-center justify-center`}>
                                            <FontAwesomeIcon icon={isActivating ? faUserCheck : faUserSlash} className={`text-xl ${isActivating ? 'text-emerald-600' : 'text-amber-600'}`} />
                                         </div>
                                         <div>
                                             <h3 className="text-xl font-bold text-gray-900">
                                                 {isActivating ? 'Reactivate Parents' : 'Deactivate Parents'}
                                             </h3>
                                             <p className="text-gray-500 text-sm">
                                                 Select parents to {isActivating ? 'reactivate' : 'deactivate'} along with students.
                                             </p>
                                         </div>
                                     </div>
                                     
                                     <div className="flex-1 overflow-y-auto min-h-0 pr-2 mb-6 space-y-2">
                                         <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg mb-2">
                                             <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                 {bulkParentSelection.length} Selected
                                             </span>
                                             <button 
                                                 onClick={toggleAll}
                                                 className="text-xs font-bold text-blue-600 hover:text-blue-700"
                                             >
                                                 {bulkParentSelection.length === uniqueParents.length ? 'Deselect All' : 'Select All'}
                                             </button>
                                         </div>
                                         
                                         {uniqueParents.map(parent => {
                                             const isSelected = bulkParentSelection.includes(parent.parent_id);
                                             const isActive = (parent.parents_active_status || 'ACTIVE') === 'ACTIVE';
                                             
                                             return (
                                                 <label 
                                                     key={parent.parent_id}
                                                     className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                         isSelected 
                                                         ? 'border-blue-500 bg-blue-50/50' 
                                                         : 'border-gray-100 hover:border-blue-200'
                                                     }`}
                                                 >
                                                     <div className="pt-0.5">
                                                         <input 
                                                             type="checkbox"
                                                             checked={isSelected}
                                                             onChange={() => toggleParent(parent.parent_id)}
                                                             className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                         />
                                                     </div>
                                                     <div className="flex-1">
                                                         <div className="flex items-center justify-between">
                                                             <span className="font-bold text-gray-900 text-sm">{parent.name}</span>
                                                             <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                                 {isActive ? 'Active' : 'Inactive'}
                                                             </span>
                                                         </div>
                                                         <p className="text-xs text-gray-500 mt-1">
                                                             Linking: {parent.relatedStudents.join(', ')}
                                                         </p>
                                                     </div>
                                                 </label>
                                             );
                                         })}
                                     </div>
                                     
                                     <div className="flex gap-3 pt-4 border-t border-gray-100 mt-auto">
                                         <button
                                             onClick={() => confirmBulkUpdate(false)}
                                             className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
                                         >
                                             Skip Parent Updates
                                         </button>
                                         <button
                                             onClick={() => confirmBulkUpdate(true)}
                                             className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 flex items-center justify-center gap-2 ${
                                                 isActivating 
                                                 ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200' 
                                                 : 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200'
                                             }`}
                                         >
                                             {isActivating 
                                                 ? `Reactivate ${bulkParentSelection.length} Parents` 
                                                 : `Deactivate ${bulkParentSelection.length} Parents`}
                                         </button>
                                     </div>
                                 </>
                             );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

// Add slide-in animation logic
const style = document.createElement('style');
style.textContent = `
      @keyframes slide-in {
        from {transform: translateX(-100%); }
    to {transform: translateX(0); }
}
      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }
      .ag-center-header .ag-header-cell-comp-wrapper {
        justify-content: center !important;
      }
      .ag-selection-checkbox {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
      }
      .ag-checkbox-input-wrapper {
        transform: scale(1.4) !important;
      }
      /* Remove AG Grid Vertical Lines */
      .ag-theme-quartz, .ag-theme-quartz-dark {
        --ag-cell-horizontal-border: none !important;
        --ag-header-column-separator-display: none !important;
        --ag-header-column-resize-handle-display: none !important;
      }
      .ag-header-cell::after, .ag-header-group-cell::after {
        display: none !important;
      }
      .ag-pinned-left-header, .ag-pinned-left-cols-container {
        border-right: none !important;
      }
      .ag-cell {
        border-right: none !important;
      }
      `;
if (typeof document !== 'undefined') {
    document.head.appendChild(style);
}

export default StudentManagementHome;
