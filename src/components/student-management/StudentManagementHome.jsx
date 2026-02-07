import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash, faClock, faUserPlus, faArrowLeft, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import StudentList from './StudentList';
import StudentDetail from './StudentDetail';
import AddStudentForm from './AddStudentForm';
import { studentService } from '../../services/studentService';
import { parentService } from '../../services/parentService';

const StudentManagementHome = () => {
    // State
    const [students, setStudents] = useState([]);
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Actions State
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [deactivatingItemId, setDeactivatingItemId] = useState(null);
    const [deactivationReason, setDeactivationReason] = useState("");

    // Fetch students and parents on mount
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [studentData, parentData] = await Promise.all([
                studentService.getAllStudents(),
                parentService.getAllParents()
            ]);
            
            setParents(parentData);

            // Map API data to UI structure, linking parents
            const mappedStudents = studentData.map(s => {
                const parent1 = parentData.find(p => p.parent_id === s.parent_id);
                const parent2 = s.s_parent_id ? parentData.find(p => p.parent_id === s.s_parent_id) : null;
                
                return {
                    id: s.student_id,
                    name: s.name,
                    primaryParent: parent1 ? parent1.name : (s.parent_id || 'Unknown'),
                    parent1Name: parent1 ? parent1.name : (s.parent_id || 'Unknown'),
                    parent2Name: parent2 ? parent2.name : '',
                    parentEmail: parent1 ? parent1.email : 'N/A',
                    mobile: parent1 ? parent1.phone : (s.emergency_contact || 'N/A'),
                    location: parent1 ? `${parent1.street}, ${parent1.city}, ${parent1.district}` : 'Route: ' + (s.pickup_route_id ? s.pickup_route_id.substring(0, 8) : 'None'),
                    date: s.created_at ? s.created_at.split('T')[0] : 'N/A',
                    status: s.transport_status === 'ACTIVE' ? 'Approved' : 'Inactive',
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

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const filteredStudents = useMemo(() => {
        let result = students;
        if (activeTab !== "All") {
            result = result.filter(student => student.status === activeTab);
        }
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(
                (student) =>
                    student.name.toLowerCase().includes(lowerQuery) ||
                    student.primaryParent.toLowerCase().includes(lowerQuery)
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

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            try {
                await studentService.deleteStudent(itemToDelete);
                setStudents(students.filter(s => s.id !== itemToDelete));
                setItemToDelete(null);
                setShowDeleteConfirm(false);
            } catch (error) {
                console.error("Error deleting student:", error);
            }
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
        <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold ml-20 lg:ml-0">Student Management</h2>
                    <p className="text-sm text-gray-500 mt-1 ml-20 lg:ml-0">Authorize and manage student accounts</p>
                </div>
                {/* Mobile Search */}
                <div className="w-full sm:w-auto relative sm:min-w-[300px] lg:hidden">
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-5 py-3 pl-12 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-100 focus:border-purple-400 focus:bg-white shadow-sm hover:shadow-md transition-all text-sm outline-none"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                </div>
            </div>

            {/* Breadcrumb / Search Bar */}
            {selectedStudent ? null : (
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-2">
                    <div className="flex flex-col items-start gap-2 w-full lg:w-auto pl-6">
                        <div className="relative w-full lg:w-96 hidden lg:block">
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 rounded-xl bg-white border border-purple-100 focus:border-purple-400 focus:bg-white transition-all text-sm outline-none shadow-sm"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <FontAwesomeIcon icon={faCircleNotch} className="text-4xl text-purple-600 animate-spin" />
                        <p className="text-gray-500 font-medium">Loading students...</p>
                    </div>
                </div>
            ) : selectedStudent ? (
                <StudentDetail
                    selectedStudent={selectedStudent}
                    onBack={() => setSelectedStudent(null)}
                    onUpdate={handleUpdateStudent}
                />
            ) : (
                <StudentList
                    filteredStudents={filteredStudents}
                    setSelectedStudent={setSelectedStudent}
                    setShowForm={setShowForm}
                    handleDelete={handleDelete}
                    activeMenuId={activeMenuId}
                    setActiveMenuId={setActiveMenuId}
                />
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
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                Are you sure you want to delete this student record? This action cannot be undone and will remove all associated data.
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
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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
                            className="w-full p-4 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 resize-none bg-gray-50/50 mb-6 min-h-[100px]"
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
      `;
if (typeof document !== 'undefined') {
    document.head.appendChild(style);
}

export default StudentManagementHome;
