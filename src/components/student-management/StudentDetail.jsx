import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimes, faCheck, faEdit, faChild, faPhone, faSearch, faArrowLeft, faUserTie, faEnvelope, faMapMarkerAlt, faInfoCircle, faEye, faRoute } from '@fortawesome/free-solid-svg-icons';
import LocationMap from './LocationMap';
import ParentViewDrawer from './ParentViewDrawer';
import { parentService } from '../../services/parentService';

const StudentDetail = ({ selectedStudent, onBack, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);
    const [parentDetail, setParentDetail] = useState(null);
    const [loadingParent, setLoadingParent] = useState(false);
    const [showParentDrawer, setShowParentDrawer] = useState(false);
    // ... rest of state ...
    const [mapSearchQuery, setMapSearchQuery] = useState('');
    const [markerPosition, setMarkerPosition] = useState([12.6074, 80.0463]);
    const [mapCenter, setMapCenter] = useState([12.6074, 80.0463]);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const mapRef = useRef(null);

    // Initial load and Geocode
    useEffect(() => {
        if (selectedStudent) {
            setEditData({ ...selectedStudent });
            setMapSearchQuery(selectedStudent.location);
            
            // Fetch detailed parent info if parent_id exists
            const parentId = selectedStudent.originalData?.parent_id;
            if (parentId) {
                fetchParentInfo(parentId);
            }

            // Geocode logic
            // Geocode logic
            const geocodeLocation = async () => {
                // If no location provided or it's a dummy placeholder, skip
                if (!selectedStudent.location || selectedStudent.location.includes("CityA")) return;

                try {
                    // unexpected 522 from allorigins, trying codetabs
                    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(selectedStudent.location)}&limit=1`;
                    // CodeTabs proxy is another alternative
                    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(nominatimUrl)}`;
                    
                    const response = await fetch(proxyUrl);
                    if (!response.ok) throw new Error('Geocoding failed');
                    
                    const data = await response.json(); // CodeTabs returns direct JSON, no wrapping

                    if (data && data.length > 0) {
                        const { lat, lon } = data[0];
                        setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
                        setMapCenter([parseFloat(lat), parseFloat(lon)]);
                    }
                } catch (error) {
                    console.warn('Geocoding error (likely CORS/Proxy):', error.message);
                }
            };
            geocodeLocation();
        }
    }, [selectedStudent]);

    const fetchParentInfo = async (id) => {
        setLoadingParent(true);
        try {
            const data = await parentService.getParentById(id);
            setParentDetail(data);
        } catch (error) {
            console.error("Error fetching parent details:", error);
        } finally {
            setLoadingParent(false);
        }
    };

    const handleSaveEdit = () => {
        const updatedData = { ...editData, date: new Date().toISOString().split('T')[0] };
        onUpdate(updatedData);
        setIsEditing(false);
    };

    return (
        <div className="flex-1 overflow-hidden h-full flex flex-col">
            <div className="h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header Section */}
                <div className="relative p-8 border-b border-purple-100 bg-gradient-to-br from-purple-50 to-white">
                    <div className="relative flex flex-col md:flex-row items-center md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={onBack}
                                className="w-12 h-12 rounded-2xl bg-white border border-purple-100 flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-all shadow-md"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                            <div className="relative">
                                <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-xl" style={{ backgroundColor: '#40189d' }}>
                                    {selectedStudent.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-lg border-2 border-purple-100">
                                    <FontAwesomeIcon icon={faChild} className="text-xs text-purple-600" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#40189d' }}>{selectedStudent.name}</h2>

                            </div>
                        </div>
                        {isEditing ? (
                            <div className="flex gap-3">
                                <button onClick={() => { setIsEditing(false); setEditData(selectedStudent); }} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all text-sm font-bold shadow-sm">
                                    <FontAwesomeIcon icon={faTimes} className="mr-2" />Cancel
                                </button>
                                <button onClick={handleSaveEdit} className="px-6 py-2.5 text-white rounded-xl hover:shadow-xl transition-all text-sm font-bold flex items-center gap-2" style={{ backgroundColor: '#40189d' }}>
                                    <FontAwesomeIcon icon={faCheck} />Save Changes
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 text-white rounded-xl hover:shadow-lg transition-all text-sm font-bold" style={{ backgroundColor: '#40189d' }}>
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 overflow-y-auto flex-1 bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Left Side: Parent Detail Block */}
                        <div 
                            onClick={() => !isEditing && setShowParentDrawer(true)}
                            className={`group relative p-8 rounded-[32px] bg-white border-2 transition-all duration-300 shadow-sm ${!isEditing ? 'cursor-pointer hover:shadow-2xl hover:border-purple-400 border-gray-100' : 'border-purple-100'}`}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-[#40189d] shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    <FontAwesomeIcon icon={faUserTie} className="text-2xl" />
                                </div>
                                {!isEditing && (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#40189d] border border-gray-100 shadow-sm">
                                        <span className="text-[10px] font-black uppercase tracking-wider">Expand Details</span>
                                        <FontAwesomeIcon icon={faEye} className="text-[10px]" />
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-[11px] font-black uppercase tracking-[2.5px] text-gray-400 mb-3">Guardian Information</h3>
                            <div className="flex flex-col">
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <p className="text-3xl font-black text-gray-900 tracking-tight group-hover:text-[#40189d] transition-colors">
                                        {selectedStudent.primaryParent}
                                    </p>
                                    {parentDetail?.parent_role && (
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-md" style={{ backgroundColor: '#40189d' }}>
                                            {parentDetail.parent_role}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group-hover:bg-purple-50/10 group-hover:border-purple-100 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#40189d] shadow-sm">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Email Address</p>
                                            <p className="text-sm font-bold text-gray-700">{selectedStudent.parentEmail || 'Not Provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group-hover:bg-purple-50/10 group-hover:border-purple-100 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#40189d] shadow-sm">
                                            <FontAwesomeIcon icon={faPhone} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Mobile Network</p>
                                            <p className="text-sm font-bold text-gray-700">{selectedStudent.mobile || 'Not Linked'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Student Detail Block */}
                        <div className="p-8 rounded-[32px] bg-white border-2 border-gray-100 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-[#40189d] shadow-inner">
                                    <FontAwesomeIcon icon={faChild} className="text-2xl" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase text-white" style={{ backgroundColor: '#40189d' }}>
                                        {selectedStudent.status}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-[11px] font-black uppercase tracking-[2.5px] text-gray-400 mb-6">Student Records</h3>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Date of Birth</p>
                                    <p className="text-lg font-black text-gray-900">{selectedStudent.originalData?.dob || '14 Oct 2012'}</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Gender</p>
                                    <p className="text-lg font-black text-gray-900">{selectedStudent.originalData?.gender || 'Male'}</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Grade / Class</p>
                                    <p className="text-lg font-black text-gray-900">{selectedStudent.originalData?.grade || 'Grade 7-B'}</p>
                                </div>
                                <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Joining Date</p>
                                    <p className="text-lg font-black text-gray-900">{selectedStudent.date}</p>
                                </div>
                            </div>


                        </div>

                        {/* Address & Map Section - Bottom Full Width */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="p-8 rounded-[40px] bg-white border-2 border-gray-100 shadow-xl">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#40189d] shadow-inner">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-lg" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-800">Home Location</h3>
                                                    <p className="text-xs text-gray-400">Primary pickup-drop address</p>
                                                </div>
                                            </div>
                                            {isEditing ? (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={editData.location}
                                                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                                        placeholder="Update address..."
                                                        className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-base font-bold outline-none focus:border-[#40189d] transition-all shadow-inner"
                                                    />
                                                    <FontAwesomeIcon icon={faSearch} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" />
                                                </div>
                                            ) : (
                                                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                                                    <p className="text-lg font-bold text-gray-900 leading-relaxed italic">
                                                        "{selectedStudent.location}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 rounded-3xl text-white shadow-xl relative overflow-hidden" style={{ backgroundColor: '#40189d' }}>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                            <div className="relative flex items-center justify-between">
                                                <div>
                                                    <p className="text-purple-100 text-[10px] font-bold uppercase tracking-widest mb-1">Route Distance</p>
                                                    <p className="text-4xl font-black">{selectedStudent.distance || '4.2 km'}</p>
                                                </div>
                                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                                    <FontAwesomeIcon icon={faRoute} className="text-2xl" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mini Map View */}
                                    <div className="w-full md:w-96 h-80 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl relative bg-gray-100">
                                        <LocationMap
                                            center={mapCenter}
                                            markerPosition={markerPosition}
                                            isEditing={isEditing}
                                            onLocationSelect={async (lat, lng) => {
                                                if (isEditing) {
                                                    setMarkerPosition([lat, lng]);
                                                    try {
                                                        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
                                                        const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(nominatimUrl)}`;
                                                        
                                                        const response = await fetch(proxyUrl);
                                                        const data = await response.json(); // CodeTabs direct JSON

                                                        const locationName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                                                        setMapSearchQuery(locationName);
                                                        setEditData({ ...editData, location: locationName });
                                                    } catch (error) {
                                                        // Suppress error - fallback to coords
                                                        const locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                                                        setMapSearchQuery(locationName);
                                                        setEditData({ ...editData, location: locationName });
                                                    }
                                                }
                                            }}
                                            mapRef={mapRef}
                                        />
                                        {isEditing && (
                                            <div className="absolute top-4 left-4 right-4 z-[400]">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={mapSearchQuery}
                                                        onChange={async (e) => {
                                                            const query = e.target.value;
                                                            setMapSearchQuery(query);
                                                            if (query.length > 2) {
                                                                try {
                                                                    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
                                                                    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(nominatimUrl)}`;
                                                                    
                                                                    const resp = await fetch(proxyUrl);
                                                                    const data = await resp.json(); // CodeTabs direct JSON
                                                                    
                                                                    setLocationSuggestions(data);
                                                                    setShowSuggestions(true);
                                                                } catch (err) {
                                                                    // Suppress error
                                                                }
                                                            }
                                                        }}
                                                        placeholder="Search on map..."
                                                        className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-2 text-xs shadow-xl outline-none focus:border-purple-500"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            
            {/* Parent Details Side Drawer */}
            <ParentViewDrawer 
                show={showParentDrawer}
                onClose={() => setShowParentDrawer(false)}
                parentData={parentDetail}
            />
            </div>
        </div>
    );
};

export default StudentDetail;
