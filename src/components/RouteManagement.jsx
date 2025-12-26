import { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot, faTrash, faCheck, faTimes, faSearch, faEdit, faEye, faRoute, faLocationDot, faBus, faArrowLeft, faPlus, faSpinner, faCircle, faExchangeAlt, faChevronDown, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
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

const LocationMarker = ({ setPosition, position }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, 14, {
                animate: true,
                duration: 1.5
            });
        }
    }, [position, map]);

    return position ? (
        <Marker position={position}>
            <Popup>Selected Stop Location</Popup>
        </Marker>
    ) : null;
};

const RouteManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [newRoute, setNewRoute] = useState({ routeName: '', distance: '', assignedBus: '', stops: 0, stopPoints: [] });
    const [currentStopName, setCurrentStopName] = useState('');
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [locationSearchQuery, setLocationSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);

    // Debounce search for suggestions
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (locationSearchQuery.length > 2) {
                setIsSearchingLocation(true);
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearchQuery)}&limit=5`);
                    const data = await response.json();
                    setSearchSuggestions(data);
                } catch (error) {
                    console.error("Error searching location:", error);
                } finally {
                    setIsSearchingLocation(false);
                }
            } else {
                setSearchSuggestions([]);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [locationSearchQuery]);

    const handleSelectSuggestion = (suggestion) => {
        const { lat, lon, display_name } = suggestion;
        const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setSelectedPosition(newPos);
        // Clean up the name to just the first part if it's too long, or keep full
        // let cleanName = display_name.split(',')[0]; 
        setLocationSearchQuery(display_name);
        setSearchSuggestions([]);
    };

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
        // ... kept other routes minimal for brevity but logic adapts
    ]);

    const [search, setSearch] = useState('');
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [showBusReassignModal, setShowBusReassignModal] = useState(false);
    const [reassigningRouteId, setReassigningRouteId] = useState(null);

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

    const handleAddStop = () => {
        if (currentStopName.trim() && selectedPosition) {
            setNewRoute(prev => ({
                ...prev,
                stopPoints: [...prev.stopPoints, { name: currentStopName.trim(), position: [selectedPosition.lat, selectedPosition.lng] }],
                stops: prev.stops + 1
            }));
            setCurrentStopName('');
            setSelectedPosition(null);
            setLocationSearchQuery('');
        }
    };

    const handleRemoveStop = (index) => {
        setNewRoute(prev => ({
            ...prev,
            stopPoints: prev.stopPoints.filter((_, i) => i !== index),
            stops: prev.stops - 1
        }));
    };

    // Mock School Locations (mirroring SuperAdmin)
    const schoolLocations = [
        { id: 1, name: 'Main Campus', lat: 12.9716, lng: 77.5946 },
        { id: 2, name: 'Sports Complex', lat: 12.9279, lng: 77.6271 },
        { id: 3, name: 'City Branch', lat: 13.0358, lng: 77.5970 }
    ];



    const [selectedCampus, setSelectedCampus] = useState(schoolLocations[0].id);

    const handleAdd = () => {
        const campus = schoolLocations.find(l => l.id == selectedCampus) || schoolLocations[0];
        if (newRoute.routeName) {
            // Start and End are now static based on the selected School Campus
            const startCoords = [campus.lat, campus.lng];
            const endCoords = [campus.lat, campus.lng];

            setRoutes([...routes, {
                id: Date.now(),
                ...newRoute,
                campusId: campus.id,
                campusName: campus.name,
                coordinates: {
                    start: startCoords,
                    end: endCoords
                }
            }]);
            setNewRoute({ routeName: '', distance: '', assignedBus: '', stops: 0, stopPoints: [] });
            setCurrentStopName('');
            setSelectedPosition(null);
            setLocationSearchQuery('');
            setShowModal(false);
        }
    };


    const handleDelete = (id) => {
        setRoutes(routes.filter(r => r.id !== id));
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...selectedRoute });
        setSelectedPosition(null);
        setLocationSearchQuery('');
        setCurrentStopName('');
    };

    const handleSaveEdit = () => {
        setRoutes(routes.map(r => r.id === editData.id ? editData : r));
        setSelectedRoute(editData);
        setIsEditing(false);
    };

    const handleEditAddStop = () => {
        if (currentStopName.trim() && selectedPosition) {
            setEditData(prev => ({
                ...prev,
                stopPoints: [...(prev.stopPoints || []), { name: currentStopName.trim(), position: [selectedPosition.lat, selectedPosition.lng] }],
                stops: (prev.stops || 0) + 1
            }));
            setCurrentStopName('');
            setSelectedPosition(null);
            setLocationSearchQuery('');
        }
    };

    const handleEditRemoveStop = (index) => {
        setEditData(prev => ({
            ...prev,
            stopPoints: prev.stopPoints.filter((_, i) => i !== index),
            stops: Math.max(0, (prev.stops || 0) - 1)
        }));
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
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-white/80 text-xs font-medium">Distance: {selectedRoute.distance}</p>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
                                                <FontAwesomeIcon icon={faBus} className="text-white text-xs" />
                                                <span className="text-white font-bold text-xs">{selectedRoute.assignedBus}</span>
                                                <FontAwesomeIcon icon={faCircle} className="text-green-300 text-[5px] animate-pulse ml-0.5" />
                                            </div>
                                        </div>
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

                        <div className="flex-1 p-5 relative min-h-[600px]">
                            <div className="flex flex-col md:flex-row h-full gap-4">
                                {/* Stops List */}
                                <div className="w-full md:w-1/3 bg-gray-50 rounded-2xl p-4 overflow-y-auto max-h-[600px]">
                                    <h3 className="text-sm font-bold uppercase tracking-wide mb-4 text-gray-500">Route Stops</h3>

                                    {isEditing && (
                                        <div className="mb-4 space-y-2 border-b border-gray-200 pb-4">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder={selectedPosition ? "Stop name..." : "Select on map"}
                                                    value={currentStopName}
                                                    onChange={(e) => setCurrentStopName(e.target.value)}
                                                    className="flex-1 bg-white border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                                                    disabled={!selectedPosition}
                                                />
                                                <button
                                                    onClick={handleEditAddStop}
                                                    disabled={!currentStopName.trim() || !selectedPosition}
                                                    className={`px-3 rounded-lg text-white shadow-sm transition-all ${(!currentStopName.trim() || !selectedPosition) ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:shadow-md'}`}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-medium ml-1">
                                                {!selectedPosition ? "1. Search & Select location on map" : "2. Name the stop and click +"}
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {(isEditing ? editData.stopPoints : selectedRoute.stopPoints) && (isEditing ? editData.stopPoints : selectedRoute.stopPoints).length > 0 ? (
                                            (isEditing ? editData.stopPoints : selectedRoute.stopPoints).map((stop, index) => (
                                                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs shrink-0">
                                                            {index + 1}
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-800">{stop.name}</p>
                                                    </div>
                                                    {isEditing && (
                                                        <button
                                                            onClick={() => handleEditRemoveStop(index)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-400 text-sm">No stops added</div>
                                        )}
                                    </div>
                                </div>

                                {/* Map Container */}
                                <div className="flex-1 relative rounded-2xl overflow-hidden shadow-inner border border-gray-200 min-h-[500px]">
                                    {isEditing && (
                                        <div className="absolute top-4 left-16 right-4 z-[9999] flex flex-col gap-1">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Search location..."
                                                    value={locationSearchQuery}
                                                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                                                    className="flex-1 px-4 py-2 rounded-xl border border-purple-200 shadow-lg focus:outline-none focus:border-purple-500 text-sm bg-white/90 backdrop-blur-sm"
                                                />
                                                <div className="w-10 h-10 bg-purple-600 text-white rounded-xl shadow-lg flex items-center justify-center">
                                                    <FontAwesomeIcon icon={isSearchingLocation ? faSpinner : faSearch} className={isSearchingLocation ? "animate-spin" : ""} />
                                                </div>
                                            </div>
                                            {/* Suggestions Dropdown */}
                                            {searchSuggestions.length > 0 && (
                                                <div className="bg-white rounded-xl shadow-xl border border-purple-100 overflow-hidden max-h-48 overflow-y-auto">
                                                    {searchSuggestions.map((suggestion, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => handleSelectSuggestion(suggestion)}
                                                            className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-0 truncate"
                                                        >
                                                            {suggestion.display_name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <MapContainer
                                        center={[17.4401, 78.3489] || selectedRoute.coordinates?.start} // Default to school area
                                        zoom={11}
                                        style={{ height: '100%', width: '100%' }}
                                        scrollWheelZoom={true}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        />

                                        {isEditing && (
                                            <LocationMarker setPosition={setSelectedPosition} position={selectedPosition} />
                                        )}

                                        {/* Render all stop points */}
                                        {(isEditing ? editData.stopPoints : selectedRoute.stopPoints) && (isEditing ? editData.stopPoints : selectedRoute.stopPoints).map((stop, index) => (
                                            <Marker key={index} position={stop.position} opacity={isEditing ? 0.7 : 1}>
                                                <Popup>
                                                    <div className="font-bold">{stop.name}</div>
                                                </Popup>
                                            </Marker>
                                        ))}

                                        {/* Optional Route Line if needed, can connect all points */}
                                        {(isEditing ? editData.stopPoints : selectedRoute.stopPoints) && (isEditing ? editData.stopPoints : selectedRoute.stopPoints).length > 1 && (
                                            <Polyline
                                                positions={(isEditing ? editData.stopPoints : selectedRoute.stopPoints).map(s => s.position)}
                                                color="#40189d"
                                                weight={4}
                                                opacity={0.7}
                                                dashArray="10, 10"
                                            />
                                        )}
                                    </MapContainer>
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
                                            headerName: "Campus",
                                            field: "campusName",
                                            flex: 1,
                                            cellRenderer: (params) => (
                                                <div className="flex items-center h-full">
                                                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-bold text-xs border border-indigo-100 uppercase tracking-wide">
                                                        <FontAwesomeIcon icon={faBuilding} className="mr-1.5 opacity-70" />
                                                        {params.value || 'Main Campus'}
                                                    </span>
                                                </div>
                                            )
                                        },
                                        {
                                            headerName: "Distance",
                                            field: "distance",
                                            flex: 0.8,
                                            cellStyle: { display: 'flex', alignItems: 'center', fontWeight: 'bold' }
                                        },
                                        {
                                            headerName: "Stops",
                                            field: "stops",
                                            flex: 0.6,
                                            cellRenderer: (params) => (
                                                <div className="flex items-center h-full">
                                                    <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md font-bold text-xs border border-purple-100">
                                                        {params.value} Stops
                                                    </span>
                                                </div>
                                            )
                                        },
                                        {
                                            headerName: "Bus",
                                            field: "assignedBus",
                                            flex: 1.2,
                                            cellRenderer: (params) => (
                                                <div className="flex items-center h-full">
                                                    <button
                                                        onClick={(e) => openBusReassignModal(params.data.id, e)}
                                                        className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                                                        title="Click to reassign bus"
                                                    >
                                                        <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                                                            <FontAwesomeIcon icon={faBus} className="text-white text-xs" />
                                                        </div>
                                                        <span className="text-white font-bold text-xs tracking-wide">{params.value}</span>
                                                        <div className="flex items-center gap-1 ml-1">
                                                            <FontAwesomeIcon icon={faCircle} className="text-green-300 text-[6px] animate-pulse" />
                                                            <span className="text-green-200 text-[10px] font-medium">Active</span>
                                                        </div>
                                                        <FontAwesomeIcon icon={faExchangeAlt} className="text-white/60 text-[10px] ml-1 group-hover:text-white transition-colors" />
                                                    </button>
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
                                                <p className="text-xs text-gray-500 font-medium">Distance</p>
                                                <p className="text-sm text-gray-900 font-bold truncate">{route.distance}</p>
                                            </div>
                                            <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                                <p className="text-xs text-gray-500 font-medium mb-2">Assigned Bus</p>
                                                <button
                                                    onClick={(e) => openBusReassignModal(route.id, e)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                                                >
                                                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faBus} className="text-white text-sm" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-white font-bold text-sm">{route.assignedBus}</p>
                                                    </div>
                                                    <FontAwesomeIcon icon={faExchangeAlt} className="text-white/70 text-xs" />
                                                </button>
                                            </div>
                                            <div className="p-3 rounded-xl col-span-2" style={{ backgroundColor: '#f8f5ff' }}>
                                                <p className="text-xs text-gray-500 font-medium">Total Stops</p>
                                                <p className="text-sm text-gray-900 font-bold truncate">{route.stops} Stops</p>
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
            {!selectedRoute && (
                <button
                    onClick={() => setShowModal(true)}
                    className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
                    style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                >
                    <FontAwesomeIcon icon={faMapLocationDot} className="text-xl sm:text-2xl" />
                </button>
            )}

            {/* Add Route Modal */}
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
                    <div className="fixed right-0 top-0 h-full w-full md:w-[1100px] bg-gradient-to-br from-purple-50 to-white shadow-2xl z-50 flex flex-col">
                        <div className="relative p-6 sm:p-8 border-b border-purple-100 flex-shrink-0">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-100 transition"
                                style={{ color: COLORS.SIDEBAR_BG }}
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
                                    <FontAwesomeIcon icon={faMapLocationDot} className="text-white text-2xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl" style={{ color: COLORS.SIDEBAR_BG }}>Add New Route</h3>
                                    <p className="text-gray-500 text-sm">Create a new travel route with stops</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                                {/* Left Column: Map */}
                                <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-md border-2 border-purple-100 relative">
                                    <div className="absolute top-4 left-16 right-4 z-[9999] flex flex-col gap-1">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Search location..."
                                                value={locationSearchQuery}
                                                onChange={(e) => setLocationSearchQuery(e.target.value)}
                                                className="flex-1 px-4 py-2 rounded-xl border border-purple-200 shadow-lg focus:outline-none focus:border-purple-500 text-sm bg-white/90 backdrop-blur-sm"
                                            />
                                            <div className="w-10 h-10 bg-purple-600 text-white rounded-xl shadow-lg flex items-center justify-center">
                                                <FontAwesomeIcon icon={isSearchingLocation ? faSpinner : faSearch} className={isSearchingLocation ? "animate-spin" : ""} />
                                            </div>
                                        </div>
                                        {/* Suggestions Dropdown */}
                                        {searchSuggestions.length > 0 && (
                                            <div className="bg-white rounded-xl shadow-xl border border-purple-100 overflow-hidden max-h-48 overflow-y-auto">
                                                {searchSuggestions.map((suggestion, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => handleSelectSuggestion(suggestion)}
                                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-0 truncate"
                                                    >
                                                        {suggestion.display_name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    return (
                                    // ... (wrapper divs)
                                    <MapContainer
                                        center={[
                                            (schoolLocations.find(l => l.id == selectedCampus) || schoolLocations[0]).lat,
                                            (schoolLocations.find(l => l.id == selectedCampus) || schoolLocations[0]).lng
                                        ]}
                                        zoom={13} // Zoomed out slightly to see more context
                                        key={selectedCampus}
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        />

                                        {isEditing && (
                                            <LocationMarker setPosition={setSelectedPosition} position={selectedPosition} />
                                        )}

                                        {/* Campus Marker (Start/End) */}
                                        <Marker position={getCampusCoordinates()} icon={createSchoolIcon()}>
                                            <Popup>
                                                <div className="text-center">
                                                    <b className="text-indigo-900 text-sm">{(schoolLocations.find(l => l.id == selectedCampus) || schoolLocations[0]).name}</b>
                                                    <br />
                                                    <span className="text-xs text-gray-500">Start & End Point</span>
                                                </div>
                                            </Popup>
                                        </Marker>

                                        {/* Stop Markers (Numbered) */}
                                        {(isEditing ? editData.stopPoints : selectedRoute.stopPoints) && (isEditing ? editData.stopPoints : selectedRoute.stopPoints).map((stop, index) => (
                                            <Marker
                                                key={index}
                                                position={stop.position}
                                                icon={createStopIcon(index + 1)}
                                                opacity={isEditing ? 0.9 : 1}
                                            >
                                                <Popup>
                                                    <div className="text-center">
                                                        <span className="font-bold text-purple-700">Stop #{index + 1}</span>
                                                        <br />
                                                        <span className="text-sm font-medium">{stop.name}</span>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        ))}

                                        {/* Circular Route Line */}
                                        <Polyline
                                            positions={getRoutePath()}
                                            color="#40189d"
                                            weight={4}
                                            opacity={0.8}
                                            dashArray="10, 10"
                                        />
                                    </MapContainer>

                                    {!selectedPosition && (
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-purple-900 text-xs font-bold px-4 py-2 rounded-full pointer-events-none z-[1000] shadow-lg border border-purple-200">
                                            Click map to set stop location
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Details & Stops List */}
                                <div className="flex flex-col h-full overflow-y-auto pr-2">
                                    {/* Route Details */}
                                    <div className="space-y-4 mb-6">
                                        <h4 className="font-bold text-lg text-gray-800 border-b border-purple-100 pb-2 flex items-center gap-2">
                                            <FontAwesomeIcon icon={faRoute} className="text-purple-600" />
                                            Route Details
                                        </h4>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: COLORS.SIDEBAR_BG }}>Select Campus</label>
                                            <div className="relative">
                                                <select
                                                    value={selectedCampus}
                                                    onChange={(e) => setSelectedCampus(e.target.value)}
                                                    className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm appearance-none font-bold text-gray-700"
                                                >
                                                    {schoolLocations.map(loc => (
                                                        <option key={loc.id} value={loc.id}>
                                                            {loc.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none">
                                                    <FontAwesomeIcon icon={faChevronDown} />
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1 font-medium">Route will start and end at this campus</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: COLORS.SIDEBAR_BG }}>Route Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Route A - Downtown"
                                                value={newRoute.routeName}
                                                onChange={(e) => setNewRoute({ ...newRoute, routeName: e.target.value })}
                                                className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: COLORS.SIDEBAR_BG }}>Bus</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. BUS-101"
                                                value={newRoute.assignedBus}
                                                onChange={(e) => setNewRoute({ ...newRoute, assignedBus: e.target.value })}
                                                className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Stop Points Management */}
                                    <div className="flex flex-col flex-1">
                                        <h4 className="font-bold text-lg text-gray-800 border-b border-purple-100 pb-2 mb-4 flex items-center gap-2">
                                            <FontAwesomeIcon icon={faLocationDot} className="text-purple-600" />
                                            Stops
                                        </h4>

                                        <div className="flex gap-2 mb-4">
                                            <input
                                                type="text"
                                                placeholder={selectedPosition ? "Enter stop name..." : "Select location on map ->"}
                                                value={currentStopName}
                                                onChange={(e) => setCurrentStopName(e.target.value)}
                                                className="flex-1 bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddStop()}
                                                disabled={!selectedPosition}
                                            />
                                            <button
                                                onClick={handleAddStop}
                                                disabled={!currentStopName.trim() || !selectedPosition}
                                                className={`w-12 rounded-xl flex items-center justify-center text-white shadow-md transition-all ${(!currentStopName.trim() || !selectedPosition) ? 'bg-gray-300 cursor-not-allowed' : 'hover:shadow-lg'}`}
                                                style={{ backgroundColor: (!currentStopName.trim() || !selectedPosition) ? undefined : COLORS.SIDEBAR_BG }}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        </div>

                                        {/* List of added stops */}
                                        <div className="flex-1 overflow-y-auto bg-purple-50/50 rounded-xl p-3 border border-purple-100 min-h-[150px]">
                                            {newRoute.stopPoints && newRoute.stopPoints.length > 0 ? (
                                                <div className="space-y-2">
                                                    {newRoute.stopPoints.map((stop, index) => (
                                                        <div key={index} className="flex items-center justify-between bg-white px-3 py-3 rounded-lg border border-purple-100 shadow-sm cursor-pointer hover:border-purple-300 transition-all select-none">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                                                                    {index + 1}
                                                                </div>
                                                                <span className="text-sm font-bold text-gray-700">{stop.name}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveStop(index)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors px-2"
                                                            >
                                                                <FontAwesomeIcon icon={faTimes} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                                                    <FontAwesomeIcon icon={faMapLocationDot} className="text-3xl mb-2" />
                                                    <span className="text-xs font-bold">No stops added yet</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 border-t border-purple-100 bg-white flex-shrink-0">
                            <button
                                onClick={handleAdd}
                                className="w-full py-4 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all text-base"
                                style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                            >
                                <FontAwesomeIcon icon={faMapLocationDot} className="mr-2" />
                                Add Route
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Bus Reassignment Modal */}
            {showBusReassignModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setShowBusReassignModal(false)}></div>
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-6 border-b border-purple-100" style={{ backgroundColor: '#40189d' }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faExchangeAlt} className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Reassign Bus</h3>
                                        <p className="text-white/70 text-xs">Select a bus for this route</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowBusReassignModal(false)}
                                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 max-h-[400px] overflow-y-auto">
                            <div className="space-y-2">
                                {availableBuses.map((bus) => {
                                    const currentRoute = routes.find(r => r.id === reassigningRouteId);
                                    const isCurrentBus = currentRoute?.assignedBus === bus.busNumber;
                                    return (
                                        <button
                                            key={bus.busNumber}
                                            onClick={() => handleReassignBus(reassigningRouteId, bus.busNumber)}
                                            disabled={bus.status !== 'Active'}
                                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${isCurrentBus
                                                ? 'border-purple-500 bg-purple-50'
                                                : bus.status === 'Active'
                                                    ? 'border-gray-100 hover:border-purple-300 hover:bg-purple-50'
                                                    : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bus.status === 'Active'
                                                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
                                                        : 'bg-gray-300'
                                                        }`}>
                                                        <FontAwesomeIcon icon={faBus} className="text-white text-sm" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-gray-900">{bus.busNumber}</span>
                                                            {isCurrentBus && (
                                                                <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Current</span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500">{bus.driverName} • {bus.capacity} seats</p>
                                                    </div>
                                                </div>
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusColor(bus.status)}`}>
                                                    {bus.status}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RouteManagement;
