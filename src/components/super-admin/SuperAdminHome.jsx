import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import AdminTeam from './AdminTeam';
import SchoolLocations from './SchoolLocations';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import DeactivationReasonModal from './DeactivationReasonModal';

const SuperAdminHome = () => {
    // Admin Data State
    const [admins, setAdmins] = useState([
        {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@hope3school.com',
            phone: '+91 9876543210',
            status: 'Active',
            role: 'Super Admin'
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.j@hope3school.com',
            phone: '+91 9876543211',
            status: 'Active',
            role: 'Admin'
        },
        {
            id: 3,
            name: 'Mike Wilson',
            email: 'mike.w@hope3school.com',
            phone: '+91 9876543212',
            status: 'Inactive',
            role: 'Admin'
        },
    ]);

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
    const handleAddAdmin = (newAdmin) => {
        setAdmins([...admins, {
            id: Date.now(),
            ...newAdmin,
            status: 'Active',
            role: 'Admin'
        }]);
    };

    const handleUpdateAdmin = (id, updatedData) => {
        setAdmins(admins.map(a => a.id === id ? updatedData : a));
    };

    const handleDeleteAdminRequest = (id) => {
        setItemToDelete(id);
        setDeleteType('admin');
        setShowDeleteConfirm(true);
    };

    const handleToggleAdminStatus = (id) => {
        const admin = admins.find(a => a.id === id);
        if (admin && admin.status === 'Active') {
            setDeactivatingItemId(id);
            setShowDeactivateModal(true);
        } else {
            setAdmins(admins.map(a =>
                a.id === id ? { ...a, status: 'Active' } : a
            ));
        }
    };

    const confirmDeactivation = (reason) => {
        if (deactivatingItemId) {
            setAdmins(admins.map(a =>
                a.id === deactivatingItemId ? { ...a, status: 'Inactive', deactivationReason: reason } : a
            ));
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
    const confirmDelete = () => {
        if (!itemToDelete || !deleteType) return;

        if (deleteType === 'admin') {
            setAdmins(admins.filter(a => a.id !== itemToDelete));
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
