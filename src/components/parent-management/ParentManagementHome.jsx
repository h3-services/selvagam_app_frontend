import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faArrowLeft, faCircleNotch, faTrash, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { parentService } from '../../services/parentService';
import { studentService } from '../../services/studentService';
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

    // Actions State
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Fetch parents on mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [parentsData, studentsData] = await Promise.all([
                parentService.getAllParents(),
                studentService.getAllStudents()
            ]);

            // Map students to parents
            const parentsWithStudents = parentsData.map(parent => {
                const parentStudents = studentsData.filter(student => 
                    student.parent_id === parent.parent_id || 
                    student.s_parent_id === parent.parent_id
                ).map(s => s.name);
                
                return {
                    ...parent,
                    linkedStudents: parentStudents.length > 0 ? parentStudents : ['No children linked']
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
        if (!searchQuery) return parents;
        const lowerQuery = searchQuery.toLowerCase();
        return parents.filter(
            (parent) =>
                (parent.name || "").toLowerCase().includes(lowerQuery) ||
                String(parent.phone || "").includes(lowerQuery) ||
                parent.linkedStudents.some(s => (s || "").toLowerCase().includes(lowerQuery))
        );
    }, [parents, searchQuery]);

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
                await parentService.deleteParent(itemToDelete);
                setParents(parents.filter(p => p.parent_id !== itemToDelete));
                setItemToDelete(null);
                setShowDeleteConfirm(false);
            } catch (error) {
                console.error("Error deleting parent:", error);
                alert("Failed to delete parent.");
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

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search parents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-96 bg-indigo-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-8 pt-2 pb-8 overflow-hidden flex flex-col">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-xl border border-gray-100">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faCircleNotch} spin className="text-2xl text-indigo-600" />
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
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                Are you sure you want to delete this parent record? This action cannot be undone.
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
        </div>
    );
};

export default ParentManagementHome;
