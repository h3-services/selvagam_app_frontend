import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClock, faUserPlus, faArrowLeft, faCircleNotch, faUser, faFilter, faChevronDown, faGraduationCap, faCheck, faArchive, faUsers, faBus, faWalking, faUserCheck, faUserSlash } from '@fortawesome/free-solid-svg-icons';
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
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("Active");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Actions State
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [deactivatingItemId, setDeactivatingItemId] = useState(null);
    const [deactivationReason, setDeactivationReason] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [showBulkMenu, setShowBulkMenu] = useState(false);

    // Fetch students and parents on mount
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [studentData, parentData, classData] = await Promise.all([
                studentService.getAllStudents(),
                parentService.getAllParents(),
                classService.getAllClasses()
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
                    location: parent1 ? `${parent1.street}, ${parent1.city}, ${parent1.district}` : 'Route: ' + (s.pickup_route_id ? s.pickup_route_id.substring(0, 8) : 'None'),
                    date: s.created_at ? s.created_at.split('T')[0] : 'N/A',
                    status: s.transport_status === 'ACTIVE' ? 'Approved' : 'Inactive',
                    studentStatus: s.status || s.student_status || 'CURRENT',
                    originalData: s, // Keep reference to original data
                    parentData: parent1 // Keep reference to primary parent data
                };
            });
            setStudents(mappedStudents);
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

    const filteredStudents = useMemo(() => {
        let result = [...students];
        
        if (activeTab === "Active") {
            // Active Students tab now strictly shows students with ACTIVE transport status
            result = result.filter(student => 
                student.studentStatus === 'CURRENT' && 
                student.originalData?.transport_status === 'ACTIVE'
            );
        } else if (activeTab === "Archive") {
            // Archived Records shows everyone who is NOT current (Inactive, Alumni, etc.)
            result = result.filter(student => student.studentStatus && student.studentStatus !== 'CURRENT');
        }
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
    }, [students, searchQuery, activeTab]);

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
        setLoading(true);
        try {
            await Promise.all(selectedRows.map(student => 
                studentService.updateStudentStatus(student.id, newStatus)
            ));
            setShowBulkMenu(false);
            setSelectedRows([]);
            await fetchAllData();
        } catch (error) {
            console.error("Bulk status update failed:", error);
            alert("Some updates failed. Please refresh and try again.");
        } finally {
            setLoading(false);
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
    const handleStatusUpdate = async (studentId, newStatus) => {
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

    const handleUpdateStudent = async (updatedStudent) => {
        try {
            const apiData = {
                ...updatedStudent.originalData,
                name: updatedStudent.name,
                emergency_contact: updatedStudent.mobile,
                // map other fields as needed
            };
            await studentService.updateStudent(updatedStudent.id, apiData);
            await fetchAllData(); // Refresh list
            setSelectedStudent(null); // Go back to list
        } catch (error) {
            console.error("Error updating student:", error);
        }
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
                <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
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
                                <button
                                    onClick={() => setActiveTab('Archive')}
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
            <div className="flex-1 px-8 pt-2 pb-8 overflow-hidden flex flex-col">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-xl border border-gray-100">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faCircleNotch} spin className="text-2xl text-blue-600" />
                        </div>
                        <p className="text-gray-500 font-medium">Loading students...</p>
                    </div>
                ) : selectedStudent ? (
                    <StudentDetail
                        selectedStudent={selectedStudent}
                        onBack={() => setSelectedStudent(null)}
                        onUpdate={handleUpdateStudent}
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
                    />
                )}
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
                                {[
                                    { label: 'Set as Current', value: 'CURRENT', icon: faUserCheck, color: 'text-emerald-500', bgColor: 'bg-emerald-50/50' },
                                    { label: 'Mark as Alumni', value: 'ALUMNI', icon: faGraduationCap, color: 'text-blue-500', bgColor: 'bg-blue-50/50' },
                                    { label: 'Long Absent', value: 'LONG_ABSENT', icon: faUserSlash, color: 'text-rose-500', bgColor: 'bg-rose-50/50' }
                                ].map(opt => (
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
                                ))}
                                
                                <div className="h-px bg-slate-100 my-2 mx-2" />
                                <div className="px-3 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Transport Fleet</div>
                                <div className="grid grid-cols-2 gap-2 p-1">
                                    <button 
                                        onClick={() => handleBulkTransportUpdate('ACTIVE')}
                                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors group"
                                    >
                                        <FontAwesomeIcon icon={faBus} className="text-sm group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase">Enable</span>
                                    </button>
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
                onClose={() => setShowForm(false)}
                onAdd={handleAddStudent}
                parents={parents}
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
