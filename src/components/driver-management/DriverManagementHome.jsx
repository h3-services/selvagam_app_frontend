import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faTrash, faClock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import DriverList from './DriverList';
import DriverDetail from './DriverDetail';
import AddDriverForm from './AddDriverForm';

const DriverManagementHome = () => {
    const [drivers, setDrivers] = useState([
        { id: 1, name: 'Driver 1', email: 'driver1@example.com', mobile: '9876543210', licenseNumber: 'DL-2024-001', vehicleNumber: 'Bus 1 - TN 33 AA 1234', route: 'Gandhipuram - Railway Station', date: '2024-01-10', status: 'Active' },
        { id: 2, name: 'Driver 2', email: 'driver2@example.com', mobile: '9876543211', licenseNumber: 'DL-2024-002', vehicleNumber: 'Bus 2 - TN 33 AA 5678', route: 'Ukkadam - Town Hall', date: '2024-01-15', status: 'Inactive' },
        { id: 3, name: 'Driver 3', email: 'driver3@example.com', mobile: '9876543212', licenseNumber: 'DL-2024-003', vehicleNumber: 'Bus 3 - TN 33 AA 9012', route: 'Saravanampatti - Prozone Mall', date: '2024-02-01', status: 'Active' },
        { id: 4, name: 'Driver 4', email: 'driver4@example.com', mobile: '9876543213', licenseNumber: 'DL-2024-004', vehicleNumber: 'Bus 4 - TN 33 AA 3456', route: 'Peelamedu - Airport', date: '2024-02-05', status: 'Active' },
        { id: 5, name: 'Driver 5', email: 'driver5@example.com', mobile: '9876543214', licenseNumber: 'DL-2024-005', vehicleNumber: 'Bus 5 - TN 33 AA 7890', route: 'R.S. Puram - Brookefields', date: '2024-02-10', status: 'Inactive' },
        { id: 6, name: 'Driver 6', email: 'driver6@example.com', mobile: '9876543215', licenseNumber: 'DL-2024-006', vehicleNumber: 'Bus 6 - TN 33 AA 2345', route: 'Vadavalli - Maruthamalai', date: '2024-02-15', status: 'Active' },
        { id: 7, name: 'Driver 7', email: 'driver7@example.com', mobile: '9876543216', licenseNumber: 'DL-2024-007', vehicleNumber: 'Bus 7 - TN 33 AA 6789', route: 'Singanallur - Bus Stand', date: '2024-02-20', status: 'Active' },
        { id: 8, name: 'Driver 8', email: 'driver8@example.com', mobile: '9876543217', licenseNumber: 'DL-2024-008', vehicleNumber: 'Bus 8 - TN 33 AA 0123', route: 'Saibaba Colony - Thudiyalur', date: '2024-02-25', status: 'Inactive' },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedDriver, setSelectedDriver] = useState(null);
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

    const handleToggleStatus = (id) => {
        const driver = drivers.find(d => d.id === id);
        if (driver && driver.status === 'Active') {
            setDeactivatingItemId(id);
            setDeactivationReason("");
            setShowDeactivateModal(true);
        } else {
            setDrivers(drivers.map(d =>
                d.id === id ? { ...d, status: 'Active' } : d
            ));
        }
    };

    const confirmDeactivation = () => {
        if (deactivatingItemId) {
            setDrivers(drivers.map(d =>
                d.id === deactivatingItemId ? { ...d, status: 'Inactive', deactivationReason } : d
            ));
            setDeactivatingItemId(null);
            setDeactivationReason("");
            setShowDeactivateModal(false);
        }
    };

    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = (newDriver) => {
        setDrivers([...drivers, {
            id: Date.now(),
            ...newDriver,
            date: new Date().toISOString().split('T')[0]
        }]);
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setDrivers(drivers.filter(d => d.id !== itemToDelete));
            setItemToDelete(null);
            setShowDeleteConfirm(false);
        }
    };

    const handleUpdate = (updatedData) => {
        setDrivers(drivers.map(d => d.id === updatedData.id ? updatedData : d));
        setSelectedDriver(updatedData);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold ml-20 lg:ml-0">Driver Management</h2>
                    <p className="text-sm text-gray-500 mt-1 ml-20 lg:ml-0">Manage school bus drivers and status</p>
                </div>
                <div className="w-full sm:w-auto relative sm:min-w-[300px] lg:hidden">
                    <input
                        type="text"
                        placeholder="Search drivers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 pl-10 rounded-xl bg-white border border-purple-100 focus:border-purple-400 focus:bg-white transition-all text-sm outline-none shadow-sm"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {!selectedDriver && (
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-2">
                    <div className="flex flex-col items-start gap-2 w-full lg:w-auto pl-6">
                        <div className="relative w-full lg:w-96 hidden lg:block">
                            <input
                                type="text"
                                placeholder="Search drivers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 pl-10 rounded-xl bg-white border border-purple-100 focus:border-purple-400 focus:bg-white transition-all text-sm outline-none shadow-sm"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>
            )}

            {selectedDriver && (
                <div className="mb-4 flex items-center gap-4">
                    <button
                        onClick={() => setSelectedDriver(null)}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md flex items-center justify-center text-gray-600 transition-all hover:bg-gray-50"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-gray-500">Back to List</span>
                        <span style={{ color: '#40189d' }}>/</span>
                        <span style={{ color: '#40189d' }}>{selectedDriver.name}</span>
                    </div>
                </div>
            )}

            {selectedDriver ? (
                <DriverDetail
                    selectedDriver={selectedDriver}
                    onBack={() => setSelectedDriver(null)}
                    onUpdate={handleUpdate}
                />
            ) : (
                <DriverList
                    filteredDrivers={filteredDrivers}
                    setSelectedDriver={setSelectedDriver}
                    handleToggleStatus={handleToggleStatus}
                    handleDelete={handleDelete}
                    activeMenuId={activeMenuId}
                    setActiveMenuId={setActiveMenuId}
                />
            )}

            {!selectedDriver && (
                <button
                    onClick={() => setShowModal(true)}
                    className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
                    style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                >
                    <FontAwesomeIcon icon={faUserPlus} className="text-xl sm:text-2xl" />
                </button>
            )}

            <AddDriverForm
                show={showModal}
                onClose={() => setShowModal(false)}
                onAdd={handleAdd}
            />

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
                                Are you sure you want to delete this driver record? This action cannot be undone and will remove all associated data.
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
                            Please provide a reason why this driver is being moved to inactive status.
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

export default DriverManagementHome;
