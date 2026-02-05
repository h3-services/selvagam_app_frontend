import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faUser, faPhone, faChild, faCheck, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import LocationMap from './LocationMap';

const AddStudentForm = ({ show, onClose, onAdd }) => {
    const [newStudent, setNewStudent] = useState({ name: '', parentName: '', mobile: '', location: '', status: 'Inactive' });
    const [showLocationPicker, setShowLocationPicker] = useState(false);

    // Map Picker State
    const [tempMapSearchQuery, setTempMapSearchQuery] = useState('');
    const [tempMarkerPosition, setTempMarkerPosition] = useState([12.6074, 80.0463]);
    const [tempMapCenter, setTempMapCenter] = useState([12.6074, 80.0463]);
    const [tempLocationSuggestions, setTempLocationSuggestions] = useState([]);
    const [showTempSuggestions, setShowTempSuggestions] = useState(false);
    const tempMapRef = useRef(null);

    const handleAdd = () => {
        if (newStudent.name && newStudent.mobile) {
            onAdd(newStudent);
            setNewStudent({ name: '', parentName: '', mobile: '', location: '', status: 'Inactive' });
        }
    };

    if (!show) return null;

    return (
        <>
            {/* Drawer Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1999]" onClick={onClose}></div>

            {/* Right Side Drawer */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-gradient-to-br from-purple-50 to-white shadow-2xl z-[2000] flex flex-col animate-slide-in">
                <div className="relative p-8 border-b border-purple-100">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-100 transition"
                        style={{ color: COLORS.SIDEBAR_BG }}
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </button>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
                            <FontAwesomeIcon icon={faUserPlus} className="text-white text-2xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl" style={{ color: COLORS.SIDEBAR_BG }}>Add Student</h3>
                            <p className="text-gray-500 text-sm">Enter student information</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="space-y-5">
                        {/* Name Input */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Student Name</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faChild} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    value={newStudent.name}
                                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Parent Name Input */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Parent Name</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faUserTie} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter parent's name"
                                    value={newStudent.parentName}
                                    onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Mobile Input */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Mobile Number</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <FontAwesomeIcon icon={faPhone} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="555-0000"
                                    value={newStudent.mobile}
                                    onChange={(e) => setNewStudent({ ...newStudent, mobile: e.target.value })}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Location Input */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Location Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                    <svg className="w-4 h-4" style={{ color: COLORS.SIDEBAR_BG }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Select location..."
                                    value={newStudent.location}
                                    readOnly
                                    onClick={() => setShowLocationPicker(true)}
                                    className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-24 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm cursor-pointer hover:bg-purple-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowLocationPicker(true)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-bold text-white rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
                                    style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                                >
                                    Pick Map
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-purple-100 bg-transparent">
                    <button
                        onClick={handleAdd}
                        className="w-full py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-base text-white"
                        style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                    >
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                        Add Student
                    </button>
                </div>
            </div>

            {/* Location Picker Popup */}
            {showLocationPicker && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2500]" onClick={() => setShowLocationPicker(false)}></div>
                    <div className="fixed left-0 top-0 bottom-0 w-full md:w-[500px] bg-white shadow-2xl z-[2501] flex flex-col animate-slide-in">
                        <div className="p-4 border-b border-gray-200" style={{ backgroundColor: '#40189d' }}>
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Pick Location</h3>
                                <button
                                    onClick={() => setShowLocationPicker(false)}
                                    className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={tempMapSearchQuery}
                                    onChange={async (e) => {
                                        const query = e.target.value;
                                        setTempMapSearchQuery(query);
                                        if (query.length > 2) {
                                            try {
                                                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`);
                                                const data = await response.json();
                                                setTempLocationSuggestions(data);
                                                setShowTempSuggestions(true);
                                            } catch (error) {
                                                console.error('Error fetching suggestions:', error);
                                            }
                                        } else {
                                            setShowTempSuggestions(false);
                                        }
                                    }}
                                    onFocus={() => tempLocationSuggestions.length > 0 && setShowTempSuggestions(true)}
                                    placeholder="Search location (e.g., Karaikudi, New York, Paris)..."
                                    className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none"
                                    style={{ borderColor: '#40189d' }}
                                />
                                {showTempSuggestions && tempLocationSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto" style={{ borderColor: '#40189d' }}>
                                        {tempLocationSuggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={async () => {
                                                    const { lat, lon, display_name } = suggestion;
                                                    setTempMapSearchQuery(display_name);
                                                    setTempMarkerPosition([parseFloat(lat), parseFloat(lon)]);
                                                    setTempMapCenter([parseFloat(lat), parseFloat(lon)]);
                                                    setShowTempSuggestions(false);
                                                    if (tempMapRef.current) {
                                                        tempMapRef.current.setView([parseFloat(lat), parseFloat(lon)], 15);
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
                            <p className="text-xs text-gray-500 mt-2">💡 Click on the map or search above to select a location</p>
                        </div>

                        <div className="flex-1 relative">
                            <LocationMap
                                center={tempMapCenter}
                                markerPosition={tempMarkerPosition}
                                isEditing={true}
                                onLocationSelect={async (lat, lng) => {
                                    setTempMarkerPosition([lat, lng]);
                                    try {
                                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                                        const data = await response.json();
                                        const locationName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                                        setTempMapSearchQuery(locationName);
                                    } catch (error) {
                                        console.error('Error reverse geocoding:', error);
                                        const locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                                        setTempMapSearchQuery(locationName);
                                    }
                                }}
                                mapRef={tempMapRef}
                            />
                        </div>

                        <div className="p-4 border-t border-gray-200">
                            <div className="mb-3">
                                <p className="text-xs font-bold text-gray-500 mb-1">Selected Location:</p>
                                <p className="text-sm font-semibold" style={{ color: '#40189d' }}>{tempMapSearchQuery || 'None'}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setNewStudent({ ...newStudent, location: tempMapSearchQuery });
                                    setShowLocationPicker(false);
                                }}
                                disabled={!tempMapSearchQuery}
                                className="w-full py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#40189d' }}
                            >
                                <FontAwesomeIcon icon={faCheck} className="mr-2" />Done
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default AddStudentForm;
