import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faTrash, faClock, faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import DriverList from './DriverList';
import DriverDetail from './DriverDetail';
import AddDriverForm from './AddDriverForm';
import { driverService } from '../../services/driverService';

import { busService } from '../../services/busService';
import { routeService } from '../../services/routeService';

const DriverManagementHome = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [deactivatingItemId, setDeactivatingItemId] = useState(null);
    const [deactivationReason, setDeactivationReason] = useState("");

    // Fetch Drivers, Buses & Routes to map vehicles and routes
    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const [driversData, busesData, routesData] = await Promise.all([
                driverService.getAllDrivers(),
                busService.getAllBuses(),
                routeService.getAllRoutes()
            ]);

            // Create a lookup for bus (driver_id -> bus details)
            const driverBusMap = {};
            if (Array.isArray(busesData)) {
                busesData.forEach(bus => {
                    if (bus.driver_id) {
                        driverBusMap[bus.driver_id] = bus;
                    }
                });
            }

            // Create a lookup for route (route_id -> route name)
            const routeMap = {};
            if (Array.isArray(routesData)) {
                routesData.forEach(route => {
                    routeMap[route.route_id] = route.name;
                });
            }

            // Map API data to UI format
            const mappedDrivers = Array.isArray(driversData) ? driversData.map(d => {
                const assignedBus = driverBusMap[d.driver_id];
                const busNumber = assignedBus ? (assignedBus.registration_number || assignedBus.bus_number || 'Unknown Bus') : 'Unassigned';
                const routeName = assignedBus && assignedBus.route_id ? (routeMap[assignedBus.route_id] || 'Unknown Route') : 'Unassigned';

                return {
                    ...d,
                    id: d.driver_id,
                    mobile: d.phone, // UI uses mobile, API uses phone
                    licenseNumber: d.licence_number, // Note spelling
                    status: d.status.charAt(0).toUpperCase() + d.status.slice(1).toLowerCase(), // "ACTIVE" -> "Active"
                    date: d.created_at ? d.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
                    vehicleNumber: busNumber,
                    route: routeName
                };
            }) : [];
            setDrivers(mappedDrivers);
            setError(null);
        } catch (err) {
            setError('Failed to load drivers.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

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
            // Optimistic update
            setDrivers(drivers.map(d =>
                d.id === id ? { ...d, status: 'Active' } : d
            ));
            // TODO: Call API to update status
        }
    };

    const confirmDeactivation = () => {
        if (deactivatingItemId) {
            setDrivers(drivers.map(d =>
                d.id === deactivatingItemId ? { ...d, status: 'Inactive', deactivationReason } : d
            ));
            // TODO: Call API to update status
            setDeactivatingItemId(null);
            setDeactivationReason("");
            setShowDeactivateModal(false);
        }
    };

    const filteredDrivers = drivers.filter(d =>
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.email?.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = async (newDriver) => {
        setLoading(true);
        try {
            await driverService.createDriver(newDriver);
            await fetchDrivers(); // Refresh list to see new driver
            setShowModal(false);
        } catch (err) {
            console.error(err);
            // alert("Failed to create driver: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            try {
                await driverService.deleteDriver(itemToDelete);
                // Optimistic notification or just refresh
                await fetchDrivers();
                setShowDeleteConfirm(false);
                setItemToDelete(null);
            } catch (err) {
                console.error(err);
                // alert("Failed to delete driver: " + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleUpdate = async (updatedData) => {
        try {
            // Map UI fields back to API fields
            const apiPayload = {
                name: updatedData.name,
                email: updatedData.email,
                phone: Number(updatedData.mobile), // Map mobile -> phone
                dob: updatedData.dob,
                licence_number: updatedData.licenseNumber, // Map licenseNumber -> licence_number
                licence_expiry: updatedData.licence_expiry,
                aadhar_number: updatedData.aadhar_number,
                photo_url: updatedData.photo_url,
                licence_url: updatedData.licence_url,
                aadhar_url: updatedData.aadhar_url,
                is_available: updatedData.is_available,
                status: updatedData.status
                // Password is usually not updated here unless a specific change password flow exists
            };

            await driverService.updateDriver(updatedData.id, apiPayload);

            // Update local state to reflect changes immediately in Detail view without full reload if possible,
            // but fetching ensures data consistency.
            await fetchDrivers();

            // Update the selected driver view with the new data (merged with UI mappings)
            // We can re-find the driver from the new list or manually patch it for speed.
            // For now, let's just update the local selectedDriver with the UI fields so the view doesn't jump.
            setSelectedDriver(updatedData);

        } catch (err) {
            console.error(err);
            // alert("Failed to update driver: " + (err.response?.data?.message || err.message));
        }
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

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-purple-600 animate-spin" />
                        <p className="text-gray-500 font-medium">Loading drivers...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex-1 flex items-center justify-center text-red-500">
                    {error} <button onClick={fetchDrivers} className="ml-2 underline hover:text-red-700">Retry</button>
                </div>
            ) : null}

            {!loading && !error && (
                selectedDriver ? (
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
                )
            )}

            {!selectedDriver && !loading && (
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
