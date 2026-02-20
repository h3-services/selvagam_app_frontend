import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faTrash, faMapLocationDot, faCircleNotch, faArchive, faRoute, faUndo, faCheck, faChevronDown, faUsers } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import RouteList from './RouteList';
import RouteDetail from './RouteDetail';
import AddRouteForm from './AddRouteForm';
import BusReassignModal from './BusReassignModal';
import { routeService } from '../../services/routeService';

import { driverService } from '../../services/driverService';
import { busService } from '../../services/busService';
import { studentService } from '../../services/studentService';

const RouteManagementHome = () => {
    const [routes, setRoutes] = useState([]);
    const [activeBuses, setActiveBuses] = useState([]); // Renamed to avoid confusion, mapped for modal
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Active'); // New state for tabs
    const [selectedRoutes, setSelectedRoutes] = useState([]); // New state for checkboxes
    const [showBulkMenu, setShowBulkMenu] = useState(false); // New state for bulk menu

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [routesDataRaw, stopsDataRaw, busesDataRaw, driversDataRaw, studentsDataRaw] = await Promise.all([
                routeService.getAllRoutes().catch(err => { console.error("Routes fetch failed:", err); return []; }),
                routeService.getAllRouteStops().catch(err => { console.error("Stops fetch failed:", err); return []; }),
                busService.getAllBuses().catch(err => { console.error("Buses fetch failed:", err); return []; }),
                driverService.getAllDrivers().catch(err => { console.error("Drivers fetch failed:", err); return []; }),
                studentService.getAllStudents().catch(err => { console.error("Students fetch failed:", err); return []; })
            ]);

            // 1. Deduplicate source data by ID immediately to prevent "double" entries from server sync issues
            const routesData = Array.from(new Map((routesDataRaw || []).filter(r => r && r.route_id).map(r => [r.route_id, r])).values());
            const stopsData = Array.from(new Map((stopsDataRaw || []).filter(s => s && s.stop_id).map(s => [s.stop_id, s])).values());
            const busesData = Array.from(new Map((busesDataRaw || []).filter(b => b && b.bus_id).map(b => [b.bus_id, b])).values());
            const driversData = Array.from(new Map((driversDataRaw || []).filter(d => d && d.driver_id).map(d => [d.driver_id, d])).values());
            const studentsData = studentsDataRaw || [];

            // Create Driver Map (id -> name)
            const driverMap = {};
            driversData.forEach(d => {
                if (d && d.driver_id) driverMap[d.driver_id] = d.name;
            });

            // Create a lookup for bus assigned to route (route_id -> bus_number)
            const routeBusMap = {};
            // Map buses for reassign modal
            const mappedBuses = [];

            if (Array.isArray(busesData)) {
                busesData.forEach(bus => {
                    const busName = bus.bus_name || bus.name || bus.registration_number || bus.bus_number || 'Unknown Bus';
                    const driverName = bus.driver_name || (bus.driver_id ? driverMap[bus.driver_id] : 'Unassigned');
                    
                    if (bus.route_id) {
                        routeBusMap[bus.route_id] = busName;
                    }

                    mappedBuses.push({
                        busNumber: busName, // Kept key as busNumber for minimal code change, but value is now name
                        capacity: bus.seating_capacity || 0,
                        status: bus.status ? (bus.status.charAt(0).toUpperCase() + bus.status.slice(1).toLowerCase()) : 'Inactive',
                        driverName: driverName,
                        id: bus.bus_id
                    });
                });
            }
            
            // Strict filter: Only show buses that are explicitly 'Active' (case-insensitive)
            // This prevents buses in 'Scrap', 'Maintenance', or 'Spare' status from appearing in route assignment
            const onlyActiveBuses = mappedBuses.filter(b => 
                (b.status || '').trim().toUpperCase() === 'ACTIVE'
            );
            setActiveBuses(onlyActiveBuses);

            // Transform and merge data
            const mappedRoutes = await Promise.all(routesData.map(async (route) => {
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

                // Calculate student count locally from fetched studentsData
                const studentCount = (studentsData || []).filter(s => s.pickup_route_id === route.route_id || s.drop_route_id === route.route_id).length;

                return {
                    id: route.route_id,
                    routeName: route.name,
                    distance: 'N/A', // Not in API yet
                    assignedBus: routeBusMap[route.route_id] || 'Unassigned',
                    stops: routeStops.length,
                    studentCount: studentCount,
                    stopPoints: stopPoints,
                    coordinates: {
                        start: startCoord,
                        end: endCoord
                    },
                    status: route.routes_active_status,
                    originalData: route
                };
            }));

            setRoutes(mappedRoutes);
        } catch (error) {
            console.error("Failed to fetch route data:", error);
        } finally {
            setLoading(false);
        }
    };

    const [isSaving, setIsSaving] = useState(false);
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

    // Mock School Locations removed as per system settings update
    const schoolLocations = [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Maintenance': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Inactive': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    const handleReassignBus = async (routeId, bus) => {
        try {
            await busService.assignRoute(bus.id, routeId);
            const newBusNumber = bus.busNumber;
            
            setRoutes(routes.map(r => r.id === routeId ? { ...r, assignedBus: newBusNumber } : r));
            if (selectedRoute && selectedRoute.id === routeId) {
                setSelectedRoute({ ...selectedRoute, assignedBus: newBusNumber });
            }
        } catch (error) {
            console.error("Failed to reassign bus:", error);
            // alert("Failed to reassign bus. Please try again.");
        } finally {
            setShowBusReassignModal(false);
            setReassigningRouteId(null);
        }
    };

    const openBusReassignModal = (routeId, e) => {
        if (e) e.stopPropagation();
        setReassigningRouteId(routeId);
        setShowBusReassignModal(true);
    };

    const filteredRoutes = useMemo(() => {
        return routes.filter(r => {
            const isInactive = (r.status || '').toUpperCase() === 'INACTIVE';
            const matchesSearch = r.routeName.toLowerCase().includes(search.toLowerCase());
            
            if (activeTab === 'Archived') {
                return isInactive && matchesSearch;
            } else {
                return !isInactive && matchesSearch;
            }
        });
    }, [routes, search, activeTab]);

    const handleRestore = async (id) => {
        try {
            await routeService.updateRouteStatus(id, 'ACTIVE');
            await fetchAllData();
        } catch (error) {
            console.error("Failed to restore route:", error);
        }
    };

    const handleBulkStatusUpdate = async (status) => {
        if (!selectedRoutes.length) return;
        try {
            await Promise.all(selectedRoutes.map(route => 
                routeService.updateRouteStatus(route.id, status)
            ));
            await fetchAllData();
            setSelectedRoutes([]);
            setShowBulkMenu(false);
        } catch (error) {
            console.error(`Failed to bulk update routes to ${status}:`, error);
        }
    };

    const handleAdd = async (newRouteData) => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            // 1. Create the Route
            const routePayload = {
                name: newRouteData.routeName,
                routes_active_status: 'ACTIVE'
            };
            console.log('📦 [CREATE ROUTE] Payload:', JSON.stringify(routePayload, null, 2));
            const createdRoute = await routeService.createRoute(routePayload);
            console.log('✅ [CREATE ROUTE] Response:', JSON.stringify(createdRoute, null, 2));

            // 2. Create Stops (if any)
            if (newRouteData.stopPoints && newRouteData.stopPoints.length > 0) {
                for (let index = 0; index < newRouteData.stopPoints.length; index++) {
                    const stop = newRouteData.stopPoints[index];
                    const stopData = {
                        route_id: createdRoute.route_id,
                        stop_name: (stop.name || 'Stop').trim(),
                        latitude: parseFloat(parseFloat(stop.position[0]).toFixed(6)),
                        longitude: parseFloat(parseFloat(stop.position[1]).toFixed(6)),
                        pickup_stop_order: index + 1,
                        drop_stop_order: index + 1
                    };
                    console.log(`📦 [CREATE STOP ${index + 1}] Payload:`, JSON.stringify(stopData, null, 2));
                    const createdStop = await routeService.createRouteStop(stopData);
                    console.log(`✅ [CREATE STOP ${index + 1}] Response:`, JSON.stringify(createdStop, null, 2));
                }
            }

            // 3. Assign Bus (if selected)
            if (newRouteData.busId) {
                console.log(`🚌 [ASSIGN BUS] Assigning bus ${newRouteData.busId} to route ${createdRoute.route_id}`);
                await busService.assignRoute(newRouteData.busId, createdRoute.route_id);
                console.log('✅ [ASSIGN BUS] Done');
            }

            await fetchAllData();
            setShowModal(false);
        } catch (error) {
            console.error("Failed to create route:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            try {
                // Change status to INACTIVE instead of deleting
                await routeService.updateRouteStatus(itemToDelete, 'INACTIVE');
                await fetchAllData();
                setItemToDelete(null);
                setShowDeleteConfirm(false);
            } catch (error) {
                console.error("Failed to deactivate route:", error);
                // alert("Failed to deactivate route.");
            }
        }
    };

    const handleUpdate = async (updatedData) => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            console.log('🔄 [UPDATE ROUTE] Starting update for route:', updatedData.id);
            console.log('🔄 [UPDATE ROUTE] Full updatedData:', JSON.stringify(updatedData, null, 2));

            // 1. Handle Deleted Stops
            const originalStops = selectedRoute.stopPoints || [];
            const currentStops = updatedData.stopPoints || [];
            
            console.log('📋 [ORIGINAL STOPS]:', JSON.stringify(originalStops, null, 2));
            console.log('📋 [CURRENT STOPS]:', JSON.stringify(currentStops, null, 2));

            const originalStopIds = new Set(originalStops.map(s => s.id).filter(id => id));
            const currentStopIds = new Set(currentStops.map(s => s.id).filter(id => id));
            
            const stopsToDelete = [...originalStopIds].filter(id => !currentStopIds.has(id));
            console.log('🗑️ [STOPS TO DELETE]:', stopsToDelete);
            
            // Delete removed stops
            for (const id of stopsToDelete) {
                console.log(`🗑️ [DELETE STOP] Deleting stop: ${id}`);
                await routeService.deleteRouteStop(id).catch(e => console.warn(`Stop ${id} already gone:`, e));
            }

            // 2. Handle New Stops (Sequential to avoid order conflicts)
            const newStops = currentStops.filter(s => !s.id);
            console.log(`➕ [NEW STOPS] ${newStops.length} new stops to create`);
            for (const stop of newStops) {
                const order = currentStops.indexOf(stop) + 1;
                const newStopPayload = {
                    route_id: updatedData.id,
                    stop_name: (stop.name || '').trim(),
                    latitude: parseFloat(parseFloat(stop.position[0]).toFixed(6)),
                    longitude: parseFloat(parseFloat(stop.position[1]).toFixed(6)),
                    pickup_stop_order: parseInt(order),
                    drop_stop_order: parseInt(order)
                };
                console.log(`📦 [CREATE STOP order:${order}] Payload:`, JSON.stringify(newStopPayload, null, 2));
                try {
                    const result = await routeService.createRouteStop(newStopPayload);
                    console.log(`✅ [CREATE STOP order:${order}] Response:`, JSON.stringify(result, null, 2));
                } catch (error) {
                    if (error.response && error.response.status === 500 && error.response.data?.detail?.includes('Duplicate entry')) {
                        console.warn(`⚠️ Stop with order ${order} already exists, skipping.`);
                    } else {
                        throw error;
                    }
                }
            }

            // 3. Handle Updated Stops — ONLY update stops that actually changed
            const existingStops = currentStops.filter(s => s.id);
            const originalStopMap = {};
            originalStops.forEach(s => { if (s.id) originalStopMap[s.id] = s; });

            console.log(`✏️ [EXISTING STOPS] ${existingStops.length} existing stops to check`);
            for (const stop of existingStops) {
                const order = currentStops.indexOf(stop) + 1;
                const original = originalStopMap[stop.id];

                // Check if anything actually changed
                const nameChanged = original && (stop.name || '').trim() !== (original.name || '').trim();
                const posChanged = original && (
                    parseFloat(parseFloat(stop.position[0]).toFixed(6)) !== parseFloat(parseFloat(original.position[0]).toFixed(6)) ||
                    parseFloat(parseFloat(stop.position[1]).toFixed(6)) !== parseFloat(parseFloat(original.position[1]).toFixed(6))
                );
                const orderChanged = original && order !== (original.order || 0);

                if (!nameChanged && !posChanged && !orderChanged) {
                    console.log(`⏭️ [SKIP STOP ${stop.id} order:${order}] No changes detected.`);
                    continue;
                }

                const stopPayload = {
                    route_id: updatedData.id,
                    stop_name: (stop.name || '').trim(),
                    latitude: parseFloat(parseFloat(stop.position[0]).toFixed(6)),
                    longitude: parseFloat(parseFloat(stop.position[1]).toFixed(6)),
                    pickup_stop_order: parseInt(order),
                    drop_stop_order: parseInt(order)
                };
                console.log(`📦 [UPDATE STOP ${stop.id} order:${order}] Payload:`, JSON.stringify(stopPayload, null, 2));

                try {
                    const result = await routeService.updateRouteStop(stop.id, stopPayload);
                    console.log(`✅ [UPDATE STOP ${stop.id}] Response:`, JSON.stringify(result, null, 2));
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        console.warn(`⚠️ Stop ${stop.id} missing, skipping (backend issue).`);
                    } else if (error.response && error.response.status === 500 && error.response.data?.detail?.includes('Duplicate entry')) {
                        console.warn(`⚠️ Order collision at ${order} for stop ${stop.id}, skipping.`);
                    } else {
                        throw error;
                    }
                }
            }

            // 4. Update Route Details (if name changed)
            if (updatedData.routeName !== selectedRoute.routeName) {
                const routeUpdatePayload = { 
                    name: updatedData.routeName,
                    routes_active_status: updatedData.status || 'ACTIVE' 
                };
                console.log('📦 [UPDATE ROUTE NAME] Payload:', JSON.stringify(routeUpdatePayload, null, 2));
                await routeService.updateRoute(updatedData.id, routeUpdatePayload);
                console.log('✅ [UPDATE ROUTE NAME] Done');
            }

            // Refresh Data
            await fetchAllData();
            setSelectedRoute(null);
        } catch (error) {
            console.error("Error updating route:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            {/* Header - Hidden when viewing details */}
            {!selectedRoute && (
                <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 sticky top-0 z-30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className='ml-20 lg:ml-0'>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Route Management
                            </h1>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* View Mode Toggle (Segmented Control) */}
                            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
                                <button
                                    onClick={() => setActiveTab('Active')}
                                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                                        activeTab === 'Active' 
                                        ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' 
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Total routes
                                </button>
                                <button
                                    onClick={() => setActiveTab('Archived')}
                                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                                        activeTab === 'Archived' 
                                        ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' 
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Archived Records
                                </button>
                            </div>

                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search routes..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 w-64 md:w-80 bg-blue-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                                />
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            )}



            {/* Grid Content */}
            <div className="flex-1 px-2 lg:px-8 pt-4 pb-4 overflow-hidden flex flex-col w-full">
                <div className="flex-1 flex flex-col min-h-0 lg:bg-white lg:rounded-[2.5rem] lg:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] lg:border lg:border-white lg:px-6 lg:pt-2 lg:pb-3 overflow-hidden">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-2xl text-blue-600" />
                            </div>
                            <p className="text-gray-500 font-medium tracking-wide">Loading...</p>
                        </div>
                    ) : selectedRoute ? (
                        <RouteDetail
                            selectedRoute={selectedRoute}
                            onBack={() => setSelectedRoute(null)}
                            onUpdate={fetchAllData}
                            onDelete={handleDelete}
                            onEdit={(route) => {
                                setEditingRoute(route);
                                setShowModal(true);
                            }}
                        />
                    ) : (
                        <RouteList
                            filteredRoutes={filteredRoutes}
                            setSelectedRoute={setSelectedRoute}
                            handleDelete={handleDelete}
                            activeMenuId={activeMenuId}
                            setActiveMenuId={setActiveMenuId}
                            onSelectionChanged={setSelectedRoutes}
                        />
                    )}
                </div>
            </div>

            {!selectedRoute && !loading && !showBulkMenu && (
                <button
                    onClick={() => setShowModal(true)}
                    className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-[24px] shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center z-40"
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
                availableBuses={activeBuses}
                isSaving={isSaving}
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
                            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
                                <FontAwesomeIcon icon={faTrash} className="text-2xl text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Deactivate Route</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                Are you sure you want to deactivate this route? It will be marked as inactive in the registry but the historical data will be preserved.
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
                                    className="flex-1 px-4 py-3 rounded-xl bg-amber-600 text-white font-bold text-sm hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all active:scale-95"
                                >
                                    Deactivate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Bulk Selection Menu */}
            {selectedRoutes.length > 0 && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[2002] flex flex-col items-center gap-4">
                    {showBulkMenu && (
                        <div className="bg-white/95 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-2 w-64 animate-in slide-in-from-bottom-8 zoom-in duration-300 origin-bottom">
                            <div className="px-4 py-3 text-[11px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 flex items-center justify-between mb-2">
                                <span>Bulk Operations</span>
                                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[9px] shadow-sm">
                                    {selectedRoutes.length} Selected
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="px-3 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Update Route Status</div>
                                
                                <button 
                                    onClick={() => handleBulkStatusUpdate('ACTIVE')}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-emerald-50 active:bg-emerald-100 rounded-xl transition-all group"
                                >
                                    Mark as Active
                                </button>

                                <button 
                                    onClick={() => handleBulkStatusUpdate('INACTIVE')}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-amber-50 active:bg-amber-100 rounded-xl transition-all group"
                                >
                                    Move to Archive
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={() => setShowBulkMenu(!showBulkMenu)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.15)] transition-all active:scale-95 group border-2 ${
                            showBulkMenu 
                            ? 'bg-slate-900 border-slate-700 text-white' 
                            : 'bg-white border-white text-blue-600 hover:shadow-[0_20px_45px_rgba(0,0,0,0.2)]'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            showBulkMenu ? 'bg-white/10' : 'bg-blue-600 text-white'
                        }`}>
                            <FontAwesomeIcon icon={showBulkMenu ? faCheck : faUsers} className="text-xs" />
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${showBulkMenu ? 'text-slate-400' : 'text-blue-500'}`}>
                                {selectedRoutes.length} Routes Selected
                            </span>
                            <span className={`text-[13px] font-bold mt-0.5 ${showBulkMenu ? 'text-white' : 'text-slate-900'}`}>
                                {showBulkMenu ? 'Close Selection Menu' : 'Actions for Selected'}
                            </span>
                        </div>
                        <FontAwesomeIcon 
                            icon={faChevronDown} 
                            className={`text-[10px] transition-transform duration-300 ml-2 ${showBulkMenu ? 'rotate-180 text-slate-400' : 'text-blue-300'}`} 
                        />
                    </button>
                </div>
            )}
        </div>
    );
};

export default RouteManagementHome;
