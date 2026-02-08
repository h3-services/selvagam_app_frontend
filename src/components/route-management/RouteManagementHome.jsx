import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faTrash, faMapLocationDot, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import RouteList from './RouteList';
import RouteDetail from './RouteDetail';
import AddRouteForm from './AddRouteForm';
import BusReassignModal from './BusReassignModal';
import { routeService } from '../../services/routeService';

import { driverService } from '../../services/driverService';
import { busService } from '../../services/busService';

const RouteManagementHome = () => {
    const [routes, setRoutes] = useState([]);
    const [activeBuses, setActiveBuses] = useState([]); // Renamed to avoid confusion, mapped for modal
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [routesData, stopsData, busesData, driversData] = await Promise.all([
                routeService.getAllRoutes(),
                routeService.getAllRouteStops(),
                busService.getAllBuses(),
                driverService.getAllDrivers()
            ]);

            // Create Driver Map (id -> name)
            const driverMap = {};
            if (Array.isArray(driversData)) {
                driversData.forEach(d => driverMap[d.driver_id] = d.name);
            }

            // Create a lookup for bus assigned to route (route_id -> bus_number)
            const routeBusMap = {};
            // Map buses for reassign modal
            const mappedBuses = [];

            if (Array.isArray(busesData)) {
                busesData.forEach(bus => {
                    const busNum = bus.registration_number || bus.bus_number || 'Unknown Bus';
                    const driverName = bus.driver_name || (bus.driver_id ? driverMap[bus.driver_id] : 'Unassigned');
                    
                    if (bus.route_id) {
                        routeBusMap[bus.route_id] = busNum;
                    }

                    mappedBuses.push({
                        busNumber: busNum,
                        capacity: bus.seating_capacity || 0,
                        status: bus.status ? (bus.status.charAt(0).toUpperCase() + bus.status.slice(1).toLowerCase()) : 'Inactive',
                        driverName: driverName,
                        id: bus.bus_id
                    });
                });
            }
            
            setActiveBuses(mappedBuses);

            // Transform and merge data
            const mappedRoutes = routesData.map(route => {
                // Get stops for this route
                const routeStops = stopsData.filter(stop => stop.route_id === route.route_id);
                
                // Sort stops by pickup order
                routeStops.sort((a, b) => (a.pickup_stop_order || 0) - (b.pickup_stop_order || 0));

                // Map to UI format
                const stopPoints = routeStops.map(stop => ({
                    name: stop.stop_name,
                    position: [stop.latitude, stop.longitude],
                    id: stop.stop_id,
                    order: stop.pickup_stop_order
                }));

                const startCoord = stopPoints.length > 0 ? stopPoints[0].position : [12.6083, 80.0528]; // Default fallback
                const endCoord = stopPoints.length > 0 ? stopPoints[stopPoints.length - 1].position : [12.6083, 80.0528];

                return {
                    id: route.route_id,
                    routeName: route.name,
                    distance: 'N/A', // Not in API yet
                    assignedBus: routeBusMap[route.route_id] || 'Unassigned',
                    stops: routeStops.length,
                    studentCount: Math.floor(Math.random() * 40) + 15, // Mock data for now
                    stopPoints: stopPoints,
                    coordinates: {
                        start: startCoord,
                        end: endCoord
                    },
                    status: route.routes_active_status,
                    originalData: route
                };
            });

            setRoutes(mappedRoutes);
        } catch (error) {
            console.error("Failed to fetch route data:", error);
        } finally {
            setLoading(false);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [showBusReassignModal, setShowBusReassignModal] = useState(false);
    const [reassigningRouteId, setReassigningRouteId] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    // Mock School Locations (mirroring SuperAdmin)
    const schoolLocations = [
        { id: 1, name: 'Main Campus', lat: 12.6083, lng: 80.0528 },
        { id: 2, name: 'Sports Complex', lat: 12.6100, lng: 80.0550 },
        { id: 3, name: 'City Branch', lat: 12.6050, lng: 80.0500 }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Maintenance': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Inactive': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    const handleReassignBus = (routeId, newBusNumber) => {
        setRoutes(routes.map(r => r.id === routeId ? { ...r, assignedBus: newBusNumber } : r));
        if (selectedRoute && selectedRoute.id === routeId) {
            setSelectedRoute({ ...selectedRoute, assignedBus: newBusNumber });
        }
        setShowBusReassignModal(false);
        setReassigningRouteId(null);
    };

    const openBusReassignModal = (routeId, e) => {
        if (e) e.stopPropagation();
        setReassigningRouteId(routeId);
        setShowBusReassignModal(true);
    };

    const filteredRoutes = useMemo(() => {
        return routes.filter(r =>
            r.routeName.toLowerCase().includes(search.toLowerCase())
        );
    }, [routes, search]);

    const handleAdd = async (newRouteData) => {
        try {
            // 1. Create the Route
            const routePayload = {
                name: newRouteData.routeName,
                routes_active_status: 'ACTIVE'
            };
            const createdRoute = await routeService.createRoute(routePayload);

            // 2. Create Stops (if any)
            if (newRouteData.stopPoints && newRouteData.stopPoints.length > 0) {
                await Promise.all(newRouteData.stopPoints.map((stop, index) => {
                    const stopData = {
                        route_id: createdRoute.route_id,
                        stop_name: stop.name,
                        latitude: parseFloat(stop.position[0].toFixed(6)),
                        longitude: parseFloat(stop.position[1].toFixed(6)),
                        pickup_stop_order: index + 1,
                        drop_stop_order: index + 1
                    };
                    return routeService.createRouteStop(stopData);
                }));
            }

            await fetchAllData();
            setShowModal(false);
        } catch (error) {
            console.error("Failed to create route:", error);
            // alert("Failed to create route. Please check the logs.");
        }
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            try {
                await routeService.deleteRoute(itemToDelete);
                await fetchAllData();
                setItemToDelete(null);
                setShowDeleteConfirm(false);
            } catch (error) {
                console.error("Failed to delete route:", error);
                // alert("Failed to delete route.");
            }
        }
    };

    const handleUpdate = async (updatedData) => {
        try {
            // 1. Handle Deleted Stops
            const originalStops = selectedRoute.stopPoints || [];
            const currentStops = updatedData.stopPoints || [];
            
            const originalStopIds = new Set(originalStops.map(s => s.id).filter(id => id));
            const currentStopIds = new Set(currentStops.map(s => s.id).filter(id => id));
            
            const stopsToDelete = [...originalStopIds].filter(id => !currentStopIds.has(id));
            
            // Delete removed stops
            await Promise.all(stopsToDelete.map(id => routeService.deleteRouteStop(id)));

            // 2. Handle New Stops
            const newStops = currentStops.filter(s => !s.id);
            await Promise.all(newStops.map((stop, index) => {
                const order = currentStops.indexOf(stop) + 1;
                return routeService.createRouteStop({
                    route_id: updatedData.id,
                    stop_name: stop.name,
                    latitude: stop.position[0],
                    longitude: stop.position[1],
                    pickup_stop_order: order,
                    drop_stop_order: order
                });
            }));

            // 3. Handle Updated Stops (Existing)
            const existingStops = currentStops.filter(s => s.id);
            await Promise.all(existingStops.map(async (stop) => {
                const order = currentStops.indexOf(stop) + 1;
                try {
                    return await routeService.updateRouteStop(stop.id, {
                        route_id: updatedData.id, // Adding route_id just in case
                        stop_name: stop.name,
                        latitude: stop.position[0],
                        longitude: stop.position[1],
                        pickup_stop_order: order,
                        drop_stop_order: order
                    });
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        console.warn(`Stop ${stop.id} not found on server, skipping update.`);
                        return null; 
                    }
                    throw error;
                }
            }));

            // 3. Update Route Details (if name changed)
            if (updatedData.routeName !== selectedRoute.routeName) {
                 await routeService.updateRoute(updatedData.id, { 
                    name: updatedData.routeName,
                    routes_active_status: updatedData.status || 'ACTIVE' 
                });
            }

            // Refresh Data
            await fetchAllData();
            
            // Update local selection to reflect new IDs
            // We need to find the updated route from the refreshed list
            // Since fetchAllData setsRoutes, we can't easily wait for state update here to set selectedRoute immediately
            // But fetchAllData is async.
            
            // For smoother UX, we might want to manually update selectedRoute with placeholders or just close/refresh
            // Let's just update the list for now; the user might need to re-select or we rely on the list update
             setSelectedRoute(null); // Go back to list view on save, or we'd need to re-find the route
             
        } catch (error) {
            console.error("Error updating route:", error);
            // alert("Failed to save changes. Please try again.");
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className='ml-20 lg:ml-0'>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {selectedRoute ? 'Route Details' : 'Route Management'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedRoute ? `Viewing details for ${selectedRoute.routeName}` : 'Optimize travel paths and stops'}
                        </p>
                    </div>

                    {!selectedRoute && (
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search routes..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 w-96 bg-indigo-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                                />
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                        </div>
                    )}

                    {selectedRoute && (
                        <button 
                            onClick={() => setSelectedRoute(null)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 bg-gray-100 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Back to List
                        </button>
                    )}
                </div>
            </div>



            {/* Grid Content */}
            <div className="flex-1 px-8 pt-2 pb-8 overflow-hidden flex flex-col">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl shadow-xl border border-gray-100">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faCircleNotch} spin className="text-2xl text-indigo-600" />
                        </div>
                        <p className="text-gray-500 font-medium">Loading routes...</p>
                    </div>
                ) : selectedRoute ? (
                    <RouteDetail
                        selectedRoute={selectedRoute}
                        onBack={() => setSelectedRoute(null)}
                        onUpdate={handleUpdate}
                    />
                ) : (
                    <RouteList
                        filteredRoutes={filteredRoutes}
                        setSelectedRoute={setSelectedRoute}
                        handleDelete={handleDelete}
                        activeMenuId={activeMenuId}
                        setActiveMenuId={setActiveMenuId}
                        openBusReassignModal={openBusReassignModal}
                        COLORS={COLORS}
                    />
                )}
            </div>

            {!selectedRoute && (
                <button
                    onClick={() => setShowModal(true)}
                    className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
                    style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                >
                    <FontAwesomeIcon icon={faMapLocationDot} className="text-xl sm:text-2xl" />
                </button>
            )}

            <AddRouteForm
                show={showModal}
                onClose={() => setShowModal(false)}
                onAdd={handleAdd}
                schoolLocations={schoolLocations}
            />

            <BusReassignModal
                show={showBusReassignModal}
                onClose={() => setShowBusReassignModal(false)}
                onReassign={handleReassignBus}
                availableBuses={activeBuses}
                routes={routes}
                reassigningRouteId={reassigningRouteId}
                getStatusColor={getStatusColor}
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
                                Are you sure you want to delete this route record? This action cannot be undone and will remove all associated data.
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

export default RouteManagementHome;
