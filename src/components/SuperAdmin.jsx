import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faEnvelope, faPhone, faPlus, faTimes, faCheck,
    faTrash, faPen, faShieldHalved, faLocationDot, faBuilding, faMapMarkerAlt, faClock
} from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ position, setPosition }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position ? (
        <Marker position={position}>
            <Popup>Selected Location</Popup>
        </Marker>
    ) : null;
};

const SuperAdmin = () => {
    const [admins, setAdmins] = useState([
        {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@hope3school.com',
            phone: '+91 9876543210',
            status: 'Active',
            role: 'Super Admin'
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.j@hope3school.com',
            phone: '+91 9876543211',
            status: 'Active',
            role: 'Admin'
        },
        {
            id: 3,
            name: 'Mike Wilson',
            email: 'mike.w@hope3school.com',
            phone: '+91 9876543212',
            status: 'Inactive',
            role: 'Admin'
        },
    ]);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', phone: '' });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(null); // 'admin' | 'location'
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [deactivatingItemId, setDeactivatingItemId] = useState(null);
    const [deactivationReason, setDeactivationReason] = useState("");

    // School Location State - Now supporting multiple locations
    const [locations, setLocations] = useState([
        {
            id: 1,
            name: 'Main Campus',
            address: '123 Education Lane, Knowledge City, Bangalore',
            lat: 12.9716,
            lng: 77.5946
        }
    ]);

    const [editingLocationId, setEditingLocationId] = useState(null);
    const [editLocationData, setEditLocationData] = useState(null);
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [newLocation, setNewLocation] = useState({
        name: '',
        address: '',
        lat: 12.9716, // Default fallback
        lng: 77.5946
    });

    // Admin Management Handlers
    const handleAdd = () => {
        if (newAdmin.name && newAdmin.email) {
            setAdmins([...admins, {
                id: Date.now(),
                ...newAdmin,
                status: 'Active',
                role: 'Admin'
            }]);
            setNewAdmin({ name: '', email: '', phone: '' });
            setIsAddOpen(false);
        }
    };

    const startEdit = (admin) => {
        setEditingId(admin.id);
        setEditData({ ...admin });
    };

    const saveEdit = () => {
        setAdmins(admins.map(a => a.id === editingId ? editData : a));
        setEditingId(null);
    };

    const toggleStatus = (id) => {
        const admin = admins.find(a => a.id === id);
        if (admin && admin.status === 'Active') {
            setDeactivatingItemId(id);
            setDeactivationReason("");
            setShowDeactivateModal(true);
        } else {
            setAdmins(admins.map(a =>
                a.id === id ? { ...a, status: 'Active' } : a
            ));
        }
    };

    const confirmDeactivation = () => {
        if (deactivatingItemId) {
            setAdmins(admins.map(a =>
                a.id === deactivatingItemId ? { ...a, status: 'Inactive', deactivationReason } : a
            ));
            setDeactivatingItemId(null);
            setDeactivationReason("");
            setShowDeactivateModal(false);
        }
    };

    // Location Management Handlers
    const handleAddLocation = () => {
        if (newLocation.name && newLocation.address) {
            setLocations([...locations, { ...newLocation, id: Date.now() }]);
            setNewLocation({ name: '', address: '', lat: 12.9716, lng: 77.5946 });
            setIsAddingLocation(false);
        }
    };

    const startEditLocation = (loc) => {
        setEditingLocationId(loc.id);
        setEditLocationData({ ...loc });
    };

    const saveEditLocation = () => {
        setLocations(locations.map(l => l.id === editingLocationId ? editLocationData : l));
        setEditingLocationId(null);
        setEditLocationData(null);
    };

    const handleDeleteAdmin = (id) => {
        setItemToDelete(id);
        setDeleteType('admin');
        setShowDeleteConfirm(true);
    };

    const handleDeleteLocation = (id) => {
        setItemToDelete(id);
        setDeleteType('location');
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (!itemToDelete || !deleteType) return;

        if (deleteType === 'admin') {
            setAdmins(admins.filter(a => a.id !== itemToDelete));
        } else if (deleteType === 'location') {
            setLocations(locations.filter(l => l.id !== itemToDelete));
            if (editingLocationId === itemToDelete) {
                setEditingLocationId(null);
                setEditLocationData(null);
            }
        }

        setShowDeleteConfirm(false);
        setItemToDelete(null);
        setDeleteType(null);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="ml-20 lg:ml-0">
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Administration</h1>
                            <p className="text-gray-500 text-sm">Control access and system configurations</p>
                        </div>
                    </div>
                </div>

                {/* Admin Team Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FontAwesomeIcon icon={faUser} className="text-indigo-600" />
                            School Management Team
                        </h2>
                        <button
                            onClick={() => setIsAddOpen(!isAddOpen)}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            {isAddOpen ? 'Close Form' : '+ Add New Admin'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Add New Admin Card */}
                        {isAddOpen && (
                            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden relative group animate-fade-in-up">
                                <div className="h-1 bg-indigo-500 w-full absolute top-0 left-0"></div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">New School Admin</h3>
                                    <div className="space-y-4">
                                        <input
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
                                            placeholder="Full Name"
                                            value={newAdmin.name}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                        />
                                        <input
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
                                            placeholder="Email Address"
                                            value={newAdmin.email}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                        />
                                        <input
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
                                            placeholder="Phone Number"
                                            value={newAdmin.phone}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                                        />
                                        <button
                                            onClick={handleAdd}
                                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm shadow-md mt-2"
                                        >
                                            Create Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Admin List Cards */}
                        {admins.map((admin) => (
                            <div key={admin.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${admin.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                <div className="p-6 pl-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                                {admin.name.charAt(0)}
                                            </div>
                                            <div>
                                                {editingId === admin.id ? (
                                                    <input
                                                        value={editData.name}
                                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                        className="font-bold text-gray-900 border-b border-indigo-200 focus:outline-none bg-transparent"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <h3 className="font-bold text-gray-900">{admin.name}</h3>
                                                )}
                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">School Admin</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            {editingId === admin.id ? (
                                                <>
                                                    <button onClick={saveEdit} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><FontAwesomeIcon icon={faCheck} /></button>
                                                    <button onClick={() => setEditingId(null)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FontAwesomeIcon icon={faTimes} /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEdit(admin)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><FontAwesomeIcon icon={faPen} size="sm" /></button>
                                                    <button onClick={() => handleDeleteAdmin(admin.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FontAwesomeIcon icon={faTrash} size="sm" /></button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 w-4" />
                                            {editingId === admin.id ? (
                                                <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="flex-1 border-b border-gray-200 focus:border-indigo-500 outline-none" />
                                            ) : (
                                                <span className="truncate">{admin.email}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <FontAwesomeIcon icon={faPhone} className="text-gray-400 w-4" />
                                            {editingId === admin.id ? (
                                                <input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="flex-1 border-b border-gray-200 focus:border-indigo-500 outline-none" />
                                            ) : (
                                                <span>{admin.phone}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <button
                                            onClick={() => toggleStatus(admin.id)}
                                            className={`text-xs font-bold px-3 py-1 rounded-full transition-colors border ${admin.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'
                                                }`}
                                        >
                                            {admin.status}
                                        </button>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Access</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {!isAddOpen && (
                            <button
                                onClick={() => setIsAddOpen(true)}
                                className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all min-h-[250px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                    <FontAwesomeIcon icon={faPlus} />
                                </div>
                                <span className="font-semibold text-sm">Add New Admin</span>
                            </button>
                        )}
                    </div>
                </section>

                {/* School Locations Section - UPDATED for Multiple Locations */}
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
                                                onClick={handleAddLocation}
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
                                            onClick={() => !editingLocationId && startEditLocation(loc)}
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
                                                            <button onClick={saveEditLocation} className="p-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 text-xs font-bold">Save</button>
                                                            <button onClick={() => handleDeleteLocation(loc.id)} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-bold">Delete</button>
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
                                Are you sure you want to delete this {deleteType === 'admin' ? 'admin account' : 'school location'}? This action cannot be undone and will remove all associated data.
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
                            Please provide a reason why this admin is being moved to inactive status.
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

export default SuperAdmin;
