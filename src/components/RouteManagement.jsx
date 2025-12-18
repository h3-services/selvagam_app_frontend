import { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot, faTrash, faCheck, faTimes, faSearch, faEdit, faEye, faRoute, faLocationDot, faBus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const RouteManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [newRoute, setNewRoute] = useState({ routeName: '', startPoint: '', endPoint: '', distance: '', assignedBus: '', stops: 0 });

    // Mock data with coordinates for Hyderabad/India locations as example
    const [routes, setRoutes] = useState([
        {
            id: 1,
            routeName: 'Route A - Downtown',
            startPoint: 'City School',
            endPoint: 'Central Station',
            distance: '12 km',
            assignedBus: 'BUS-101',
            stops: 8,
            coordinates: {
                start: [17.4401, 78.3489], // Gachibowli area (School)
                end: [17.3850, 78.4867]    // Hyderabad Charminar area
            }
        },
        {
            id: 2,
            routeName: 'Route B - Westside',
            startPoint: 'City School',
            endPoint: 'West Mall',
            distance: '18 km',
            assignedBus: 'BUS-104',
            stops: 12,
            coordinates: {
                start: [17.4401, 78.3489], // School
                end: [17.4375, 78.4483]    // Ameerpet
            }
        },
        {
            id: 3,
            routeName: 'Route C - North Hills',
            startPoint: 'City School',
            endPoint: 'North park',
            distance: '22 km',
            assignedBus: 'BUS-107',
            stops: 15,
            coordinates: {
                start: [17.4401, 78.3489], // School
                end: [17.5169, 78.3428]    // Miyapur
            }
        },
        {
            id: 4,
            routeName: 'Route D - East Lake',
            startPoint: 'City School',
            endPoint: 'Lake View',
            distance: '15 km',
            assignedBus: 'BUS-106',
            stops: 10,
            coordinates: {
                start: [17.4401, 78.3489], // School
                end: [17.4567, 78.3768]    // Kondapur
            }
        },
        {
            id: 5,
            routeName: 'Route E - South Gate',
            startPoint: 'City School',
            endPoint: 'South Residency',
            distance: '25 km',
            assignedBus: 'BUS-102',
            stops: 18,
            coordinates: {
                start: [17.4401, 78.3489], // School
                end: [17.2403, 78.4294]    // Shamshabad
            }
        },
    ]);

    const [search, setSearch] = useState('');
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    const filteredRoutes = useMemo(() => {
        return routes.filter(r =>
            r.routeName.toLowerCase().includes(search.toLowerCase()) ||
            r.startPoint.toLowerCase().includes(search.toLowerCase()) ||
            r.endPoint.toLowerCase().includes(search.toLowerCase())
        );
    }, [routes, search]);

    const handleAdd = () => {
        if (newRoute.routeName && newRoute.startPoint) {
            setRoutes([...routes, {
                id: Date.now(),
                ...newRoute,
                coordinates: { // Default coordinates for new routes
                    start: [17.3850, 78.4867],
                    end: [17.4401, 78.3489]
                }
            }]);
            setNewRoute({ routeName: '', startPoint: '', endPoint: '', distance: '', assignedBus: '', stops: 0 });
            setShowModal(false);
        }
    };

    const handleDelete = (id) => {
        setRoutes(routes.filter(r => r.id !== id));
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...selectedRoute });
    };

    const handleSaveEdit = () => {
        setRoutes(routes.map(r => r.id === editData.id ? editData : r));
        setSelectedRoute(editData);
        setIsEditing(false);
    };

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 h-auto flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold ml-15 lg:ml-0">Route Management</h2>
                    <p className="text-sm text-gray-500 mt-1 ml-15 lg:ml-0">Optimize travel paths and stops</p>
                </div>
                <div className="w-full sm:w-auto relative sm:min-w-[300px]">
                    <input
                        type="text"
                        placeholder="Search routes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-5 py-3 pl-12 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-100 focus:border-purple-400 focus:bg-white shadow-sm hover:shadow-md transition-all text-sm outline-none"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                </div>
            </div>

            {!selectedRoute && (
                <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="font-bold" style={{ color: '#40189d' }}>Table</span>
                    </div>
                </div>
            )}

            {selectedRoute && (
                <div className="mb-4 flex items-center gap-4">
                    <button
                        onClick={() => { setSelectedRoute(null); setIsEditing(false); }}
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

            <div className="flex-1 overflow-hidden">
                {selectedRoute ? (
                    <div className="h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                        <div className="relative p-5 shrink-0" style={{ backgroundColor: '#40189d' }}>
                            <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg bg-white/20 backdrop-blur-sm border-2 border-white/30">
                                            <FontAwesomeIcon icon={faMapLocationDot} />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedRoute.routeName}</h2>
                                        <p className="text-white/80 text-xs font-medium">Total Distance: {selectedRoute.distance}</p>
                                    </div>
                                </div>
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/40 text-white rounded-lg hover:bg-white/30 transition-all text-sm font-medium">
                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />Cancel
                                        </button>
                                        <button onClick={handleSaveEdit} className="px-4 py-2 bg-white text-black rounded-lg hover:shadow-lg transition-all text-sm font-medium">
                                            <FontAwesomeIcon icon={faCheck} className="mr-1" />Save
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={handleEdit} className="px-4 py-2 bg-white text-black rounded-lg hover:shadow-lg transition-all text-sm font-medium">
                                        <FontAwesomeIcon icon={faEdit} className="mr-1" />Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 p-5 relative min-h-[400px]">
                            {/* Map Container */}
                            <div className="absolute inset-5 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
                                <MapContainer
                                    center={selectedRoute.coordinates?.start || [17.3850, 78.4867]}
                                    zoom={11}
                                    style={{ height: '100%', width: '100%' }}
                                    scrollWheelZoom={true}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    />

                                    {/* Start Marker */}
                                    <Marker position={selectedRoute.coordinates?.start || [17.3850, 78.4867]}>
                                        <Popup>
                                            <div className="font-bold">Start: {selectedRoute.startPoint}</div>
                                        </Popup>
                                    </Marker>

                                    {/* End Marker */}
                                    <Marker position={selectedRoute.coordinates?.end || [17.4401, 78.3489]}>
                                        <Popup>
                                            <div className="font-bold">End: {selectedRoute.endPoint}</div>
                                        </Popup>
                                    </Marker>

                                    {/* Route Line */}
                                    <Polyline
                                        positions={[
                                            selectedRoute.coordinates?.start || [17.3850, 78.4867],
                                            selectedRoute.coordinates?.end || [17.4401, 78.3489]
                                        ]}
                                        color="#40189d"
                                        weight={4}
                                        opacity={0.7}
                                        dashArray="10, 10"
                                    />
                                </MapContainer>

                                {/* Floating Detail Cards over Map */}
                                <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 w-64 pointer-events-none">
                                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-purple-100 pointer-events-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                                <FontAwesomeIcon icon={faLocationDot} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Start Point</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{selectedRoute.startPoint}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-purple-100 pointer-events-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                                                <FontAwesomeIcon icon={faLocationDot} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400">End Point</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{selectedRoute.endPoint}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block w-full bg-white rounded-3xl shadow-xl overflow-hidden p-6">
                            <div className="ag-theme-quartz w-full" style={{
                                height: 'calc(100vh - 220px)',
                                '--ag-header-background-color': '#f8f5ff',
                                '--ag-header-foreground-color': '#40189d',
                                '--ag-font-family': 'inherit',
                                '--ag-border-radius': '16px',
                                '--ag-row-hover-color': '#faf5ff',
                            }}>
                                <AgGridReact
                                    rowData={filteredRoutes}
                                    columnDefs={[
                                        {
                                            headerName: "Route Name",
                                            field: "routeName",
                                            flex: 1.5,
                                            cellRenderer: (params) => (
                                                <div className="flex items-center gap-3 h-full">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                                        <FontAwesomeIcon icon={faRoute} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 leading-tight">{params.value}</p>
                                                    </div>
                                                </div>
                                            )
                                        },
                                        {
                                            headerName: "Start Point",
                                            field: "startPoint",
                                            flex: 1,
                                            cellStyle: { display: 'flex', alignItems: 'center' }
                                        },
                                        {
                                            headerName: "End Point",
                                            field: "endPoint",
                                            flex: 1,
                                            cellStyle: { display: 'flex', alignItems: 'center' }
                                        },
                                        {
                                            headerName: "Distance",
                                            field: "distance",
                                            flex: 0.8,
                                            cellStyle: { display: 'flex', alignItems: 'center', fontWeight: 'bold' }
                                        },
                                        {
                                            headerName: "Bus",
                                            field: "assignedBus",
                                            flex: 0.8,
                                            cellRenderer: (params) => (
                                                <div className="flex items-center h-full">
                                                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md font-bold text-xs">
                                                        {params.value}
                                                    </span>
                                                </div>
                                            )
                                        },
                                        {
                                            headerName: "Actions",
                                            field: "id",
                                            width: 120,
                                            sortable: false,
                                            filter: false,
                                            cellRenderer: (params) => (
                                                <div className="flex items-center gap-2 h-full">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelectedRoute(params.data); }}
                                                        className="w-8 h-8 rounded-lg text-purple-700 bg-purple-100 hover:bg-purple-200 transition-all flex items-center justify-center"
                                                        title="View Details"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} size="sm" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(params.data.id); }}
                                                        className="w-8 h-8 rounded-lg text-red-700 bg-red-100 hover:bg-red-200 transition-all flex items-center justify-center"
                                                        title="Delete"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} size="sm" />
                                                    </button>
                                                </div>
                                            )
                                        }
                                    ]}
                                    defaultColDef={{
                                        sortable: true,
                                        filter: true,
                                        resizable: true,
                                        headerClass: "font-bold uppercase text-xs tracking-wide",
                                    }}
                                    rowHeight={80}
                                    headerHeight={50}
                                    pagination={true}
                                    paginationPageSize={5}
                                    paginationPageSizeSelector={[5, 10, 20, 50]}
                                    overlayNoRowsTemplate='<span class="p-4">No routes found</span>'
                                />
                            </div>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden p-4 space-y-4">
                            {filteredRoutes.map((route) => (
                                <div key={route.id} className="relative bg-white rounded-3xl shadow-xl overflow-hidden" style={{ border: '2px solid #e9d5ff' }}>
                                    <div className="relative p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: '#40189d' }}>
                                                    <FontAwesomeIcon icon={faRoute} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg">{route.routeName}</h3>
                                                    <p className="text-xs font-bold text-gray-500 mt-1">{route.distance}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(route.id)}
                                                className="w-10 h-10 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-all flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                                <p className="text-xs text-gray-500 font-medium">Start</p>
                                                <p className="text-sm text-gray-900 font-bold truncate">{route.startPoint}</p>
                                            </div>
                                            <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                                <p className="text-xs text-gray-500 font-medium">End</p>
                                                <p className="text-sm text-gray-900 font-bold truncate">{route.endPoint}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedRoute(route)}
                                            className="w-full py-3.5 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                                            style={{ backgroundColor: '#40189d' }}
                                        >
                                            <FontAwesomeIcon icon={faEye} className="mr-2" /> View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {/* Add Button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
                style={{ backgroundColor: COLORS.SIDEBAR_BG }}
            >
                <FontAwesomeIcon icon={faMapLocationDot} className="text-xl sm:text-2xl" />
            </button>

            {/* Add Route Modal */}
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowModal(false)}></div>
                    <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-gradient-to-br from-purple-50 to-white shadow-2xl z-50 flex flex-col">
                        <div className="relative p-8 border-b border-purple-100">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-100 transition"
                                style={{ color: COLORS.SIDEBAR_BG }}
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
                                    <FontAwesomeIcon icon={faMapLocationDot} className="text-white text-2xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl" style={{ color: COLORS.SIDEBAR_BG }}>Add New Route</h3>
                                    <p className="text-gray-500 text-sm">Create a new travel route</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Route Name</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                            <FontAwesomeIcon icon={faMapLocationDot} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="e.g. Route A - Downtown"
                                            value={newRoute.routeName}
                                            onChange={(e) => setNewRoute({ ...newRoute, routeName: e.target.value })}
                                            className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Start Point</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                            <FontAwesomeIcon icon={faLocationDot} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Starting location"
                                            value={newRoute.startPoint}
                                            onChange={(e) => setNewRoute({ ...newRoute, startPoint: e.target.value })}
                                            className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>End Point</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                            <FontAwesomeIcon icon={faLocationDot} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Destination"
                                            value={newRoute.endPoint}
                                            onChange={(e) => setNewRoute({ ...newRoute, endPoint: e.target.value })}
                                            className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Distance</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                            <FontAwesomeIcon icon={faRoute} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="e.g. 15 km"
                                            value={newRoute.distance}
                                            onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })}
                                            className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Assigned Bus</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                            <FontAwesomeIcon icon={faBus} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="e.g. BUS-101"
                                            value={newRoute.assignedBus}
                                            onChange={(e) => setNewRoute({ ...newRoute, assignedBus: e.target.value })}
                                            className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-purple-100 bg-white">
                            <button
                                onClick={handleAdd}
                                className="w-full py-4 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-base"
                                style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                            >
                                <FontAwesomeIcon icon={faMapLocationDot} className="mr-2" />
                                Add Route
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RouteManagement;
