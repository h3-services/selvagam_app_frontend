import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBus, faArrowLeft, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import BusList from './BusList';
import BusDetail from './BusDetail';
import AddBusForm from './AddBusForm';
import { busService } from '../../services/busService';
import { driverService } from '../../services/driverService';
import { routeService } from '../../services/routeService';

const BusManagementHome = () => {
    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedBus, setSelectedBus] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Fetch All Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const [busesData, driversData, routesData] = await Promise.all([
                busService.getAllBuses(),
                driverService.getAllDrivers(), 
                routeService.getAllRoutes() 
            ]);
            
            // Map Bus Data
            const mappedBuses = Array.isArray(busesData) ? busesData.map(b => ({
                ...b,
                id: b.bus_id,
                busNumber: b.registration_number || b.bus_number || 'Unknown',
                capacity: b.seating_capacity,
                // Attempt to find driver name if driver_id exists but name doesn't
                driverName: b.driver_name || (b.driver_id ? driversData.find(d => d.driver_id === b.driver_id)?.name || 'Assigned' : 'Unassigned'),
                contactNumber: 'N/A', 
                // Attempt to find route name
                route: b.route_name || (b.route_id ? routesData.find(r => r.route_id === b.route_id)?.name || 'Assigned' : 'Unassigned'),
                status: b.status ? (b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase()) : 'Inactive',
                vehicle_type: b.vehicle_type,
                bus_brand: b.bus_brand,
                bus_model: b.bus_model
            })) : [];

            setBuses(mappedBuses);
            setDrivers(driversData || []);
            setRoutes(routesData || []);
            setError(null);
        } catch (err) {
            setError('Failed to load fleet data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const [activeTab, setActiveTab] = useState('All');

    const filteredBuses = useMemo(() => {
        let result = buses;
        if (activeTab === 'Scrap') {
            result = result.filter(b => b.status === 'Scrap');
        } else {
            // 'All' tab should exclude 'Scrap' buses
            result = result.filter(b => b.status !== 'Scrap');
        }

        return result.filter(b =>
            (b.busNumber && b.busNumber.toLowerCase().includes(search.toLowerCase())) ||
            (b.driverName && b.driverName.toLowerCase().includes(search.toLowerCase()))
        );
    }, [buses, search, activeTab]);

    const handleAdd = async (newBusData) => {
        setLoading(true);
        try {
            const payload = {
                registration_number: newBusData.registration_number,
                vehicle_type: newBusData.vehicle_type || 'School Bus',
                bus_brand: newBusData.bus_brand,
                bus_model: newBusData.bus_model,
                seating_capacity: parseInt(newBusData.seating_capacity || 0),
                status: (newBusData.status || 'ACTIVE').toUpperCase(),
                driver_id: newBusData.driver_id || null, 
                route_id: newBusData.route_id || null,
                rc_expiry_date: newBusData.rc_expiry_date || null,
                fc_expiry_date: newBusData.fc_expiry_date || null,
                rc_book_url: newBusData.rc_book_url || null,
                fc_certificate_url: newBusData.fc_certificate_url || null
            };

            await busService.createBus(payload);
            await fetchData();
            setShowModal(false);
        } catch (err) {
            console.error(err);
            console.error(err);
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
                // await busService.deleteBus(itemToDelete);
                setBuses(buses.filter(b => b.id !== itemToDelete));
            } catch (e) {
                console.error("Failed to delete bus", e);
            }
            setItemToDelete(null);
            setShowDeleteConfirm(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        // Store previous state for rollback
        const previousBuses = [...buses];
        
        // Optimistic update
        setBuses(buses.map(b => b.id === id ? { ...b, status: newStatus } : b));

        try {
            await busService.updateBusStatus(id, newStatus.toUpperCase());
        } catch (err) {
            console.error("Failed to update bus status:", err);
            // Revert on error
            setBuses(previousBuses);
        }
    };

    const handleDriverChange = async (busId, driverId) => {
        // Store previous state for rollback
        const previousBuses = [...buses];
        
        // Find driver name for optimistic update
        const driverName = driverId ? (drivers.find(d => d.driver_id === driverId)?.name || 'Assigned') : 'Unassigned';

        // Optimistic update
        setBuses(buses.map(b => b.id === busId ? { ...b, driver_id: driverId, driverName: driverName } : b));

        try {
            await busService.assignDriver(busId, driverId);
        } catch (err) {
            console.error("Failed to assign driver:", err);
            // Revert on error
            setBuses(previousBuses);
        }
    };

    const handleUpdate = async (updatedData) => {
        setLoading(true);
        try {
            const payload = {
                registration_number: updatedData.busNumber, // map back to backend field name
                driver_id: updatedData.driver_id,
                route_id: updatedData.route_id,
                vehicle_type: updatedData.vehicle_type,
                bus_brand: updatedData.bus_brand,
                bus_model: updatedData.bus_model,
                seating_capacity: parseInt(updatedData.capacity || 0), // map back to backend field name
                rc_expiry_date: updatedData.rc_expiry_date,
                fc_expiry_date: updatedData.fc_expiry_date,
                rc_book_url: updatedData.rc_book_url,
                fc_certificate_url: updatedData.fc_certificate_url,
                status: (updatedData.status || 'ACTIVE').toUpperCase()
            };

            const response = await busService.updateBus(updatedData.id, payload);
            
            // Refetch or update local state with response
            // For now, simpler to just update local state slightly to match view model
            const newBusModel = {
                ...updatedData,
                // ensure we keep the view model consistent
                busNumber: response.registration_number || updatedData.busNumber,
                capacity: response.seating_capacity || updatedData.capacity,
                status: response.status ? (response.status.charAt(0).toUpperCase() + response.status.slice(1).toLowerCase()) : updatedData.status
            };

            setBuses(buses.map(b => b.id === updatedData.id ? newBusModel : b));
            setSelectedBus(newBusModel);
        } catch (err) {
            console.error("Failed to update bus:", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Maintenance': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Inactive': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };


    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className='ml-20 lg:ml-0'>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {selectedBus ? 'Bus Details' : 'Bus Management'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedBus ? `Viewing details for ${selectedBus.busNumber}` : 'Manage fleet and assign drivers'}
                        </p>
                    </div>

                    {!selectedBus && (
                        <div className="flex items-center gap-3">
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab('All')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'All' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    All Buses
                                </button>
                                <button
                                    onClick={() => setActiveTab('Scrap')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'Scrap' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Scrap Buses
                                </button>
                            </div>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search buses..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 w-64 bg-indigo-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                                />
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                        </div>
                    )}

                    {selectedBus && (
                        <button 
                            onClick={() => setSelectedBus(null)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 bg-gray-100 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
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
                        <p className="text-gray-500 font-medium">Loading fleet data...</p>
                    </div>
                ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-xl border border-red-100">
                         <p className="text-red-500 font-bold mb-4">{error}</p>
                         <button onClick={fetchData} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95">Retry</button>
                    </div>
                ) : selectedBus ? (
                    <BusDetail
                        selectedBus={selectedBus}
                        drivers={drivers}
                        onBack={() => setSelectedBus(null)}
                        onUpdate={handleUpdate}
                        getStatusColor={getStatusColor}
                    />
                ) : (
                    <BusList
                        filteredBuses={filteredBuses}
                        drivers={drivers}
                        setSelectedBus={setSelectedBus}
                        handleStatusChange={handleStatusChange}
                        handleDriverChange={handleDriverChange}
                        handleDelete={handleDelete}
                        activeMenuId={activeMenuId}
                        setActiveMenuId={setActiveMenuId}
                        getStatusColor={getStatusColor}
                    />
                )}
            </div>

            {!selectedBus && !loading && (
                <button
                    onClick={() => setShowModal(true)}
                    className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
                    style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                >
                    <FontAwesomeIcon icon={faBus} className="text-xl sm:text-2xl" />
                </button>
            )}

            <AddBusForm
                show={showModal}
                onClose={() => setShowModal(false)}
                onAdd={handleAdd}
                drivers={drivers}
                routes={routes}
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
                                Are you sure you want to delete this bus record? This action cannot be undone and will remove all associated data.
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

export default BusManagementHome;
