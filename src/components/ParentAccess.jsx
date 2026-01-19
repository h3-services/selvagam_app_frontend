import { useState, useEffect, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { CiMenuKebab } from "react-icons/ci";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTrash, faCheck, faTimes, faSearch, faEnvelope, faUser, faChild, faPhone, faEye, faEdit, faClock, faArrowLeft, faChevronRight, faEllipsisV, faRoute } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#40189d" stroke="white" stroke-width="2"/><circle cx="12" cy="9" r="2.5" fill="white"/></svg>`),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const ParentAccess = () => {
  const [parents, setParents] = useState([
    { id: 1, name: "Parent 1", childName: "Student 1, Student 9", mobile: "9876543210", location: "123 Main St, New York", date: "2024-01-15", status: 'Approved' },
    { id: 2, name: "Parent 2", childName: "Student 2", mobile: "9876543211", location: "456 Elm St, Los Angeles", date: "2024-02-10", status: 'Inactive' },
    { id: 3, name: "Parent 3", childName: "Student 3, Student 10", mobile: "9876543212", location: "789 Pine St, Chicago", date: "2024-03-05", status: 'Inactive' },
    { id: 4, name: "Parent 4", childName: "Student 4", mobile: "9876543213", location: "321 Oak Ln, Houston", date: "2024-03-10", status: 'Inactive' },
    { id: 5, name: "Parent 5", childName: "Student 5", mobile: "9876543214", location: "654 Maple Dr, Seattle", date: "2024-03-12", status: 'Approved' },
    { id: 6, name: "Parent 6", childName: "Student 6", mobile: "9876543215", location: "987 Cedar Rd, Boston", date: "2024-03-15", status: 'Inactive' },
    { id: 7, name: "Parent 7", childName: "Student 7", mobile: "9876543216", location: "159 Birch Blvd, Miami", date: "2024-03-18", status: 'Approved' },
    { id: 8, name: "Parent 8", childName: "Student 8", mobile: "9876543217", location: "753 Spruce Way, Denver", date: "2024-03-20", status: 'Inactive' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newParent, setNewParent] = useState({ name: '', childName: '', mobile: '', location: '', status: 'Inactive' });
  const [search, setSearch] = useState('');
  const [selectedParent, setSelectedParent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [tempLocation, setTempLocation] = useState('');
  const [markerPosition, setMarkerPosition] = useState([40.7128, -74.0060]);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [tempMapSearchQuery, setTempMapSearchQuery] = useState('');
  const [tempMarkerPosition, setTempMarkerPosition] = useState([40.7128, -74.0060]);
  const [tempMapCenter, setTempMapCenter] = useState([40.7128, -74.0060]);
  const [tempLocationSuggestions, setTempLocationSuggestions] = useState([]);
  const [showTempSuggestions, setShowTempSuggestions] = useState(false);
  const mapRef = useRef(null);
  const tempMapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All"); // All, Approved, Inactive
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivatingItemId, setDeactivatingItemId] = useState(null);
  const [deactivationReason, setDeactivationReason] = useState("");

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Handlers for Approval Workflow
  const handleApprove = (id) => {
    setParents(parents.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
  };

  const handleDeactivate = (id) => {
    setDeactivatingItemId(id);
    setDeactivationReason("");
    setShowDeactivateModal(true);
  };

  const confirmDeactivation = () => {
    if (deactivatingItemId) {
      setParents(parents.map(p => p.id === deactivatingItemId ? { ...p, status: 'Inactive', deactivationReason } : p));
      setDeactivatingItemId(null);
      setDeactivationReason("");
      setShowDeactivateModal(false);
    }
  };

  const filteredParents = useMemo(() => {
    let result = parents;

    // Filter by Tab
    if (activeTab !== "All") {
      result = result.filter(parent => parent.status === activeTab);
    }

    // Filter by Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (parent) =>
          parent.name.toLowerCase().includes(lowerQuery) ||
          parent.childName.toLowerCase().includes(lowerQuery)
      );
    }
    return result;
  }, [parents, searchQuery, activeTab]);

  // Geocode location when parent is selected
  useEffect(() => {
    if (selectedParent && !isEditing) {
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
  }, [selectedParent, isEditing]);

  const handleAdd = () => {
    if (newParent.name && newParent.mobile) {
      setParents([...parents, {
        id: Date.now(),
        name: newParent.name,
        childName: newParent.childName,
        mobile: newParent.mobile,
        location: newParent.location || 'Not specified',
        distance: '0 km',
        date: new Date().toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
        status: newParent.status || 'Inactive'
      }]);
      setNewParent({ name: '', childName: '', mobile: '', location: '', status: 'Inactive' });
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setParents(parents.filter(p => p.id !== itemToDelete));
      setItemToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleEdit = async () => {
    setIsEditing(true);
    setEditData({ ...selectedParent });
    setMapSearchQuery(selectedParent.location);

    // Geocode the location to get coordinates
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

  const handleSaveEdit = () => {
    const updatedData = { ...editData, date: new Date().toISOString().split('T')[0] };
    setParents(parents.map(p => p.id === updatedData.id ? updatedData : p));
    setSelectedParent(updatedData);
    setIsEditing(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold ml-20 lg:ml-0">Parent Access</h2>
          <p className="text-sm text-gray-500 mt-1 ml-20 lg:ml-0">Authorize and manage parent accounts</p>
        </div>
        <div className="w-full sm:w-auto relative sm:min-w-[300px] lg:hidden">
          <input
            type="text"
            placeholder="Search parents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 pl-12 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-100 focus:border-purple-400 focus:bg-white shadow-sm hover:shadow-md transition-all text-sm outline-none"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
        </div>
      </div>



      {selectedParent && (
        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={() => { setSelectedParent(null); setIsEditing(false); }}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md flex items-center justify-center text-gray-600 transition-all hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-gray-500">Back to List</span>
            <span style={{ color: '#40189d' }}>/</span>
            <span style={{ color: '#40189d' }}>{selectedParent.name}</span>
          </div>
        </div>
      )}

      {!selectedParent && (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-2">
          <div className="flex flex-col items-start gap-2 w-full lg:w-auto pl-6">
            <div className="relative w-full lg:w-96 hidden lg:block">
              <input
                type="text"
                placeholder="Search parents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-xl bg-white border border-purple-100 focus:border-purple-400 focus:bg-white transition-all text-sm outline-none shadow-sm"
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="bg-white p-1.5 rounded-full shadow-sm border border-purple-100 flex items-center">
            {['All', 'Approved', 'Inactive'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab
                  ? 'text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50'
                  }`}
                style={activeTab === tab ? { backgroundColor: COLORS.SIDEBAR_BG } : {}}
              >
                {tab}
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {tab === 'All' ? parents.length : parents.filter(p => p.status === tab).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className="flex-1 overflow-hidden h-full flex flex-col">
          {selectedParent ? (
            <div className="h-full bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Hero Header Section */}
              <div className="relative p-5" style={{ backgroundColor: '#40189d' }}>
                <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
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

              {/* Content Section */}
              <div className="p-5">
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
                      {isEditing ? (
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
                      <p className="text-4xl font-bold text-white">{selectedParent.distance}</p>
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
                          <p className="text-xs font-bold" style={{ color: '#40189d' }}>Selected: {editData.location || 'None'}</p>
                          <p className="text-xs text-gray-500 mt-1">💡 Tip: {isEditing ? 'Click on the map to select a location or search above' : 'Search for a location above'}</p>
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
          ) : (
            <>
              {/* Desktop/Tablet Table View */}
              <div className="hidden lg:flex lg:flex-col w-full bg-white rounded-3xl shadow-xl overflow-hidden p-6 h-full">
                {/* Header removed and moved to top toolbar */}
                <div className="ag-theme-quartz w-full flex-1" style={{
                  minHeight: 0,
                  '--ag-header-background-color': '#f8f5ff',
                  '--ag-header-foreground-color': '#40189d',
                  '--ag-font-family': 'inherit',
                  '--ag-border-radius': '16px',
                  '--ag-row-hover-color': '#faf5ff',
                }}>
                  <AgGridReact
                    rowData={filteredParents}
                    columnDefs={[
                      {
                        headerName: "Parent Name",
                        field: "name",
                        flex: 1.5,
                        cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
                        cellRenderer: (params) => (
                          <div
                            className="flex items-start gap-3 w-full cursor-pointer group"
                            onClick={() => { setSelectedParent(params.data); setShowForm(false); }}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: '#40189d' }}>
                              {params.value.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <p className="font-bold text-gray-900 leading-none group-hover:text-purple-700 transition-colors">{params.value}</p>
                              <div className="flex items-center gap-1 -mt-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-purple-600 transition-colors">View Details</span>
                                <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-gray-300 group-hover:text-purple-600 transition-colors" />
                              </div>
                            </div>
                          </div>
                        )
                      },
                      {
                        headerName: "Child Name",
                        field: "childName",
                        flex: 1.2,
                        cellStyle: { display: 'flex', alignItems: 'center', fontWeight: '500', color: '#374151' }
                      },

                      {
                        headerName: "Mobile",
                        field: "mobile",
                        flex: 1,
                        cellStyle: { display: 'flex', alignItems: 'center', fontWeight: '500' }
                      },
                      {
                        headerName: "Location",
                        field: "location",
                        flex: 1.5,
                        cellStyle: { display: 'flex', alignItems: 'center' },
                        cellRenderer: (params) => (
                          <div className="flex items-center gap-2 truncate" title={params.value}>
                            <FontAwesomeIcon icon={faRoute} className="text-purple-400 text-xs shrink-0" />
                            <span className="text-sm text-gray-600 truncate">{params.value}</span>
                          </div>
                        )
                      },
                      {
                        headerName: "STATUS",
                        field: "status",
                        flex: 1,
                        cellRenderer: (params) => {
                          const statusColors = {
                            Approved: 'bg-green-100 text-green-700 border-green-200',
                            Inactive: 'bg-red-100 text-red-700 border-red-200'
                          };
                          return (
                            <div className="flex items-center h-full">
                              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColors[params.value] || 'bg-gray-100 text-gray-500'}`}>
                                {params.value}
                              </span>
                            </div>
                          );
                        }
                      },
                      {
                        headerName: "ACTIONS",
                        field: "id",
                        width: 100,
                        sortable: false,
                        filter: false,
                        cellStyle: { overflow: 'visible' },
                        cellRenderer: (params) => {
                          const rowsPerPage = params.api.paginationGetPageSize();
                          const indexOnPage = params.node.rowIndex % rowsPerPage;
                          const totalRows = params.api.getDisplayedRowCount();
                          const isLastRows = totalRows > 2 && (indexOnPage >= rowsPerPage - 2 || params.node.rowIndex >= totalRows - 2);
                          const isApproved = (params.data.status || '').toLowerCase() === 'approved';

                          return (
                            <div className="flex items-center justify-center h-full relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentId = params.context.activeMenuId;
                                  const clickedId = params.data.id;
                                  params.context.setActiveMenuId(currentId === clickedId ? null : clickedId);
                                }}
                                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center text-xl ${params.context.activeMenuId === params.data.id
                                  ? "bg-purple-100 text-purple-600 shadow-inner"
                                  : "text-gray-400 hover:bg-gray-100"
                                  }`}
                              >
                                <CiMenuKebab />
                              </button>

                              {params.context.activeMenuId === params.data.id && (
                                <div className={`absolute right-0 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white py-2.5 w-44 z-[999] animate-in fade-in zoom-in duration-200 ${isLastRows
                                  ? "bottom-[80%] mb-2 slide-in-from-bottom-2"
                                  : "top-[80%] mt-2 slide-in-from-top-2"
                                  }`}>
                                  <div className="px-3 pb-1.5 mb-1.5 border-b border-gray-100/50">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</p>
                                  </div>
                                  {isApproved ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeactivate(params.data.id);
                                        params.context.setActiveMenuId(null);
                                      }}
                                      className="w-[calc(100%-16px)] mx-2 text-left px-3 py-2 text-sm text-red-600 hover:bg-red-600 hover:text-white rounded-xl flex items-center gap-3 transition-all duration-200 group/item"
                                    >
                                      <div className="w-6 h-6 rounded-lg bg-red-50 group-hover/item:bg-white/20 flex items-center justify-center transition-colors">
                                        <FontAwesomeIcon icon={faTimes} className="text-[10px]" />
                                      </div>
                                      <span className="font-medium">Set Inactive</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleApprove(params.data.id);
                                        params.context.setActiveMenuId(null);
                                      }}
                                      className="w-[calc(100%-16px)] mx-2 text-left px-3 py-2 text-sm text-green-600 hover:bg-green-600 hover:text-white rounded-xl flex items-center gap-3 transition-all duration-200 group/item"
                                    >
                                      <div className="w-6 h-6 rounded-lg bg-green-50 group-hover/item:bg-white/20 flex items-center justify-center transition-colors">
                                        <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                                      </div>
                                      <span className="font-medium">Approve</span>
                                    </button>
                                  )}

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(params.data.id);
                                      params.context.setActiveMenuId(null);
                                    }}
                                    className="w-[calc(100%-16px)] mx-2 mt-1 text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-900 hover:text-white rounded-xl flex items-center gap-3 transition-all duration-200 group/item"
                                  >
                                    <div className="w-6 h-6 rounded-lg bg-gray-50 group-hover/item:bg-white/20 flex items-center justify-center transition-colors">
                                      <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                                    </div>
                                    <span className="font-medium">Delete Parent</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        }
                      }
                    ]}
                    context={{ activeMenuId, setActiveMenuId }}
                    getRowStyle={params => {
                      if (params.data.id === activeMenuId) {
                        return { zIndex: 999, overflow: 'visible' };
                      }
                      return { zIndex: 1 };
                    }}
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
                    overlayNoRowsTemplate='<span class="p-4">No parents found</span>'
                  />
                </div>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden p-4 space-y-4">
                {filteredParents.map((parent, index) => (
                  <div key={parent.id} className="relative bg-white rounded-3xl shadow-xl overflow-hidden" style={{ border: '2px solid #e9d5ff' }}>
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ backgroundColor: '#40189d' }}></div>
                    <div className="relative p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: '#40189d' }}>
                            {parent.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{parent.name}</h3>
                            <p className="text-xs font-medium" style={{ color: '#40189d' }}>{parent.date}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(parent.id)}
                          className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-sm" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                          <div className="flex items-center gap-2 mb-1">
                            <FontAwesomeIcon icon={faChild} className="text-xs" style={{ color: '#40189d' }} />
                            <p className="text-xs text-gray-500 font-medium">Child</p>
                          </div>
                          <p className="text-sm text-gray-900 font-bold truncate">{parent.childName}</p>
                        </div>
                        <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                          <div className="flex items-center gap-2 mb-1">
                            <FontAwesomeIcon icon={faPhone} className="text-xs" style={{ color: '#40189d' }} />
                            <p className="text-xs text-gray-500 font-medium">Mobile</p>
                          </div>
                          <p className="text-sm text-gray-900 font-bold truncate">{parent.mobile}</p>
                        </div>
                      </div>




                      <div className="mb-4 flex flex-wrap gap-2">
                        {parent.status !== 'Approved' ? (
                          <button
                            onClick={() => handleApprove(parent.id)}
                            className="flex-1 min-w-[100px] py-2 bg-green-50 text-green-700 rounded-xl font-bold text-xs hover:bg-green-100 border border-green-100"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeactivate(parent.id)}
                            className="flex-1 min-w-[100px] py-2 bg-red-50 text-red-700 rounded-xl font-bold text-xs hover:bg-red-100 border border-red-100"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => { setSelectedParent(parent); setShowForm(false); }}
                        className="w-full py-3.5 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                        style={{ backgroundColor: '#40189d' }}
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2" /> View Full Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {showForm && (
          <>
            {/* Drawer Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1999]" onClick={() => setShowForm(false)}></div>

            {/* Right Side Drawer */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] shadow-2xl z-[2000] flex flex-col animate-slide-in" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
              <div className="relative p-8 border-b border-white/10">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition text-white/70 hover:text-white"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-white/10 backdrop-blur-sm border border-white/10">
                    <FontAwesomeIcon icon={faUserPlus} className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-white">Add Parent</h3>
                    <p className="text-white/60 text-sm">Enter parent information</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="space-y-5">


                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-white/90">Parent Name</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center bg-purple-50">
                        <FontAwesomeIcon icon={faUser} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={newParent.name}
                        onChange={(e) => setNewParent({ ...newParent, name: e.target.value })}
                        className="w-full bg-white border-none rounded-xl pl-16 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-purple-500/30 focus:outline-none transition shadow-sm text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Child Name Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-white/90">Child Name</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center bg-purple-50">
                        <FontAwesomeIcon icon={faChild} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter child's name (comma separated)"
                        value={newParent.childName}
                        onChange={(e) => setNewParent({ ...newParent, childName: e.target.value })}
                        className="w-full bg-white border-none rounded-xl pl-16 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-purple-500/30 focus:outline-none transition shadow-sm text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Mobile Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-white/90">Mobile Number</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center bg-purple-50">
                        <FontAwesomeIcon icon={faPhone} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                      </div>
                      <input
                        type="tel"
                        placeholder="555-0000"
                        value={newParent.mobile}
                        onChange={(e) => setNewParent({ ...newParent, mobile: e.target.value })}
                        className="w-full bg-white border-none rounded-xl pl-16 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-purple-500/30 focus:outline-none transition shadow-sm text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Status Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-white/90">Account Status</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center bg-purple-50">
                        <FontAwesomeIcon icon={faClock} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                      </div>
                      <select
                        value={newParent.status || 'Inactive'}
                        onChange={(e) => setNewParent({ ...newParent, status: e.target.value })}
                        className="w-full bg-white border-none rounded-xl pl-16 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-purple-500/30 focus:outline-none transition shadow-sm appearance-none text-gray-900"
                      >
                        <option value="Approved">Approved</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  {/* Location Input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-white/90">Location Address</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center bg-purple-50">
                        <svg className="w-4 h-4" style={{ color: COLORS.SIDEBAR_BG }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Select location..."
                        value={newParent.location}
                        readOnly
                        onClick={() => setShowLocationPicker(true)}
                        className="w-full bg-white border-none rounded-xl pl-16 pr-24 py-3.5 text-sm focus:ring-4 focus:ring-purple-500/30 focus:outline-none transition shadow-sm cursor-pointer hover:bg-purple-50 text-gray-900 placeholder:text-gray-400"
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

              <div className="p-8 border-t border-white/10 bg-transparent">
                <button
                  onClick={handleAdd}
                  className="w-full py-4 bg-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-base"
                  style={{ color: COLORS.SIDEBAR_BG }}
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  Add Parent
                </button>
              </div>
            </div>
          </>
        )}

        {!showForm && !selectedParent && (
          <button
            onClick={() => setShowForm(true)}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
            style={{ backgroundColor: COLORS.SIDEBAR_BG }}
          >
            <FontAwesomeIcon icon={faUserPlus} className="text-xl sm:text-2xl" />
          </button>
        )}

        {/* Location Picker Popup */}
        {showLocationPicker && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1500]" onClick={() => setShowLocationPicker(false)}></div>
            <div className="fixed left-0 top-0 bottom-0 w-full md:w-[500px] bg-white shadow-2xl z-[1501] flex flex-col animate-slide-in">
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
                    setNewParent({ ...newParent, location: tempMapSearchQuery });
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
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-white p-8 w-full max-w-sm animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                <FontAwesomeIcon icon={faTrash} className="text-2xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Are you sure you want to delete this parent record? This action cannot be undone and will remove all associated data.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deactivation Reason Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowDeactivateModal(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-white p-8 w-full max-w-sm animate-in zoom-in slide-in-from-bottom-4 duration-300 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 mx-auto">
              <FontAwesomeIcon icon={faClock} className="text-2xl text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reason for Deactivation</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed text-center">
              Please provide a reason why this person is being moved to inactive status.
            </p>
            <textarea
              value={deactivationReason}
              onChange={(e) => setDeactivationReason(e.target.value)}
              placeholder="Enter reason here..."
              className="w-full p-4 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 resize-none bg-gray-50/50 mb-6 min-h-[100px]"
              autoFocus
            />
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeactivation}
                disabled={!deactivationReason.trim()}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${deactivationReason.trim()
                  ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// LocationMap Component with click-to-select
const LocationMap = ({ center, markerPosition, isEditing, onLocationSelect, mapRef }) => {
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (isEditing) {
          const { lat, lng } = e.latlng;
          onLocationSelect(lat, lng);
        }
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
      key={`${center[0]}-${center[1]}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && <Marker position={markerPosition} icon={customIcon} />}
      <MapClickHandler />
    </MapContainer>
  );
};

export default ParentAccess;

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
      @keyframes slide-in {
        from {transform: translateX(-100%); }
      to {transform: translateX(0); }
  }
      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
  }
      `;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
