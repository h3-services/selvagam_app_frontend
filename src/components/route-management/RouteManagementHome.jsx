import { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faTrash, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import RouteList from './RouteList';
import RouteDetail from './RouteDetail';
import AddRouteForm from './AddRouteForm';
import BusReassignModal from './BusReassignModal';

const RouteManagementHome = () => {
    // Mock data with coordinates for Hyderabad/India locations as example
    const [routes, setRoutes] = useState([
        {
            id: 1,
            routeName: 'Route A - Downtown',
            distance: '12 km',
            assignedBus: 'BUS-101',
            stops: 3,
            stopPoints: [
                { name: 'City School', position: [17.4401, 78.3489] },
                { name: 'Main Street', position: [17.4201, 78.4000] },
                { name: 'Central Station', position: [17.3850, 78.4867] }
            ],
            coordinates: {
                start: [17.4401, 78.3489],
                end: [17.3850, 78.4867]
            }
        },
        {
            id: 2,
            routeName: 'Route B - Westside',
            distance: '18 km',
            assignedBus: 'BUS-104',
            stops: 2,
            stopPoints: [
                { name: 'City School', position: [17.4401, 78.3489] },
                { name: 'West Mall', position: [17.4375, 78.4483] }
            ],
            coordinates: {
                start: [17.4401, 78.3489],
                end: [17.4375, 78.4483]
            }
        },
    ]);

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

    // Available buses for assignment
    const availableBuses = [
        { busNumber: 'BUS-101', capacity: 40, status: 'Active', driverName: 'Robert Wilson' },
        { busNumber: 'BUS-102', capacity: 40, status: 'Active', driverName: 'Sarah Martinez' },
        { busNumber: 'BUS-103', capacity: 35, status: 'Maintenance', driverName: 'David Brown' },
        { busNumber: 'BUS-104', capacity: 40, status: 'Active', driverName: 'Emily Davis' },
        { busNumber: 'BUS-105', capacity: 30, status: 'Inactive', driverName: 'Michael Chen' },
        { busNumber: 'BUS-106', capacity: 40, status: 'Active', driverName: 'Jessica Taylor' },
        { busNumber: 'BUS-107', capacity: 40, status: 'Active', driverName: 'William Anderson' },
        { busNumber: 'BUS-108', capacity: 35, status: 'Maintenance', driverName: 'Olivia Thomas' },
    ];

    // Mock School Locations (mirroring SuperAdmin)
    const schoolLocations = [
        { id: 1, name: 'Main Campus', lat: 12.9716, lng: 77.5946 },
        { id: 2, name: 'Sports Complex', lat: 12.9279, lng: 77.6271 },
        { id: 3, name: 'City Branch', lat: 13.0358, lng: 77.5970 }
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

    const handleAdd = (newRouteData) => {
        setRoutes([...routes, {
            id: Date.now(),
            ...newRouteData
        }]);
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setRoutes(routes.filter(r => r.id !== itemToDelete));
            setItemToDelete(null);
            setShowDeleteConfirm(false);
        }
    };

    const handleUpdate = (updatedData) => {
        setRoutes(routes.map(r => r.id === updatedData.id ? updatedData : r));
        setSelectedRoute(updatedData);
    };

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 h-auto flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold ml-20 lg:ml-0">Route Management</h2>
                    <p className="text-sm text-gray-500 mt-1 ml-20 lg:ml-0">Optimize travel paths and stops</p>
                </div>
                <div className="w-full sm:w-auto relative sm:min-w-[300px] lg:hidden">
                    <input
                        type="text"
                        placeholder="Search routes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 pl-10 rounded-xl bg-white border border-purple-100 focus:border-purple-400 focus:bg-white transition-all text-sm outline-none shadow-sm"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {!selectedRoute && (
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-2">
                    <div className="flex flex-col items-start gap-2 w-full lg:w-auto pl-6">
                        <div className="relative w-full lg:w-96 hidden lg:block">
                            <input
                                type="text"
                                placeholder="Search routes..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 pl-10 rounded-xl bg-white border border-purple-100 focus:border-purple-400 focus:bg-white transition-all text-sm outline-none shadow-sm"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>
            )}

            {selectedRoute && (
                <div className="mb-4 flex items-center gap-4">
                    <button
                        onClick={() => setSelectedRoute(null)}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md flex items-center justify-center text-gray-600 transition-all hover:bg-gray-50"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-gray-500">Back to List</span>
                        <span style={{ color: '#40189d' }}>/</span>
                        <span style={{ color: '#40189d' }}>{selectedRoute.routeName}</span>
                    </div>
                </div>
            )}

            {selectedRoute ? (
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
                availableBuses={availableBuses}
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
