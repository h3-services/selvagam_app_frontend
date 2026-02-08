import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import AdminTeam from './AdminTeam';
import SchoolLocations from './SchoolLocations';
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

    // Location Data State
    const [locations, setLocations] = useState([
        {
            id: 1,
            name: 'Main Campus',
            address: '123 Education Lane, Knowledge City, Bangalore',
            lat: 12.9716,
            lng: 77.5946
        }
    ]);

    // UI States for Modals
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(null); // 'admin' | 'location'
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

    // --- Location Handlers ---
    const handleAddLocation = (newLocation) => {
        setLocations([...locations, { ...newLocation, id: Date.now() }]);
    };

    const handleUpdateLocation = (id, updatedData) => {
        setLocations(locations.map(l => l.id === id ? updatedData : l));
    };

    const handleDeleteLocationRequest = (id) => {
        setItemToDelete(id);
        setDeleteType('location');
        setShowDeleteConfirm(true);
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
        } else if (deleteType === 'location') {
            setLocations(locations.filter(l => l.id !== itemToDelete));
        }

        setShowDeleteConfirm(false);
        setItemToDelete(null);
        setDeleteType(null);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="ml-20 lg:ml-0">
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Administration</h1>
                            <p className="text-gray-500 text-sm">Control access and system configurations</p>
                        </div>
                    </div>
                </div>

                {/* Modules */}
                <AdminTeam
                    admins={admins}
                    onAddAdmin={handleAddAdmin}
                    onUpdateAdmin={handleUpdateAdmin}
                    onDeleteAdmin={handleDeleteAdminRequest}
                    onToggleStatus={handleToggleAdminStatus}
                />

                <SchoolLocations
                    locations={locations}
                    onAddLocation={handleAddLocation}
                    onUpdateLocation={handleUpdateLocation}
                    onDeleteLocation={handleDeleteLocationRequest}
                />
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
