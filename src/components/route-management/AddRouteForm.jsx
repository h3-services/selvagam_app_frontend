import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapLocationDot, faSearch, faCircleNotch, faChevronDown, faRoute, faLocationDot, faPlus, faBus } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { COLORS } from '../../constants/colors';
import { LocationMarker, createSchoolIcon, createStopIcon } from './RouteMapUtils';

const AddRouteForm = ({ show, onClose, onAdd, schoolLocations = [], availableBuses = [], isSaving }) => {
    // Default fallback campus if array is empty
    const defaultCampus = { id: 0, name: 'Default Campus', lat: 12.6083, lng: 80.0528 };
    const initialCampusId = schoolLocations.length > 0 ? schoolLocations[0].id : defaultCampus.id;

    const [newRoute, setNewRoute] = useState({ routeName: '', distance: '', assignedBus: '', stops: 0, stopPoints: [] });
    const [currentStopName, setCurrentStopName] = useState('');
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [locationSearchQuery, setLocationSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [selectedCampus, setSelectedCampus] = useState(initialCampusId);
    const [showBusDropdown, setShowBusDropdown] = useState(false);
    const [localSaving, setLocalSaving] = useState(false);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = () => setShowBusDropdown(false);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

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

    const handleAddRoute = () => {
        if (localSaving || isSaving) return;
        const defaultCampus = { id: 0, name: 'Default Campus', lat: 12.6083, lng: 80.0528 };
        const campus = schoolLocations.find(l => l.id == selectedCampus) || schoolLocations[0] || defaultCampus;
        if (newRoute.routeName) {
            setLocalSaving(true);
            const startCoords = [campus.lat, campus.lng];
            const endCoords = [campus.lat, campus.lng];

            onAdd({
                ...newRoute,
                campusId: campus.id,
                campusName: campus.name,
                coordinates: {
                    start: startCoords,
                    end: endCoords
                }
            });
            // Reset is handled by parent closing modal or explicitly here if needed
            // But we keep localSaving true until unmounted to be safe
        }
    };

    // Helper to get current campus coordinates
    const getCampusCoordinates = () => {
        const defaultCampus = { id: 0, name: 'Default Campus', lat: 12.6083, lng: 80.0528 };
        const campus = schoolLocations.find(l => l.id == selectedCampus) || schoolLocations[0] || defaultCampus;
        return [campus.lat, campus.lng];
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[1500]">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="fixed right-0 top-0 h-full w-full lg:w-[1100px] bg-gradient-to-br from-blue-50 to-white shadow-2xl z-[1501] flex flex-col transition-all">
                <div className="relative p-6 sm:p-8 border-b border-blue-100 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-100 transition"
                        style={{ color: COLORS.SIDEBAR_BG }}
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                    <div className="flex items-center gap-4 ml-1">
                        <div>
                            <h3 className="font-bold text-2xl" style={{ color: COLORS.SIDEBAR_BG }}>Add New Route</h3>
                            <p className="text-gray-500 text-sm">Create a new travel route with stops</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden p-6 sm:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                        {/* Left Column: Map */}
                        <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-md border-2 border-blue-100 relative">
                            <div className="absolute top-4 left-16 right-4 z-[9999] flex flex-col gap-1">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Search location..."
                                        value={locationSearchQuery}
                                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-xl border border-purple-200 shadow-lg focus:outline-none focus:border-blue-500 text-sm bg-white/90 backdrop-blur-sm"
                                    />
                                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-center">
                                        <FontAwesomeIcon icon={isSearchingLocation ? faCircleNotch : faSearch} className={isSearchingLocation ? "animate-spin" : ""} />
                                    </div>
                                </div>
                                {/* Suggestions Dropdown */}
                                {searchSuggestions.length > 0 && (
                                    <div className="bg-white rounded-xl shadow-xl border border-blue-100 overflow-hidden max-h-48 overflow-y-auto">
                                        {searchSuggestions.map((suggestion, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => handleSelectSuggestion(suggestion)}
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 truncate"
                                            >
                                                {suggestion.display_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <MapContainer
                                center={[
                                    (schoolLocations.find(l => l.id == selectedCampus) || schoolLocations[0] || { lat: 12.6083 }).lat,
                                    (schoolLocations.find(l => l.id == selectedCampus) || schoolLocations[0] || { lng: 80.0528 }).lng
                                ]}
                                zoom={11}
                                key={selectedCampus}
                                style={{ height: '100%', width: '100%' }}
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                />

                                <LocationMarker setPosition={setSelectedPosition} position={selectedPosition} />

                                {/* Campus Marker (Start/End) */}
                                <Marker position={getCampusCoordinates()} icon={createSchoolIcon()}>
                                    <Popup>
                                        <div className="text-center">
                                            <b className="text-indigo-900 text-sm">{(schoolLocations.find(l => l.id == selectedCampus) || schoolLocations[0] || { name: 'Default Campus' }).name}</b>
                                            <br />
                                            <span className="text-xs text-gray-500">Start & End Point</span>
                                        </div>
                                    </Popup>
                                </Marker>

                                {/* Stop Markers (Numbered) */}
                                {newRoute.stopPoints && newRoute.stopPoints.map((stop, index) => (
                                    <Marker
                                        key={index}
                                        position={stop.position}
                                        icon={createStopIcon(index + 1)}
                                    >
                                        <Popup>
                                            <div className="text-center">
                                                <span className="font-bold text-blue-700">Stop #{index + 1}</span>
                                                <br />
                                                <span className="text-sm font-medium">{stop.name}</span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}

                                {/* Route Line */}

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
                                <h4 className="font-bold text-lg text-gray-800 border-b border-blue-100 pb-2 flex items-center gap-2">
                                    Route Details
                                </h4>



                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: COLORS.SIDEBAR_BG }}>Route Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Route A - Downtown"
                                        value={newRoute.routeName}
                                        onChange={(e) => setNewRoute({ ...newRoute, routeName: e.target.value })}
                                        className="w-full bg-white border-2 border-blue-100 rounded-xl px-4 py-3 text-sm focus:border-blue-400 focus:outline-none transition shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: COLORS.SIDEBAR_BG }}>Assigned Bus</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowBusDropdown(!showBusDropdown);
                                            }}
                                            className="w-full bg-white border-2 border-blue-100 rounded-xl px-4 py-3 text-sm focus:border-blue-400 focus:outline-none transition shadow-sm text-left flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={faBus} className="text-blue-500" />
                                                <span className="font-bold text-gray-700">
                                                    {newRoute.assignedBus ? `${newRoute.assignedBus}` : 'Select a Bus'}
                                                </span>
                                            </div>
                                            <FontAwesomeIcon icon={faChevronDown} className={`text-blue-400 transition-transform ${showBusDropdown ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showBusDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-blue-100 rounded-2xl shadow-xl z-[2000] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                                    <div 
                                                        onClick={() => {
                                                            setNewRoute({ ...newRoute, busId: '', assignedBus: '' });
                                                            setShowBusDropdown(false);
                                                        }}
                                                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm font-bold text-slate-400 border-b border-slate-50"
                                                    >
                                                        None / Unassigned
                                                    </div>
                                                    {(availableBuses || []).map(bus => (
                                                        <div 
                                                            key={bus.id}
                                                            onClick={() => {
                                                                setNewRoute({ 
                                                                    ...newRoute, 
                                                                    busId: bus.id, 
                                                                    assignedBus: bus.busNumber 
                                                                });
                                                                setShowBusDropdown(false);
                                                            }}
                                                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer group transition-colors border-b border-slate-50 last:border-0"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                                                    {bus.busNumber}
                                                                </span>
                                                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                                                    Driver: {bus.driverName || 'No Driver'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stop Points Management */}
                            <div className="flex flex-col flex-1">
                                <h4 className="font-bold text-lg text-gray-800 border-b border-blue-100 pb-2 mb-4 flex items-center gap-2">
                                    Stops
                                </h4>

                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder={selectedPosition ? "Enter stop name..." : "Select location on map ->"}
                                        value={currentStopName}
                                        onChange={(e) => setCurrentStopName(e.target.value)}
                                        className="flex-1 bg-white border-2 border-blue-100 rounded-xl px-4 py-3 text-sm focus:border-blue-400 focus:outline-none transition shadow-sm"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddStop()}
                                        disabled={!selectedPosition}
                                    />
                                    <button
                                        onClick={handleAddStop}
                                        disabled={currentStopName.trim().length < 3 || !selectedPosition}
                                        className={`w-12 rounded-xl flex items-center justify-center text-white shadow-md transition-all ${(currentStopName.trim().length < 3 || !selectedPosition) ? 'bg-gray-300 cursor-not-allowed' : 'hover:shadow-lg'}`}
                                        style={{ backgroundColor: (currentStopName.trim().length < 3 || !selectedPosition) ? undefined : COLORS.SIDEBAR_BG }}
                                        title={selectedPosition && currentStopName.trim().length < 3 ? "Stop name must be at least 3 characters" : ""}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>

                                {/* List of added stops */}
                                <div className="flex-1 overflow-y-auto bg-blue-50/50 rounded-xl p-3 border border-blue-100 min-h-[150px]">
                                    {newRoute.stopPoints && newRoute.stopPoints.length > 0 ? (
                                        <div className="space-y-2">
                                            {newRoute.stopPoints.map((stop, index) => (
                                                <div key={index} className="flex items-center justify-between bg-white px-3 py-3 rounded-lg border border-blue-100 shadow-sm cursor-pointer hover:border-purple-300 transition-all select-none">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
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

                <div className="p-6 sm:p-8 border-t border-blue-100 bg-white flex-shrink-0">
                    <button
                        onClick={handleAddRoute}
                        disabled={isSaving}
                        className="w-full py-4 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all text-base disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center gap-2"
                        style={{ backgroundColor: isSaving ? undefined : COLORS.SIDEBAR_BG }}
                    >
                        {isSaving ? <FontAwesomeIcon icon={faCircleNotch} spin /> : null}
                        {isSaving ? 'Creating Route...' : 'Add Route'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRouteForm;
