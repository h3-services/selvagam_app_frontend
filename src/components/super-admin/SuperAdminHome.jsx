import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import AdminTeam from './AdminTeam';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import DeactivationReasonModal from './DeactivationReasonModal';
import { adminService } from '../../services/adminService';

const SuperAdminHome = () => {
    // Admin Data State
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const data = await adminService.getAllAdmins();
            const mappedAdmins = data.map(admin => ({
                id: admin.admin_id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                status: admin.status.charAt(0).toUpperCase() + admin.status.slice(1).toLowerCase(), // ACTIVE -> Active
                role: 'Admin' // Default role since API doesn't provide it yet
            }));
            setAdmins(mappedAdmins);
        } catch (error) {
            console.error("Failed to load admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(null); // 'admin'
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [deactivatingItemId, setDeactivatingItemId] = useState(null);

    // --- Admin Handlers ---
    const handleAddAdmin = async (newAdmin) => {
        try {
            await adminService.createAdmin(newAdmin);
            fetchAdmins();
        } catch (error) {
            console.error("Failed to add admin:", error);
            alert("Failed to create admin");
        }
    };

    const handleUpdateAdmin = async (id, updatedData) => {
        try {
            await adminService.updateAdmin(id, updatedData);
            fetchAdmins();
        } catch (error) {
           console.error("Failed to update admin:", error);
        }
    };

    const handleDeleteAdminRequest = (id) => {
        setItemToDelete(id);
        setDeleteType('admin');
        setShowDeleteConfirm(true);
    };

    const handleToggleAdminStatus = async (id) => {
        const admin = admins.find(a => a.id === id);
        if (admin && admin.status === 'Active') {
            setDeactivatingItemId(id);
            setShowDeactivateModal(true);
        } else {
             try {
                await adminService.updateAdminStatus(id, 'ACTIVE');
                fetchAdmins();
            } catch (err) {
                console.error("Failed to activate admin:", err);
            }
        }
    };

    const confirmDeactivation = async (reason) => {
        if (deactivatingItemId) {
             try {
                await adminService.updateAdminStatus(deactivatingItemId, 'INACTIVE');
                fetchAdmins();
            } catch (err) {
                console.error("Failed to deactivate admin:", err);
            }
            setDeactivatingItemId(null);
            setShowDeactivateModal(false);
        }
    };

    // --- Shared Handlers ---
    const confirmDelete = async () => {
        if (!itemToDelete || !deleteType) return;

        if (deleteType === 'admin') {
            try {
                await adminService.deleteAdmin(itemToDelete);
                fetchAdmins();
            } catch (err) {
                console.error("Failed to delete admin:", err);
                alert("Failed to delete admin");
            }
        }

        setShowDeleteConfirm(false);
        setItemToDelete(null);
        setDeleteType(null);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className='ml-20 lg:ml-0'>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Administration</h1>
                        <p className="text-sm text-gray-500 mt-1">Control access and system configurations</p>
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-10">
                    <AdminTeam
                        admins={admins}
                        onAddAdmin={handleAddAdmin}
                        onUpdateAdmin={handleUpdateAdmin}
                        onDeleteAdmin={handleDeleteAdminRequest}
                        onToggleStatus={handleToggleAdminStatus}
                    />
                </div>
            </div>

            {/* Modals */}
            <DeleteConfirmationModal
                show={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                type={deleteType}
            />

            <DeactivationReasonModal
                show={showDeactivateModal}
                onClose={() => setShowDeactivateModal(false)}
                onConfirm={confirmDeactivation}
            />
        </div>
    );
};

export default SuperAdminHome;
