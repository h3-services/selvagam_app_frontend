import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapLocationDot, faSearch, faCircleNotch, faChevronDown, faRoute, faLocationDot, faPlus, faBus, faGripVertical, faLocationCrosshairs, faExchangeAlt, faMagic, faCheck, faInfoCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl } from 'react-leaflet';
import { COLORS } from '../../constants/colors';
import { LocationMarker, createSchoolIcon, createStopIcon } from './RouteMapUtils';

const AddRouteForm = ({ show, onClose, onAdd, schoolLocations = [], availableBuses = [], isSaving, initialData }) => {
    // Default fallback campus if array is empty
    const defaultCampus = { id: 0, name: 'Default Campus', lat: 12.6083, lng: 80.0528 };
    const initialCampusId = schoolLocations.length > 0 ? schoolLocations[0].id : defaultCampus.id;

    const [newRoute, setNewRoute] = useState({ routeName: '', distance: '', assignedBus: '', stops: 0, stopPoints: [] });

    // Pre-fill form if initialData is provided (e.g., Duplication)
    useEffect(() => {
        if (show) {
            if (initialData) {
                setNewRoute(initialData);
            } else {
                setNewRoute({ routeName: '', distance: '', assignedBus: '', stops: 0, stopPoints: [] });
            }
        }
    }, [show, initialData]);
    const [currentStopName, setCurrentStopName] = useState('');
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [locationSearchQuery, setLocationSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [selectedCampus, setSelectedCampus] = useState(initialCampusId);
    const [showBusDropdown, setShowBusDropdown] = useState(false);
    const [localSaving, setLocalSaving] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    const [newStopPickupOrder, setNewStopPickupOrder] = useState(1);
    const [newStopDropOrder, setNewStopDropOrder] = useState(1);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);
    const [dragType, setDragType] = useState(null); // 'pickup' or 'drop'

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = () => setShowBusDropdown(false);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const SelectField = ({ label, icon, value, onChange, options, placeholder, disabled = false, error, activeColor = 'blue' }) => {
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (containerRef.current && !containerRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const selectedOption = options.find(opt => opt.value == value);

        const colorConfig = {
            blue: { primary: 'blue-600', light: 'bg-blue-50', border: 'hover:border-blue-400', ring: 'ring-blue-500' },
            indigo: { primary: 'indigo-600', light: 'bg-indigo-50', border: 'hover:border-indigo-400', ring: 'ring-indigo-500' },
            emerald: { primary: 'emerald-600', light: 'bg-emerald-50', border: 'hover:border-emerald-400', ring: 'ring-emerald-500' },
            amber: { primary: 'amber-600', light: 'bg-amber-50', border: 'hover:border-amber-400', ring: 'ring-amber-500' }
        };
        const theme = colorConfig[activeColor] || colorConfig.blue;

        return (
            <div className={`relative group/field ${isOpen ? 'z-[3000]' : 'z-10'}`} ref={containerRef}>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</label>
                    {error && <span className="text-[9px] font-bold text-rose-500 animate-pulse uppercase tracking-wider">{error}</span>}
                </div>
                <div 
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`relative flex items-center justify-between bg-white rounded-2xl border ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : `cursor-pointer ${theme.border} hover:shadow-md`} transition-all duration-300 px-4 py-3 ${isOpen ? `ring-4 ${theme.ring}/10 border-${theme.primary.split('-')[0]}-500 shadow-lg` : error ? 'border-rose-400 ring-4 ring-rose-500/5' : 'border-slate-200'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedOption ? `bg-${theme.primary} text-white shadow-sm` : error ? 'bg-rose-50 text-rose-400' : 'bg-slate-100 text-slate-400'}`}>
                            <FontAwesomeIcon icon={icon} className="text-xs" />
                        </div>
                        {selectedOption ? (
                            <span className="text-[13px] font-bold text-slate-800">{selectedOption.label}</span>
                        ) : (
                            <span className="text-[13px] font-bold text-slate-400">{placeholder}</span>
                        )}
                    </div>
                    <FontAwesomeIcon icon={faChevronDown} className={`text-slate-300 text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {isOpen && !disabled && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.12)] border border-slate-100 z-[3001] max-h-56 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col gap-1">
                            {options.map((opt, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => { onChange({ target: { value: opt.value } }); setIsOpen(false); }}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${value == opt.value ? `bg-${theme.primary} text-white shadow-sm` : 'hover:bg-slate-50 text-slate-700'}`}
                                >
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${value == opt.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        <FontAwesomeIcon icon={icon} />
                                    </div>
                                    <span className={`text-[12px] font-bold truncate flex-1 ${value == opt.value ? 'text-white' : 'text-slate-800'}`}>{opt.label}</span>
                                    {value == opt.value && (
                                        <FontAwesomeIcon icon={faCheck} className="text-[10px] shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Debounce search for suggestions
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (locationSearchQuery.length > 2) {
                setIsSearchingLocation(true);
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearchQuery)}&limit=5&accept-language=en`, {
                        headers: {
                            'Accept-Language': 'en-US,en;q=0.9',
                        }
                    });
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

    const handleManualSearch = async () => {
        if (locationSearchQuery.length < 2 || isSearchingLocation) return;
        setIsSearchingLocation(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearchQuery)}&limit=1&accept-language=en`, {
                headers: {
                    'Accept-Language': 'en-US,en;q=0.9',
                }
            });
            const data = await response.json();
            if (data && data.length > 0) {
                handleSelectSuggestion(data[0]);
            }
        } catch (error) {
            console.error("Manual search error:", error);
        } finally {
            setIsSearchingLocation(false);
        }
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const newPos = { lat: latitude, lng: longitude };
                setSelectedPosition(newPos);
                
                // Try to get address for the coordinates
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`, {
                        headers: {
                            'Accept-Language': 'en-US,en;q=0.9',
                        }
                    });
                    const data = await response.json();
                    if (data && data.display_name) {
                        setLocationSearchQuery(data.display_name);
                    } else {
                        setLocationSearchQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    }
                } catch (error) {
                    console.error("Error fetching address:", error);
                    setLocationSearchQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error("Error detecting location:", error);
                setIsLocating(false);
                alert("Could not detect your location. Please check your browser permissions.");
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    // Keep "New Stop" orders synchronized: Next sequential for Pickup, always 1 for Drop
    useEffect(() => {
        const nextOrder = (newRoute.stopPoints || []).length + 1;
        setNewStopPickupOrder(nextOrder);
        setNewStopDropOrder(1);
    }, [newRoute.stopPoints.length]);

    const handleAddStop = () => {
        if (currentStopName.trim() && selectedPosition) {
            setNewRoute(prev => {
                const updatedStops = [...prev.stopPoints, { 
                    name: currentStopName.trim(), 
                    position: [selectedPosition.lat, selectedPosition.lng],
                    pickupOrder: parseInt(newStopPickupOrder) || (prev.stopPoints.length + 1),
                    dropOrder: parseInt(newStopDropOrder) || (prev.stopPoints.length + 1)
                }];
                return {
                    ...prev,
                    stopPoints: updatedStops,
                    stops: updatedStops.length
                };
            });
            setCurrentStopName('');
            setSelectedPosition(null);
            setLocationSearchQuery('');
        }
    };

    const handleRemoveStop = (index) => {
        setNewRoute(prev => {
            const updatedStops = prev.stopPoints.filter((_, i) => i !== index);
            return {
                ...prev,
                stopPoints: updatedStops,
                stops: updatedStops.length
            };
        });
    };

    const handleUpdateOrder = (index, field, value) => {
        const parsed = parseInt(value, 10);
        const newStops = [...newRoute.stopPoints];
        newStops[index] = { ...newStops[index], [field]: isNaN(parsed) ? '' : parsed };
        setNewRoute(prev => ({ ...prev, stopPoints: newStops }));
    };

    const handleDragStart = (e, index, type) => {
        setDraggedItem(index);
        setDragType(type);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedItem === index) return;
        setDragOverItem(index);
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedItem === null || draggedItem === targetIndex) {
            setDraggedItem(null);
            setDragOverItem(null);
            return;
        }

        const currentStops = [...newRoute.stopPoints];
        
        // Find the items being sorted by current dragType
        const sortedItems = currentStops
            .map((s, i) => ({ ...s, originalIndex: i }))
            .sort((a, b) => {
                const orderKey = dragType === 'pickup' ? 'pickupOrder' : 'dropOrder';
                return (a[orderKey] || 0) - (b[orderKey] || 0);
            });

        const movedItem = sortedItems[draggedItem];
        const remainingItems = sortedItems.filter((_, i) => i !== draggedItem);
        
        // Insert at new position
        remainingItems.splice(targetIndex, 0, movedItem);

        // Update orders for all items based on new positions
        remainingItems.forEach((item, idx) => {
            const orderKey = dragType === 'pickup' ? 'pickupOrder' : 'dropOrder';
            currentStops[item.originalIndex] = {
                ...currentStops[item.originalIndex],
                [orderKey]: idx + 1
            };
        });

        setNewRoute(prev => ({ ...prev, stopPoints: currentStops }));
        setDraggedItem(null);
        setDragOverItem(null);
        setDragType(null);
    };

    const handleReverseNewRouteOrder = (type) => { // 'pickup' or 'drop'
        const currentData = [...(newRoute.stopPoints || [])];
        if (currentData.length < 2) return;

        // Sort by current order first, then reverse
        const sorted = currentData.sort((a, b) => {
            const valA = type === 'pickup' ? (a.pickupOrder || 0) : (a.dropOrder || 0);
            const valB = type === 'pickup' ? (b.pickupOrder || 0) : (b.dropOrder || 0);
            return valA - valB;
        });

        const reversed = sorted.reverse();
        
        // Map new sequential orders
        const finalStops = reversed.map((stop, index) => ({
            ...stop,
            [type === 'pickup' ? 'pickupOrder' : 'dropOrder']: index + 1
        }));

        setNewRoute(prev => ({ ...prev, stopPoints: finalStops }));
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
        <div className="fixed inset-0 z-[99999]">
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="fixed right-0 top-0 h-full w-full lg:w-[1100px] bg-slate-50 shadow-2xl z-[100000] flex flex-col transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)">
                
                {/* Static Action Buttons (Close / Auto Fill) */}
                <div className="absolute top-6 right-6 sm:right-8 z-[100030] flex items-center gap-3 hidden lg:flex">
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all duration-300 shadow-sm active:scale-90"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>
                </div>

                {/* Premium Header */}
                <div className="relative px-4 sm:px-8 py-5 sm:py-8 flex justify-between items-center z-[100020] bg-white border-b border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 sm:gap-6">
                        <button 
                            onClick={onClose}
                            className="lg:hidden w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 active:scale-95 transition-all"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-blue-600 blur-xl opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-700"></div>
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[20px] sm:rounded-[22px] flex items-center justify-center shadow-[0_15px_30px_rgba(58,123,255,0.3)] relative z-10 text-white transform group-hover:rotate-6 transition-transform duration-500" style={{ background: `linear-gradient(135deg, ${COLORS.SIDEBAR_BG}, #1e3a8a)` }}>
                                <FontAwesomeIcon icon={initialData ? faMapLocationDot : faRoute} className="text-lg sm:text-xl" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight leading-none mb-1 sm:mb-1.5">{initialData ? 'Update Route' : 'Add Route'}</h3>
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-600 w-1.5 h-1.5 rounded-full animate-pulse"></span>
                                <p className="text-slate-500 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em]">Route Protocol</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto md:overflow-hidden px-3 lg:px-8 pb-48 lg:pb-8">
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-6 sm:gap-8 h-full">
                        {/* Left Column: Map */}
                        <div className="flex flex-col h-[400px] lg:h-full rounded-[2rem] overflow-hidden shadow-xl border-4 border-white relative shrink-0">
                            <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col gap-1">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Search for a location..."
                                        value={locationSearchQuery}
                                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                                        className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white/95 backdrop-blur-sm min-w-0"
                                        title={locationSearchQuery}
                                    />
                                    <button 
                                        onClick={handleManualSearch}
                                        className="w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg flex items-center justify-center transition-all hover:scale-105 border-0 shrink-0"
                                        title="Search Location"
                                    >
                                        <FontAwesomeIcon icon={isSearchingLocation ? faCircleNotch : faSearch} className={isSearchingLocation ? "animate-spin text-[16px]" : "text-[16px]"} />
                                    </button>
                                    <button 
                                        onClick={handleDetectLocation}
                                        className="w-11 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg flex items-center justify-center transition-all hover:scale-105 border-0 shrink-0"
                                        title="Detect My Location"
                                        type="button"
                                    >
                                        <FontAwesomeIcon icon={isLocating ? faCircleNotch : faLocationCrosshairs} className={isLocating ? "animate-spin text-[16px]" : "text-[16px]"} />
                                    </button>
                                </div>
                                {/* Suggestions Dropdown */}
                                {searchSuggestions.length > 0 && (
                                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-50 overflow-hidden max-h-60 mt-1 overflow-y-auto">
                                        {searchSuggestions.map((suggestion, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => handleSelectSuggestion(suggestion)}
                                                className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors flex flex-col gap-0.5"
                                                title={suggestion.display_name}
                                            >
                                                <span className="font-medium truncate">{suggestion.display_name.split(',')[0]}</span>
                                                <span className="text-[10px] text-gray-400 truncate uppercase tracking-tight">{suggestion.display_name.split(',').slice(1).join(',')}</span>
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
                                zoomControl={false}
                            >
                                <ZoomControl position="bottomright" />
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
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-blue-900 text-xs font-bold px-4 py-2 rounded-full pointer-events-none z-[1000] shadow-lg border border-blue-200 animate-bounce">
                                    Click map to set stop location
                                </div>
                            )}
                        </div>

                        {/* Right Column: Details & Stops List */}
                        <div className="flex flex-col md:h-full md:overflow-y-auto pr-0 lg:pr-2 space-y-6">
                            {/* Route Details */}
                            <div className="bg-white rounded-[1.5rem] p-4 lg:p-6 shadow-sm border border-slate-100 space-y-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                    </div>
                                    <h4 className="font-black text-slate-900 tracking-tight">General Info</h4>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em] ml-1">Route Name</label>
                                        <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 hover:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all duration-300 group/input">
                                            <div className="w-11 h-11 flex items-center justify-center text-slate-400 absolute left-0 top-0 pointer-events-none transition-all group-focus-within/input:text-blue-600">
                                                <FontAwesomeIcon icon={faRoute} className="text-sm" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="e.g. Route A - Downtown"
                                                value={newRoute.routeName}
                                                onChange={(e) => setNewRoute({ ...newRoute, routeName: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-transparent rounded-2xl text-[13px] font-bold text-slate-700 placeholder-slate-300 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <SelectField 
                                        label="Assigned Bus" 
                                        icon={faBus} 
                                        value={newRoute.busId} 
                                        onChange={(e) => {
                                            const bus = availableBuses.find(b => b.id == e.target.value);
                                            setNewRoute({ 
                                                ...newRoute, 
                                                busId: e.target.value, 
                                                assignedBus: bus ? bus.busNumber : '' 
                                            });
                                        }} 
                                        activeColor="blue"
                                        placeholder="Select a Bus"
                                        options={[
                                            { value: '', label: 'None / Unassigned' },
                                            ...(availableBuses || []).map(bus => ({
                                                value: bus.id,
                                                label: `${bus.busNumber} (${bus.driverName || 'No Driver'})`
                                            }))
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Stop Points Management */}
                            <div className="bg-white rounded-[1.5rem] p-4 lg:p-6 shadow-sm border border-slate-100 flex flex-col h-fit">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faLocationDot} />
                                    </div>
                                    <h4 className="font-black text-slate-900 tracking-tight">Stop Registry</h4>
                                </div>

                                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-blue-100 shadow-inner">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest ml-1">Pickup Order</label>
                                            <input 
                                                type="number"
                                                value={newStopPickupOrder}
                                                onChange={(e) => setNewStopPickupOrder(e.target.value)}
                                                className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-sm font-bold text-blue-700 focus:border-blue-500 focus:outline-none shadow-sm"
                                                placeholder="Order"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-purple-600 uppercase tracking-widest ml-1">Drop Order</label>
                                            <input 
                                                type="number"
                                                value={newStopDropOrder}
                                                onChange={(e) => setNewStopDropOrder(e.target.value)}
                                                className="w-full bg-white border border-purple-100 rounded-xl px-3 py-2 text-sm font-bold text-purple-700 focus:border-purple-500 focus:outline-none shadow-sm"
                                                placeholder="Order"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder={selectedPosition ? "Enter stop name..." : "Select location on map ->"}
                                            value={currentStopName}
                                            onChange={(e) => setCurrentStopName(e.target.value)}
                                            className="flex-1 bg-white border border-blue-100 rounded-xl px-4 py-3 text-sm font-medium focus:border-blue-400 focus:outline-none transition shadow-sm min-w-0"
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddStop()}
                                            disabled={!selectedPosition}
                                            title={currentStopName}
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
                                </div>

                                {/* List of added stops */}
                                <div className="flex-1 overflow-y-auto min-h-[150px] flex flex-col gap-4">
                                    {/* Pickup Order Card */}
                                    <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 flex flex-col shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Pickup Sequence</h5>
                                            <button 
                                                onClick={() => handleReverseNewRouteOrder('pickup')}
                                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-white text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                                                title="Reverse Pickup Sequence"
                                            >
                                                <FontAwesomeIcon icon={faExchangeAlt} className="rotate-90" />
                                                Reverse
                                            </button>
                                        </div>
                                        {newRoute.stopPoints && newRoute.stopPoints.length > 0 ? (
                                            <div className="space-y-2">
                                                {newRoute.stopPoints
                                                    .map((stop, originalIndex) => ({ ...stop, originalIndex }))
                                                    .sort((a, b) => (a.pickupOrder || 0) - (b.pickupOrder || 0))
                                                    .map((stop, displayIndex) => (
                                                        <div 
                                                            key={`pickup-${stop.originalIndex}`} 
                                                            className={`flex items-center justify-between bg-white px-3 py-2.5 rounded-lg border transition-all duration-200 ${draggedItem === displayIndex && dragType === 'pickup' ? 'opacity-40 scale-95 border-blue-300' : 'border-blue-50'} ${dragOverItem === displayIndex && dragType === 'pickup' ? 'border-t-4 border-t-blue-500 pt-2' : ''}`}
                                                            draggable
                                                            onDragStart={(e) => handleDragStart(e, displayIndex, 'pickup')}
                                                            onDragOver={(e) => handleDragOver(e, displayIndex)}
                                                            onDrop={(e) => handleDrop(e, displayIndex)}
                                                            onDragEnd={() => { setDraggedItem(null); setDragOverItem(null); }}
                                                        >
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    <div className="cursor-grab active:cursor-grabbing text-blue-300 hover:text-blue-500">
                                                                        <FontAwesomeIcon icon={faGripVertical} className="text-[10px]" />
                                                                    </div>
                                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                                                                        {stop.pickupOrder !== undefined ? stop.pickupOrder : stop.originalIndex + 1}
                                                                    </div>
                                                                </div>
                                                                <div className="w-px h-8 bg-blue-100 mx-1"></div>
                                                                <span className="text-sm font-bold text-gray-700 truncate">{stop.name}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveStop(stop.originalIndex)}
                                                                className="text-gray-300 hover:text-red-500 transition-colors px-2 ml-2 shrink-0"
                                                            >
                                                                <FontAwesomeIcon icon={faTimes} className="text-sm" />
                                                            </button>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <div className="h-20 flex flex-col items-center justify-center text-blue-300 opacity-80">
                                                <span className="text-[10px] font-bold">No stops added</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Drop Order Card */}
                                    <div className="bg-purple-50/50 rounded-xl p-3 border border-purple-100 flex flex-col shadow-sm mb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="text-[11px] font-bold text-purple-600 uppercase tracking-widest">Drop Sequence</h5>
                                            <button 
                                                onClick={() => handleReverseNewRouteOrder('drop')}
                                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-white text-purple-600 border border-purple-100 hover:bg-purple-600 hover:text-white transition-all active:scale-95"
                                                title="Reverse Drop Sequence"
                                            >
                                                <FontAwesomeIcon icon={faExchangeAlt} className="rotate-90" />
                                                Reverse
                                            </button>
                                        </div>
                                        {newRoute.stopPoints && newRoute.stopPoints.length > 0 ? (
                                            <div className="space-y-2">
                                                {newRoute.stopPoints
                                                    .map((stop, originalIndex) => ({ ...stop, originalIndex }))
                                                    .sort((a, b) => (a.dropOrder || 0) - (b.dropOrder || 0))
                                                    .map((stop, displayIndex) => (
                                                        <div 
                                                            key={`drop-${stop.originalIndex}`} 
                                                            className={`flex items-center justify-between bg-white px-3 py-2.5 rounded-lg border transition-all duration-200 ${draggedItem === displayIndex && dragType === 'drop' ? 'opacity-40 scale-95 border-purple-300' : 'border-purple-50'} ${dragOverItem === displayIndex && dragType === 'drop' ? 'border-t-4 border-t-purple-500 pt-2' : ''}`}
                                                            draggable
                                                            onDragStart={(e) => handleDragStart(e, displayIndex, 'drop')}
                                                            onDragOver={(e) => handleDragOver(e, displayIndex)}
                                                            onDrop={(e) => handleDrop(e, displayIndex)}
                                                            onDragEnd={() => { setDraggedItem(null); setDragOverItem(null); }}
                                                        >
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    <div className="cursor-grab active:cursor-grabbing text-purple-300 hover:text-purple-500">
                                                                        <FontAwesomeIcon icon={faGripVertical} className="text-[10px]" />
                                                                    </div>
                                                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs shrink-0">
                                                                        {stop.dropOrder !== undefined ? stop.dropOrder : stop.originalIndex + 1}
                                                                    </div>
                                                                </div>
                                                                <div className="w-px h-8 bg-purple-100 mx-1"></div>
                                                                <span className="text-sm font-bold text-gray-700 truncate">{stop.name}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <div className="h-20 flex flex-col items-center justify-center text-purple-300 opacity-80">
                                                <span className="text-[10px] font-bold">No stops added</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-[100030] shadow-[0_-15px_40px_rgba(0,0,0,0.1)]">
                    <button
                        onClick={handleAddRoute}
                        disabled={isSaving}
                        className={`group w-full h-12 lg:h-14 rounded-xl lg:rounded-2xl font-black text-white text-[8px] lg:text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 lg:gap-4 transition-all shadow-2xl active:scale-95 ${isSaving ? 'bg-slate-400 opacity-60 cursor-not-allowed' : 'hover:scale-[1.01] hover:shadow-blue-500/25 active:scale-95'}`}
                        style={{ 
                            background: !isSaving
                                ? 'linear-gradient(135deg, #3A7BFF 0%, #1e3a8a 100%)' 
                                : '' 
                        }}
                    >
                        <span>{isSaving ? 'Processing Protocol...' : (initialData ? 'Save Route Changes' : 'Initialize Route')}</span>
                        <div className={`w-9 h-9 ${isSaving ? '' : 'bg-white/10'} rounded-xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform`}>
                            {isSaving ? (
                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-xs" />
                            ) : (
                                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRouteForm;
