import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faPlus, faTimes, faLocationDot, faPen } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LocationPicker } from './SuperMapUtils';

const SchoolLocations = ({
    locations,
    onAddLocation,
    onUpdateLocation,
    onDeleteLocation
}) => {
    const [editingLocationId, setEditingLocationId] = useState(null);
    const [editLocationData, setEditLocationData] = useState(null);
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [newLocation, setNewLocation] = useState({
        name: '',
        address: '',
        lat: 12.9716, // Default fallback
        lng: 77.5946
    });

    const handleAdd = () => {
        if (newLocation.name && newLocation.address) {
            onAddLocation(newLocation);
            setNewLocation({ name: '', address: '', lat: 12.9716, lng: 77.5946 });
            setIsAddingLocation(false);
        }
    };

    const startEdit = (loc) => {
        setEditingLocationId(loc.id);
        setEditLocationData({ ...loc });
    };

    const saveEdit = () => {
        onUpdateLocation(editingLocationId, editLocationData);
        setEditingLocationId(null);
        setEditLocationData(null);
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FontAwesomeIcon icon={faBuilding} className="text-indigo-600" />
                    School Locations
                </h2>
                <button
                    onClick={() => setIsAddingLocation(!isAddingLocation)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={isAddingLocation ? faTimes : faPlus} />
                    {isAddingLocation ? 'Cancel Adding' : 'Add New Location'}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">

                    {/* Locations List / Edit Panel */}
                    <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col bg-gray-50/30 overflow-y-auto max-h-[500px]">

                        {/* Add New Location Form */}
                        {isAddingLocation && (
                            <div className="p-6 border-b border-indigo-100 bg-indigo-50/30 animate-fade-in-down">
                                <h3 className="text-sm font-bold text-indigo-900 mb-4 uppercase tracking-wide">Add New Campus</h3>
                                <div className="space-y-4">
                                    <input
                                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
                                        placeholder="Location Name (e.g. Sports Complex)"
                                        value={newLocation.name}
                                        onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                                    />
                                    <textarea
                                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:border-indigo-500 outline-none resize-none"
                                        placeholder="Full Address"
                                        rows={2}
                                        value={newLocation.address}
                                        onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                                    />
                                    <div className="text-xs text-indigo-600 font-medium flex items-center gap-2">
                                        <FontAwesomeIcon icon={faLocationDot} /> Click map to set coordinates
                                    </div>
                                    <button
                                        onClick={handleAdd}
                                        className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm"
                                    >
                                        Save Location
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* List of Locations */}
                        <div className="flex-1">
                            {locations.length === 0 && !isAddingLocation && (
                                <div className="p-8 text-center text-gray-500 text-sm">No locations added yet.</div>
                            )}

                            {locations.map((loc) => (
                                <div
                                    key={loc.id}
                                    className={`p-5 border-b border-gray-100 transition-colors ${editingLocationId === loc.id ? 'bg-white shadow-inner border-l-4 border-l-indigo-500' : 'hover:bg-white hover:border-l-4 hover:border-l-gray-300 border-l-4 border-l-transparent'}`}
                                    onClick={() => !editingLocationId && startEdit(loc)}
                                >
                                    {editingLocationId === loc.id ? (
                                        <div className="space-y-3">
                                            <input
                                                className="w-full font-bold text-gray-900 border-b border-indigo-300 focus:outline-none bg-transparent"
                                                value={editLocationData.name}
                                                onChange={(e) => setEditLocationData({ ...editLocationData, name: e.target.value })}
                                            />
                                            <textarea
                                                className="w-full text-sm text-gray-600 border-b border-indigo-300 focus:outline-none bg-transparent resize-none"
                                                value={editLocationData.address}
                                                onChange={(e) => setEditLocationData({ ...editLocationData, address: e.target.value })}
                                                rows={2}
                                            />
                                            <div className="flex justify-between items-center pt-2">
                                                <div className="text-xs font-mono text-gray-500">
                                                    {editLocationData.lat.toFixed(4)}, {editLocationData.lng.toFixed(4)}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={saveEdit} className="p-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-xs font-bold">Save</button>
                                                    <button onClick={() => onDeleteLocation(loc.id)} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-bold">Delete</button>
                                                </div>
                                            </div>
                                            <div className="text-xs text-indigo-500 mt-1">
                                                * Click map to update pin
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='cursor-pointer group'>
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">{loc.name}</h4>
                                                <FontAwesomeIcon icon={faPen} className="text-gray-300 group-hover:text-indigo-400 text-xs" />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{loc.address}</p>
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-mono rounded">
                                                    {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interactive Map */}
                    <div className="lg:col-span-8 relative z-0 h-full min-h-[500px]">
                        <MapContainer
                            center={[12.9716, 77.5946]}
                            zoom={12}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />

                            {/* Logic to capture clicks for either Adding New or Editing Existing */}
                            {(isAddingLocation || editingLocationId) && (
                                <LocationPicker
                                    position={isAddingLocation ? newLocation : editLocationData}
                                    setPosition={(pos) => {
                                        if (isAddingLocation) {
                                            setNewLocation({ ...newLocation, lat: pos.lat, lng: pos.lng });
                                        } else if (editingLocationId) {
                                            setEditLocationData({ ...editLocationData, lat: pos.lat, lng: pos.lng });
                                        }
                                    }}
                                />
                            )}

                            {/* Render all saved locations */}
                            {locations.map(loc => (
                                <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                                    <Popup>
                                        <div className="text-center">
                                            <b className="text-indigo-700">{loc.name}</b><br />
                                            <span className="text-xs text-gray-600">{loc.address}</span>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                        </MapContainer>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SchoolLocations;
