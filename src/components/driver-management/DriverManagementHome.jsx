import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faTrash, faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
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

    const handleToggleStatus = async (id) => {
        const driver = drivers.find(d => d.id === id);
        if (!driver) return;

        const newStatus = driver.status === 'Active' ? 'INACTIVE' : 'ACTIVE';
        const newStatusUI = driver.status === 'Active' ? 'Inactive' : 'Active';

        // Optimistic update
        setDrivers(drivers.map(d =>
            d.id === id ? { ...d, status: newStatusUI } : d
        ));

        try {
            await driverService.updateDriverStatus(id, newStatus);
        } catch (err) {
            console.error(`Failed to update driver status to ${newStatus}:`, err);
            // Revert on error
            setDrivers(drivers.map(d =>
                d.id === id ? { ...d, status: driver.status } : d
            ));
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
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className='ml-20 lg:ml-0'>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {selectedDriver ? 'Driver Profile' : 'Driver Management'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedDriver ? `Viewing details for ${selectedDriver.name}` : 'Manage school bus drivers and status'}
                        </p>
                    </div>

                    {!selectedDriver && (
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search drivers..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 w-96 bg-indigo-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                                />
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 px-8 pt-2 pb-8 overflow-hidden flex flex-col">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-xl border border-gray-100">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-indigo-600" />
                        </div>
                        <p className="text-gray-500 font-medium">Loading drivers...</p>
                    </div>
                ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-xl border border-red-100">
                         <p className="text-red-500 font-bold mb-4">{error}</p>
                         <button onClick={fetchDrivers} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95">Retry</button>
                    </div>
                ) : selectedDriver ? (
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
            </div>

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


        </div>
    );
};

export default DriverManagementHome;
