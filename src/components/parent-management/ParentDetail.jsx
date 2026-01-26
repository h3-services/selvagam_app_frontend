import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimes, faCheck, faEdit, faChild, faPhone, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import LocationMap from './LocationMap';

const ParentDetail = ({ selectedParent, onBack, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [mapSearchQuery, setMapSearchQuery] = useState('');
    const [markerPosition, setMarkerPosition] = useState([12.6074, 80.0463]);
    const [mapCenter, setMapCenter] = useState([12.6074, 80.0463]);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const mapRef = useRef(null);

    // Initial load and Geocode
    useEffect(() => {
        if (selectedParent) {
            setEditData({ ...selectedParent });
            setMapSearchQuery(selectedParent.location);
            // Geocode logic
            const geocodeLocation = async () => {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(selectedParent.location)}&limit=1`);
                    const data = await response.json();
                    if (data.length > 0) {
                        const { lat, lon } = data[0];
                        setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
                        setMapCenter([parseFloat(lat), parseFloat(lon)]);
                    }
                } catch (error) {
                    console.error('Error geocoding location:', error);
                }
            };
            geocodeLocation();
        }
    }, [selectedParent]);

    const handleSaveEdit = () => {
        const updatedData = { ...editData, date: new Date().toISOString().split('T')[0] };
        onUpdate(updatedData);
        setIsEditing(false);
    };

    return (
        <div className="flex-1 overflow-hidden h-full flex flex-col">
            <div className="h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                {/* Back Button and Header */}
                <div className="relative p-5" style={{ backgroundColor: '#40189d' }}>

                    <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all mr-2"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                            <div className="relative">
                                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg bg-white/20 backdrop-blur-sm border-2 border-white/30">
                                    {selectedParent.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md">
                                    <FontAwesomeIcon icon={faUser} className="text-xs" style={{ color: '#40189d' }} />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{selectedParent.name}</h2>
                                <p className="text-white/80 text-xs font-medium">Parent Account • {selectedParent.date}</p>
                            </div>
                        </div>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button onClick={() => { setIsEditing(false); setEditData(selectedParent); }} className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/40 text-white rounded-lg hover:bg-white/30 transition-all text-sm font-medium">
                                    <FontAwesomeIcon icon={faTimes} className="mr-1" />Cancel
                                </button>
                                <button onClick={handleSaveEdit} className="px-4 py-2 bg-white text-black rounded-lg hover:shadow-lg transition-all text-sm font-medium">
                                    <FontAwesomeIcon icon={faCheck} className="mr-1" />Save
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white text-black rounded-lg hover:shadow-lg transition-all text-sm font-medium">
                                <FontAwesomeIcon icon={faEdit} className="mr-1" />Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                        {/* Child Name Card */}
                        <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                            <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                            <div className="relative p-4">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                    <FontAwesomeIcon icon={faChild} className="text-white text-sm" />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Child Name</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editData.childName}
                                        onChange={(e) => setEditData({ ...editData, childName: e.target.value })}
                                        className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                        style={{ borderColor: '#40189d' }}
                                    />
                                ) : (
                                    <p className="text-lg font-bold text-black">{selectedParent.childName}</p>
                                )}
                            </div>
                        </div>

                        {/* Mobile Card */}
                        <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                            <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                            <div className="relative p-4">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                    <FontAwesomeIcon icon={faPhone} className="text-white text-sm" />
                                </div>
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Mobile Number</p>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editData.mobile}
                                        onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                                        className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                        style={{ borderColor: '#40189d' }}
                                    />
                                ) : (
                                    <p className="text-lg font-bold text-black">{selectedParent.mobile}</p>
                                )}
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="lg:col-span-3 group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                            <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                            <div className="relative p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Location Address</p>
                                </div>
                                {isEditing && editData ? (
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={editData.location}
                                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                            placeholder="Search for a location..."
                                            className="w-full border-2 rounded-lg px-3 py-2 text-base font-semibold outline-none"
                                            style={{ borderColor: '#40189d' }}
                                        />
                                        <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                ) : (
                                    <p className="text-lg font-bold text-black">{selectedParent.location}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Distance Banner */}
                    <div className="relative overflow-hidden rounded-xl shadow-lg mb-4" style={{ backgroundColor: '#40189d' }}>
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white -mr-20 -mt-20"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white -ml-16 -mb-16"></div>
                        </div>
                        <div className="relative p-5 flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs font-bold uppercase tracking-wide mb-1">Distance from School</p>
                                <p className="text-4xl font-bold text-white">{selectedParent.distance || '0 km'}</p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-100">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="text-base font-bold text-black mb-2">Location Map</h3>
                            {isEditing && (
                                <div className="mb-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={mapSearchQuery}
                                            onChange={async (e) => {
                                                const query = e.target.value;
                                                setMapSearchQuery(query);
                                                if (query.length > 2) {
                                                    try {
                                                        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`);
                                                        const data = await response.json();
                                                        setLocationSuggestions(data);
                                                        setShowSuggestions(true);
                                                    } catch (error) {
                                                        console.error('Error fetching suggestions:', error);
                                                    }
                                                } else {
                                                    setShowSuggestions(false);
                                                }
                                            }}
                                            onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
                                            placeholder="Search location (e.g., Karaikudi, New York, Paris)..."
                                            className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none"
                                            style={{ borderColor: '#40189d' }}
                                        />
                                        {showSuggestions && locationSuggestions.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto" style={{ borderColor: '#40189d' }}>
                                                {locationSuggestions.map((suggestion, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={async () => {
                                                            const { lat, lon, display_name } = suggestion;
                                                            setMapSearchQuery(display_name);
                                                            setEditData({ ...editData, location: display_name });
                                                            setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
                                                            setMapCenter([parseFloat(lat), parseFloat(lon)]);
                                                            setShowSuggestions(false);
                                                            if (mapRef.current) {
                                                                mapRef.current.setView([parseFloat(lat), parseFloat(lon)], 15);
                                                            }
                                                        }}
                                                        className="w-full text-left px-3 py-2 hover:bg-purple-50 transition-colors text-sm border-b border-gray-100 last:border-b-0"
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#40189d' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span className="text-gray-700">{suggestion.display_name}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-xs font-bold" style={{ color: '#40189d' }}>Selected: {editData?.location || 'None'}</p>
                                        <p className="text-xs text-gray-500 mt-1">💡 Tip: Click on the map to select a location</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="h-64 relative bg-gray-100">
                            <LocationMap
                                center={mapCenter}
                                markerPosition={markerPosition}
                                isEditing={isEditing}
                                onLocationSelect={async (lat, lng) => {
                                    if (isEditing) {
                                        setMarkerPosition([lat, lng]);
                                        try {
                                            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                                            const data = await response.json();
                                            const locationName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                                            setMapSearchQuery(locationName);
                                            setEditData({ ...editData, location: locationName });
                                        } catch (error) {
                                            console.error('Error reverse geocoding:', error);
                                            const locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                                            setMapSearchQuery(locationName);
                                            setEditData({ ...editData, location: locationName });
                                        }
                                    }
                                }}
                                mapRef={mapRef}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDetail;
