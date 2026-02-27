import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMapLocationDot, faBus, faCircle, faTimes, faCheck, faEdit, faPlus, faSpinner, faSearch, faUserGraduate, faCircleNotch, faMars, faVenus, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { routeService } from '../../services/routeService';
import { studentService } from '../../services/studentService';
import { classService } from '../../services/classService';
import { LocationMarker, createStopIcon, createSchoolIcon } from './RouteMapUtils';

const RouteDetail = ({ selectedRoute, onBack, onUpdate, onReorderStop, isSaving }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [currentStopName, setCurrentStopName] = useState('');
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [locationSearchQuery, setLocationSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [editingStopIndex, setEditingStopIndex] = useState(null);
    const [editingStopName, setEditingStopName] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [routeStudents, setRouteStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [classMap, setClassMap] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [newStopPickupOrder, setNewStopPickupOrder] = useState(1);
    const [newStopDropOrder, setNewStopDropOrder] = useState(1);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);
    const [dragType, setDragType] = useState(null); // 'pickup' or 'drop'

    const handleViewStudents = async () => {
        setShowStudentsModal(true);
        setLoadingStudents(true);
        try {
            const [students, classes] = await Promise.all([
                studentService.getStudentsByRoute(selectedRoute.id),
                classService.getAllClasses().catch(() => [])
            ]);
            const cMap = {};
            classes.forEach(c => { cMap[c.class_id] = `${c.class_name} - ${c.section}`; });
            setClassMap(cMap);
            setRouteStudents(students || []);
        } catch (error) {
            console.error('Failed to fetch route students:', error);
            setRouteStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleStartStopEdit = (index, name) => {
        setEditingStopIndex(index);
        setEditingStopName(name);
    };

    const handleSaveStopEdit = (index) => {
        if (!editingStopName.trim()) return;
        
        const updatedStops = [...editData.stopPoints];
        updatedStops[index] = { ...updatedStops[index], name: editingStopName.trim() };
        
        setEditData({ ...editData, stopPoints: updatedStops });
        setEditingStopIndex(null);
        setEditingStopName('');
    };

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

    // Keep "New Stop" orders synchronized while editing: Next sequential for Pickup, always 1 for Drop
    useEffect(() => {
        if (isEditing && editData?.stopPoints) {
            const nextOrder = (editData.stopPoints || []).length + 1;
            setNewStopPickupOrder(nextOrder);
            setNewStopDropOrder(1);
        }
    }, [isEditing, editData?.stopPoints?.length]);

    const handleSaveEdit = async () => {
        if (localLoading || isSaving) return;
        setLocalLoading(true);
        setErrorMessage(null);
        try {
            await onUpdate(editData);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save route:", error);
            if (error.response?.status === 500 && error.response?.data?.detail?.includes('Duplicate entry')) {
                setErrorMessage('Order conflict detected. Two stops cannot have the same pickup or drop order sequence. Please check the order fields and try again.');
            } else {
                setErrorMessage(error.message || "Failed to update Route. Please try again.");
            }
        } finally {
            setLocalLoading(false);
        }
    };

    const handleEditAddStop = () => {
        if (currentStopName.trim() && selectedPosition) {
            // Determine order locally
            const currentStops = editData.stopPoints || [];
            
            setEditData(prev => ({
                ...prev,
                stopPoints: [...(prev.stopPoints || []), { 
                    name: currentStopName.trim(), 
                    position: [selectedPosition.lat, selectedPosition.lng],
                    pickupOrder: parseInt(newStopPickupOrder) || (prev.stopPoints.length + 1),
                    dropOrder: parseInt(newStopDropOrder) || (prev.stopPoints.length + 1),
                    id: null // Explicitly null so handleUpdate knows it's a new stop
                }],
                stops: (prev.stops || 0) + 1
            }));
            
            setCurrentStopName('');
            setSelectedPosition(null);
            setLocationSearchQuery('');
        }
    };

    const handleEditRemoveStop = (index) => {
        setEditData(prev => {
            const updatedStops = prev.stopPoints.filter((_, i) => i !== index);
            return {
                ...prev,
                stopPoints: updatedStops,
                stops: Math.max(0, (prev.stops || 0) - 1)
            };
        });
    };

    const handleStartEditing = () => {
        setIsEditing(true);
        setSelectedPosition(null);
        setLocationSearchQuery('');
        setCurrentStopName('');
        // Initialize editing state with numeric pickup/drop order
        if(selectedRoute && selectedRoute.stopPoints){
            setEditData({
                ...selectedRoute,
                stopPoints: selectedRoute.stopPoints.map((s, i) => ({
                    ...s,
                    pickupOrder: s.pickupOrder !== undefined ? s.pickupOrder : (i+1),
                    dropOrder: s.dropOrder !== undefined ? s.dropOrder : (i+1)
                }))
            });
        } else {
            setNewStopPickupOrder(1);
            setNewStopDropOrder(1);
        }
    }

    if (!selectedRoute) return null;

    const handleDragStart = (e, index, type) => {
        setDraggedItem(index);
        setDragType(type);
        e.dataTransfer.effectAllowed = "move";
        // Customize drag ghost
        const ghost = e.currentTarget.cloneNode(true);
        ghost.style.opacity = '0.5';
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

        const currentStops = [...(isEditing ? editData.stopPoints : selectedRoute.stopPoints)];
        
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
        const orderKey = dragType === 'pickup' ? 'pickupOrder' : 'dropOrder';
        const finalStops = [...currentStops];
        
        remainingItems.forEach((item, idx) => {
            finalStops[item.originalIndex] = {
                ...finalStops[item.originalIndex],
                [orderKey]: idx + 1
            };
        });

        if (isEditing) {
            setEditData({ ...editData, stopPoints: finalStops });
        } else if (onReorderStop) {
            const stopToUpdate = finalStops[movedItem.originalIndex];
            onReorderStop(stopToUpdate.id, {
                stop_name: stopToUpdate.name,
                latitude: parseFloat(parseFloat(stopToUpdate.position[0]).toFixed(6)),
                longitude: parseFloat(parseFloat(stopToUpdate.position[1]).toFixed(6)),
                pickup_stop_order: stopToUpdate.pickupOrder,
                drop_stop_order: stopToUpdate.dropOrder
            });
        }

        setDraggedItem(null);
        setDragOverItem(null);
        setDragType(null);
    };

    const handleMapClick = (latlng) => {
        if (editingStopIndex !== null) {
            // Update existing stop location
            const updatedStops = [...editData.stopPoints];
            updatedStops[editingStopIndex] = {
                ...updatedStops[editingStopIndex],
                position: [latlng.lat, latlng.lng]
            };
            setEditData({ ...editData, stopPoints: updatedStops });
        } else {
            // Set location for new stop
            setSelectedPosition(latlng);
        }
    };

    return (
        <div className="h-full bg-white lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="relative p-3 sm:p-5 shrink-0" style={{ backgroundColor: '#3A7BFF' }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <button
                            onClick={() => { onBack(); setIsEditing(false); }}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex-shrink-0 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <div className="flex flex-col items-start min-w-0">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData?.routeName}
                                    onChange={(e) => setEditData({ ...editData, routeName: e.target.value })}
                                    className="bg-transparent border-b border-white text-white font-bold text-lg sm:text-2xl focus:outline-none placeholder-white/50 w-full"
                                />
                            ) : (
                                <>
                                    <h2 className="text-base sm:text-2xl font-bold text-white truncate">{selectedRoute.routeName}</h2>
                                    <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
                                        <span className="text-white font-bold text-[8px] sm:text-xs uppercase tracking-widest">{selectedRoute.assignedBus}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {isEditing ? (
                        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end shrink-0">
                            <button 
                                onClick={() => setIsEditing(false)} 
                                disabled={isSaving}
                                className="flex-1 sm:flex-none px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/40 text-white rounded-lg hover:bg-white/30 transition-all text-sm font-medium disabled:opacity-50 text-center"
                            >
                                <FontAwesomeIcon icon={faTimes} className="mr-1" />Cancel
                            </button>
                            <button 
                                onClick={handleSaveEdit} 
                                disabled={isSaving}
                                className="flex-1 sm:flex-none px-4 py-2 bg-white text-black rounded-lg hover:shadow-lg transition-all text-sm font-medium disabled:bg-gray-200 flex items-center justify-center gap-2"
                            >
                                {isSaving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faCheck} />}
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end shrink-0">
                            <button onClick={handleViewStudents} className="flex-1 sm:flex-none px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/40 text-white rounded-lg hover:bg-white/30 transition-all text-sm font-medium flex items-center justify-center gap-2">
                                <FontAwesomeIcon icon={faUserGraduate} />
                                Students
                            </button>
                            <button onClick={handleStartEditing} className="flex-1 sm:flex-none px-4 py-2 bg-white text-black rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center justify-center">
                                <FontAwesomeIcon icon={faEdit} className="mr-1" />Edit
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 p-3 sm:p-5 relative min-h-0 flex flex-col">
                {errorMessage && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-fade-in shrink-0">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <FontAwesomeIcon icon={faTimes} className="text-red-500 bg-red-100 rounded-full w-4 h-4 p-1" />
                            {errorMessage}
                        </div>
                        <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600 transition-colors">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                )}
                <div className="flex flex-col lg:flex-row h-full gap-3 sm:gap-4 overflow-y-auto lg:overflow-hidden">
                    {/* Stops List */}
                    {/* Stops List */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-4 shrink-0 lg:h-full lg:overflow-y-auto custom-scrollbar pr-2">
                        
                        {/* Pickup Order Card */}
                        <div className="bg-blue-50/50 rounded-2xl p-3 sm:p-4 flex flex-col border border-blue-100 shadow-sm shrink-0">
                            <h3 className="text-sm font-bold uppercase tracking-wide mb-4 text-blue-600 shrink-0">Pickup Order</h3>
                            


                            {isEditing && (
                                <div className="mb-6 space-y-3 bg-white p-4 rounded-xl border border-blue-100 shadow-inner shrink-0">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.15em] ml-1">Pickup Order</label>
                                            <input 
                                                type="number"
                                                value={newStopPickupOrder}
                                                onChange={(e) => setNewStopPickupOrder(e.target.value)}
                                                className="w-full bg-slate-50 border border-blue-100 rounded-lg px-3 py-2 text-sm font-bold text-blue-700 focus:border-blue-500 focus:outline-none focus:bg-white transition-all shadow-sm"
                                                placeholder="Order"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-black text-purple-600 uppercase tracking-[0.15em] ml-1">Drop Order</label>
                                            <input 
                                                type="number"
                                                value={newStopDropOrder}
                                                onChange={(e) => setNewStopDropOrder(e.target.value)}
                                                className="w-full bg-slate-50 border border-purple-100 rounded-lg px-3 py-2 text-sm font-bold text-purple-700 focus:border-purple-500 focus:outline-none focus:bg-white transition-all shadow-sm"
                                                placeholder="Order"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            type="text"
                                            placeholder={selectedPosition ? "Stop name..." : "Select on map"}
                                            value={currentStopName}
                                            onChange={(e) => {
                                                setCurrentStopName(e.target.value);
                                                // Sync orders to next available if they are defaults
                                                if (newStopPickupOrder <= 1 && (editData?.stopPoints?.length || 0) >= 1) {
                                                    const nextOrder = (editData.stopPoints.length) + 1;
                                                    setNewStopPickupOrder(nextOrder);
                                                    setNewStopDropOrder(nextOrder);
                                                }
                                            }}
                                            className="flex-1 bg-slate-50 border border-blue-100 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                                            disabled={!selectedPosition}
                                        />
                                        <button
                                            onClick={handleEditAddStop}
                                            disabled={!currentStopName.trim() || !selectedPosition}
                                            className={`w-full sm:w-auto px-4 py-2 sm:px-3 text-white rounded-lg shadow-sm transition-all flex justify-center items-center ${(!currentStopName.trim() || !selectedPosition) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:shadow-md hover:bg-blue-700'}`}
                                        >
                                            <FontAwesomeIcon icon={faPlus} className="sm:mr-0 mr-2" /><span className="sm:hidden font-medium">Add Stop</span>
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-blue-400 font-bold ml-1 flex items-center gap-1.5 capitalize">
                                        {!selectedPosition 
                                            ? <><FontAwesomeIcon icon={faMapLocationDot} /> Select location on map first</> 
                                            : <><FontAwesomeIcon icon={faCheck} className="text-green-500" /> Location selected (Ready to add)</>}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3 flex-col">
                                {(isEditing ? editData.stopPoints : (selectedRoute?.stopPoints || [])) && (isEditing ? editData.stopPoints : selectedRoute.stopPoints).length > 0 ? (
                                    [...(isEditing ? editData.stopPoints : selectedRoute.stopPoints)]
                                        .map((stop, originalIndex) => ({ ...stop, originalIndex }))
                                        .sort((a, b) => (a.pickupOrder || 0) - (b.pickupOrder || 0))
                                        .map((stop, displayIndex) => (
                                            <div 
                                                key={`pickup-${stop.originalIndex}`} 
                                                className={`flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border transition-all duration-200 ${draggedItem === displayIndex && dragType === 'pickup' ? 'opacity-40 scale-95 border-blue-300' : 'border-blue-50'} ${dragOverItem === displayIndex && dragType === 'pickup' ? 'border-t-4 border-t-blue-500 pt-2' : ''}`}
                                                draggable={editingStopIndex === null}
                                                onDragStart={(e) => handleDragStart(e, displayIndex, 'pickup')}
                                                onDragOver={(e) => handleDragOver(e, displayIndex)}
                                                onDrop={(e) => handleDrop(e, displayIndex)}
                                                onDragEnd={() => { setDraggedItem(null); setDragOverItem(null); }}
                                            >
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <div className="cursor-grab active:cursor-grabbing text-blue-300 hover:text-blue-500 px-1 py-2">
                                                            <FontAwesomeIcon icon={faGripVertical} />
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                                                            {stop.pickupOrder !== undefined ? stop.pickupOrder : stop.originalIndex + 1}
                                                        </div>
                                                    </div>
                                                    
                                                    {isEditing && <div className="w-px h-8 bg-blue-100 mx-1"></div>}
                                                    {editingStopIndex === stop.originalIndex ? (
                                                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 w-full">
                                                                <input 
                                                                    type="text" 
                                                                    value={editingStopName}
                                                                    onChange={(e) => setEditingStopName(e.target.value)}
                                                                    className="flex-1 bg-white border border-blue-500 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 min-w-0 shadow-sm text-gray-900"
                                                                    autoFocus
                                                                />
                                                                <div className="flex items-center gap-1 shrink-0">
                                                                    <button onClick={() => { setEditingStopIndex(null); setEditingStopName(''); }} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors flex items-center justify-center">
                                                                        <FontAwesomeIcon icon={faTimes} className="text-base sm:text-lg" />
                                                                    </button>
                                                                    <button onClick={() => handleSaveStopEdit(stop.originalIndex)} className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors flex items-center justify-center">
                                                                        <FontAwesomeIcon icon={faCheck} className="text-base sm:text-lg" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] text-blue-500 font-medium ml-1">
                                                                * Click map to update location
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm font-bold text-gray-800">{stop.name}</p>
                                                    )}
                                                </div>
                                                {isEditing && (
                                                    <div className="flex gap-2 pl-2">
                                                        {editingStopIndex !== stop.originalIndex && (
                                                            <button
                                                                onClick={() => handleStartStopEdit(stop.originalIndex, stop.name)}
                                                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleEditRemoveStop(stop.originalIndex)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                ) : (
                                    <div className="text-center py-8 text-blue-400 text-sm">No stops added</div>
                                )}
                            </div>
                        </div>

                        {/* Drop Order Card */}
                        <div className="bg-purple-50/50 rounded-2xl p-3 sm:p-4 flex flex-col border border-purple-100 shadow-sm shrink-0 mb-4">
                            <h3 className="text-sm font-bold uppercase tracking-wide mb-4 text-purple-600 shrink-0">Drop Order</h3>
                            

                            <div className="space-y-3 flex-col">
                                {(isEditing ? editData.stopPoints : (selectedRoute?.stopPoints || [])) && (isEditing ? editData.stopPoints : selectedRoute.stopPoints).length > 0 ? (
                                    [...(isEditing ? editData.stopPoints : selectedRoute.stopPoints)]
                                        .map((stop, originalIndex) => ({ ...stop, originalIndex }))
                                        .sort((a, b) => (a.dropOrder || 0) - (b.dropOrder || 0))
                                        .map((stop, displayIndex) => (
                                            <div 
                                                key={`drop-${stop.originalIndex}`} 
                                                className={`flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border transition-all duration-200 ${draggedItem === displayIndex && dragType === 'drop' ? 'opacity-40 scale-95 border-purple-300' : 'border-purple-50'} ${dragOverItem === displayIndex && dragType === 'drop' ? 'border-t-4 border-t-purple-500 pt-2' : ''}`}
                                                draggable={editingStopIndex === null}
                                                onDragStart={(e) => handleDragStart(e, displayIndex, 'drop')}
                                                onDragOver={(e) => handleDragOver(e, displayIndex)}
                                                onDrop={(e) => handleDrop(e, displayIndex)}
                                                onDragEnd={() => { setDraggedItem(null); setDragOverItem(null); }}
                                            >
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <div className="cursor-grab active:cursor-grabbing text-purple-300 hover:text-purple-500 px-1 py-2">
                                                            <FontAwesomeIcon icon={faGripVertical} />
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs shrink-0">
                                                            {stop.dropOrder !== undefined ? stop.dropOrder : stop.originalIndex + 1}
                                                        </div>
                                                    </div>
                                                    
                                                    {isEditing && <div className="w-px h-8 bg-purple-100 mx-1"></div>}
                                                    <p className="text-sm font-bold text-gray-800 truncate">{stop.name}</p>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="text-center py-8 text-purple-400 text-sm">No stops added</div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Map Container - Moved to top on mobile for better visibility */}
                    <div className="order-first lg:order-none flex-1 relative rounded-2xl overflow-hidden shadow-inner border border-gray-200 min-h-[300px] sm:min-h-[400px] lg:min-h-0 shrink-0 lg:shrink">
                        {isEditing && (
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
                                        <FontAwesomeIcon icon={isSearchingLocation ? faSpinner : faSearch} className={isSearchingLocation ? "animate-spin" : ""} />
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
                        )}
                        <MapContainer
                            center={[12.6083, 80.0528]} 
                            zoom={11}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />

                            {/* School/Campus Marker (Start/End Point) */}
                            <Marker position={[12.6083, 80.0528]} icon={createSchoolIcon()}>
                                <Popup>
                                    <div className="text-center">
                                        <b className="text-indigo-900 text-sm">School Campus</b>
                                        <br />
                                        <span className="text-xs text-gray-500">Route Start & End Point</span>
                                    </div>
                                </Popup>
                            </Marker>

                            {isEditing && (
                                <LocationMarker 
                                    setPosition={handleMapClick} 
                                    position={editingStopIndex !== null ? null : selectedPosition} 
                                />
                            )}

                            {/* Render all stop points */}
                            {(isEditing ? editData.stopPoints : selectedRoute.stopPoints) && (isEditing ? editData.stopPoints : selectedRoute.stopPoints).map((stop, index) => (
                                <Marker 
                                    key={index} 
                                    position={stop.position} 
                                    opacity={isEditing ? 0.7 : 1}
                                    icon={createStopIcon(index + 1)}
                                >
                                    <Popup>
                                        <div className="font-bold">{stop.name}</div>
                                        <div className="text-xs text-gray-400">Stop #{index + 1}</div>
                                    </Popup>
                                </Marker>
                            ))}


                            {/* Optional Route Line if needed, can connect all points */}

                        </MapContainer>
                    </div>
                </div>
            </div>

            {/* Students Modal */}
            {showStudentsModal && (
                <>
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[99999] transition-opacity duration-500" 
                        onClick={() => setShowStudentsModal(false)} 
                    />
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                                        <FontAwesomeIcon icon={faUserGraduate} className="text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg text-slate-900 tracking-tight leading-none">{selectedRoute.routeName}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1">{routeStudents.length} Students</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowStudentsModal(false)} 
                                    className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-all active:scale-90"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="text-base" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                {loadingStudents ? (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <FontAwesomeIcon icon={faCircleNotch} spin className="text-2xl text-blue-600 mb-3" />
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading...</p>
                                    </div>
                                ) : routeStudents.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                                            <FontAwesomeIcon icon={faUserGraduate} className="text-xl text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No students on this route</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {routeStudents.map((student, idx) => (
                                            <div 
                                                key={student.student_id || idx} 
                                                className="flex items-center gap-4 px-4 py-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300 group"
                                            >
                                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black border border-blue-100 shrink-0 group-hover:scale-110 transition-transform">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-slate-900 truncate">{student.name}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{classMap[student.class_id] || 'N/A'}</p>
                                                </div>
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                                    student.gender === 'MALE' 
                                                        ? 'bg-sky-50 text-sky-600 border border-sky-100' 
                                                        : 'bg-pink-50 text-pink-600 border border-pink-100'
                                                }`}>
                                                    <FontAwesomeIcon icon={student.gender === 'MALE' ? faMars : faVenus} className="text-[11px]" />
                                                    {student.gender === 'MALE' ? 'M' : 'F'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};


export default RouteDetail;
