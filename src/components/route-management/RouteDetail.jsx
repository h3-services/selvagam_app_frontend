import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMapLocationDot, faBus, faCircle, faTimes, faCheck, faEdit, faPlus, faSpinner, faSearch } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { routeService } from '../../services/routeService';
import { LocationMarker } from './RouteMapUtils';

const RouteDetail = ({ selectedRoute, onBack, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [currentStopName, setCurrentStopName] = useState('');
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [locationSearchQuery, setLocationSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [isAddingStop, setIsAddingStop] = useState(false);

    useEffect(() => {
        if (selectedRoute) {
            setEditData({ ...selectedRoute });
        }
    }, [selectedRoute]);

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
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [locationSearchQuery]);

    const handleSelectSuggestion = (suggestion) => {
        const { lat, lon, display_name } = suggestion;
        const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setSelectedPosition(newPos);
        setLocationSearchQuery(display_name);
        setSearchSuggestions([]);
    };

    const handleSaveEdit = () => {
        onUpdate(editData);
        setIsEditing(false);
    };

    const handleEditAddStop = async () => {
        if (currentStopName.trim() && selectedPosition) {
            setIsAddingStop(true);
            try {
                if (!editData.id) {
                    console.error("Missing route ID in editData:", editData);
                    alert("Route ID is missing. Cannot add stop.");
                    setIsAddingStop(false);
                    return;
                }

                // Determine order
                const currentStops = editData.stopPoints || [];
                const order = currentStops.length + 1;

                const stopData = {
                    route_id: editData.id,
                    stop_name: currentStopName.trim(),
                    latitude: parseFloat(selectedPosition.lat.toFixed(6)),
                    longitude: parseFloat(selectedPosition.lng.toFixed(6)),
                    pickup_stop_order: parseInt(order),
                    drop_stop_order: 9 // Match the successful example from user just in case 0 is reserved
                };

                const createdStop = await routeService.createRouteStop(stopData);

                setEditData(prev => ({
                    ...prev,
                    stopPoints: [...(prev.stopPoints || []), { 
                        name: createdStop.stop_name || currentStopName.trim(), 
                        position: [createdStop.latitude || selectedPosition.lat, createdStop.longitude || selectedPosition.lng],
                        id: createdStop.stop_id 
                    }],
                    stops: (prev.stops || 0) + 1
                }));
                
                setCurrentStopName('');
                setSelectedPosition(null);
                setLocationSearchQuery('');
            } catch (error) {
                console.error("Failed to add stop:", error);
                alert("Failed to add stop. Please try again.");
            } finally {
                setIsAddingStop(false);
            }
        }
    };

    const handleEditRemoveStop = (index) => {
        setEditData(prev => ({
            ...prev,
            stopPoints: prev.stopPoints.filter((_, i) => i !== index),
            stops: Math.max(0, (prev.stops || 0) - 1)
        }));
    };

    const handleStartEditing = () => {
        setIsEditing(true);
        setSelectedPosition(null);
        setLocationSearchQuery('');
        setCurrentStopName('');
    }

    if (!selectedRoute) return null;

    return (
        <div className="h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="relative p-5 shrink-0" style={{ backgroundColor: '#40189d' }}>
                <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => { onBack(); setIsEditing(false); }}
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all mr-2"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <div className="relative">
                            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg bg-white/20 backdrop-blur-sm border-2 border-white/30">
                                <FontAwesomeIcon icon={faMapLocationDot} />
                            </div>
                        </div>
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData?.routeName}
                                    onChange={(e) => setEditData({ ...editData, routeName: e.target.value })}
                                    className="bg-transparent border-b border-white text-white font-bold text-2xl focus:outline-none placeholder-white/50"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold text-white">{selectedRoute.routeName}</h2>
                            )}

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
                        <button onClick={handleStartEditing} className="px-4 py-2 bg-white text-black rounded-lg hover:shadow-lg transition-all text-sm font-medium">
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
                                        disabled={!currentStopName.trim() || !selectedPosition || isAddingStop}
                                        className={`px-3 rounded-lg text-white shadow-sm transition-all ${(!currentStopName.trim() || !selectedPosition || isAddingStop) ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:shadow-md'}`}
                                    >
                                        <FontAwesomeIcon icon={isAddingStop ? faSpinner : faPlus} className={isAddingStop ? "animate-spin" : ""} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium ml-1">
                                    {!selectedPosition 
                                        ? "1. Search & Select location on map" 
                                        : `2. Name the stop and click + (${selectedPosition.lat.toFixed(5)}, ${selectedPosition.lng.toFixed(5)})`}
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
                            center={[12.6083, 80.0528] || selectedRoute.coordinates?.start} // Default to school area
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

                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteDetail;
