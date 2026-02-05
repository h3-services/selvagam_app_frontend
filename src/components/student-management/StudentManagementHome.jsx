import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash, faClock, faUserPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import StudentList from './StudentList';
import StudentDetail from './StudentDetail';
import AddStudentForm from './AddStudentForm';

const StudentManagementHome = () => {
    // State
    const [students, setStudents] = useState([
        { id: 1, name: "Student 1", parentName: "Parent 1", mobile: "9876543210", location: "123 Main St, New York", date: "2024-01-15", status: 'Approved' },
        { id: 2, name: "Student 2", parentName: "Parent 2", mobile: "9876543211", location: "456 Elm St, Los Angeles", date: "2024-02-10", status: 'Inactive' },
        { id: 3, name: "Student 3", parentName: "Parent 3", mobile: "9876543212", location: "789 Pine St, Chicago", date: "2024-03-05", status: 'Inactive' },
        { id: 4, name: "Student 4", parentName: "Parent 4", mobile: "9876543213", location: "321 Oak Ln, Houston", date: "2024-03-10", status: 'Inactive' },
        { id: 5, name: "Student 5", parentName: "Parent 5", mobile: "9876543214", location: "654 Maple Dr, Seattle", date: "2024-03-12", status: 'Approved' },
        { id: 6, name: "Student 6", parentName: "Parent 6", mobile: "9876543215", location: "987 Cedar Rd, Boston", date: "2024-03-15", status: 'Inactive' },
        { id: 7, name: "Student 7", parentName: "Parent 7", mobile: "9876543216", location: "159 Birch Blvd, Miami", date: "2024-03-18", status: 'Approved' },
        { id: 8, name: "Student 8", parentName: "Parent 8", mobile: "9876543217", location: "753 Spruce Way, Denver", date: "2024-03-20", status: 'Inactive' },
    ]);
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
                    student.parentName.toLowerCase().includes(lowerQuery)
            );
        }
        return result;
    }, [students, searchQuery, activeTab]);

    const handleAddStudent = (newStudent) => {
        setStudents([...students, {
            id: Date.now(),
            ...newStudent,
            distance: '0 km',
            date: new Date().toISOString().split('T')[0],
            status: newStudent.status || 'Approved'
        }]);
        setShowForm(false);
    };

    const handleUpdateStudent = (updatedStudent) => {
        setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        setSelectedStudent(updatedStudent);
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setStudents(students.filter(s => s.id !== itemToDelete));
            setItemToDelete(null);
            setShowDeleteConfirm(false);
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
            {selectedStudent ? (
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
