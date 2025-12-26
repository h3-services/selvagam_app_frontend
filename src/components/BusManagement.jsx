import { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faTrash, faCheck, faTimes, faSearch, faEdit, faEye, faTools, faExclamationTriangle, faUserFriends, faUser, faPhone, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';

const BusManagement = () => {
    const [buses, setBuses] = useState([
        { id: 1, busNumber: 'BUS-101', capacity: 40, driverName: 'Robert Wilson', contactNumber: '555-0101', status: 'Active' },
        { id: 2, busNumber: 'BUS-102', capacity: 40, driverName: 'Sarah Martinez', contactNumber: '555-0102', status: 'Active' },
        { id: 3, busNumber: 'BUS-103', capacity: 35, driverName: 'David Brown', contactNumber: '555-0103', status: 'Maintenance' },
        { id: 4, busNumber: 'BUS-104', capacity: 40, driverName: 'Emily Davis', contactNumber: '555-0104', status: 'Active' },
        { id: 5, busNumber: 'BUS-105', capacity: 30, driverName: 'Michael Chen', contactNumber: '555-0105', status: 'Inactive' },
        { id: 6, busNumber: 'BUS-106', capacity: 40, driverName: 'Jessica Taylor', contactNumber: '555-0106', status: 'Active' },
        { id: 7, busNumber: 'BUS-107', capacity: 40, driverName: 'William Anderson', contactNumber: '555-0107', status: 'Active' },
        { id: 8, busNumber: 'BUS-108', capacity: 35, driverName: 'Olivia Thomas', contactNumber: '555-0108', status: 'Maintenance' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newBus, setNewBus] = useState({ busNumber: '', capacity: '', driverName: '', contactNumber: '', status: 'Active' });
    const [search, setSearch] = useState('');
    const [selectedBus, setSelectedBus] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    const filteredBuses = useMemo(() => {
        return buses.filter(b =>
            b.busNumber.toLowerCase().includes(search.toLowerCase()) ||
            b.driverName.toLowerCase().includes(search.toLowerCase())
        );
    }, [buses, search]);

    const handleAdd = () => {
        if (newBus.busNumber && newBus.driverName) {
            setBuses([...buses, {
                id: Date.now(),
                ...newBus
            }]);
            setNewBus({ busNumber: '', capacity: '', driverName: '', contactNumber: '', status: 'Active' });
            setShowModal(false);
        }
    };

    const handleDelete = (id) => {
        setBuses(buses.filter(b => b.id !== id));
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({ ...selectedBus });
    };

    const handleSaveEdit = () => {
        setBuses(buses.map(b => b.id === editData.id ? editData : b));
        setSelectedBus(editData);
        setIsEditing(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Maintenance': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Inactive': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 h-auto flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold ml-20 lg:ml-0">Bus Management</h2>
                    <p className="text-sm text-gray-500 mt-1 ml-20 lg:ml-0">Manage fleet and assign drivers</p>
                </div>
                <div className="w-full sm:w-auto relative sm:min-w-[300px]">
                    <input
                        type="text"
                        placeholder="Search buses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-5 py-3 pl-12 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-100 focus:border-purple-400 focus:bg-white shadow-sm hover:shadow-md transition-all text-sm outline-none"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                </div>
            </div>

            {!selectedBus && (
                <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="font-bold" style={{ color: '#40189d' }}>Table</span>
                    </div>
                </div>
            )}

            {selectedBus && (
                <div className="mb-4 flex items-center gap-4">
                    <button
                        onClick={() => { setSelectedBus(null); setIsEditing(false); }}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md flex items-center justify-center text-gray-600 transition-all hover:bg-gray-50"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-gray-500">Back to List</span>
                        <span style={{ color: '#40189d' }}>/</span>
                        <span style={{ color: '#40189d' }}>{selectedBus.busNumber}</span>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-hidden">
                {selectedBus ? (
                    <div className="h-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="relative p-5" style={{ backgroundColor: '#40189d' }}>
                            <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg bg-white/20 backdrop-blur-sm border-2 border-white/30">
                                            <FontAwesomeIcon icon={faBus} />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedBus.busNumber}</h2>
                                        <p className="text-white/80 text-xs font-medium">Capacity: {selectedBus.capacity} Seats</p>
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

                        <div className="p-5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Driver Card */}
                                <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                                    <div className="relative p-4">
                                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Assigned Driver</p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editData.driverName}
                                                onChange={(e) => setEditData({ ...editData, driverName: e.target.value })}
                                                className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                                style={{ borderColor: '#40189d' }}
                                            />
                                        ) : (
                                            <p className="text-lg font-bold text-black">{selectedBus.driverName}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Status Card */}
                                <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                                    <div className="relative p-4">
                                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Status</p>
                                        {isEditing ? (
                                            <select
                                                value={editData.status}
                                                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                                className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                                                style={{ borderColor: '#40189d' }}
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Maintenance">Maintenance</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedBus.status)}`}>
                                                {selectedBus.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block w-full bg-white rounded-3xl shadow-xl overflow-hidden p-6">
                            <div className="ag-theme-quartz w-full" style={{
                                height: 'calc(100vh - 220px)',
                                '--ag-header-background-color': '#f8f5ff',
                                '--ag-header-foreground-color': '#40189d',
                                '--ag-font-family': 'inherit',
                                '--ag-border-radius': '16px',
                                '--ag-row-hover-color': '#faf5ff',
                            }}>
                                <AgGridReact
                                    rowData={filteredBuses}
                                    columnDefs={[
                                        {
                                            headerName: "Bus Number",
                                            field: "busNumber",
                                            flex: 1,
                                            cellRenderer: (params) => (
                                                <div className="flex items-center gap-3 h-full">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm" style={{ backgroundColor: '#40189d' }}>
                                                        <FontAwesomeIcon icon={faBus} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 leading-tight">{params.value}</p>
                                                    </div>
                                                </div>
                                            )
                                        },
                                        {
                                            headerName: "Capacity",
                                            field: "capacity",
                                            flex: 1,
                                            cellStyle: { display: 'flex', alignItems: 'center' }
                                        },
                                        {
                                            headerName: "Driver Name",
                                            field: "driverName",
                                            flex: 1.5,
                                            cellStyle: { display: 'flex', alignItems: 'center', fontWeight: '500' }
                                        },
                                        {
                                            headerName: "Contact",
                                            field: "contactNumber",
                                            flex: 1,
                                            cellStyle: { display: 'flex', alignItems: 'center' }
                                        },
                                        {
                                            headerName: "Status",
                                            field: "status",
                                            flex: 1,
                                            cellRenderer: (params) => (
                                                <div className="flex items-center h-full">
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(params.value)}`}>
                                                        {params.value}
                                                    </span>
                                                </div>
                                            )
                                        },
                                        {
                                            headerName: "Actions",
                                            field: "id",
                                            width: 120,
                                            sortable: false,
                                            filter: false,
                                            cellRenderer: (params) => (
                                                <div className="flex items-center gap-2 h-full">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelectedBus(params.data); }}
                                                        className="w-8 h-8 rounded-lg text-purple-700 bg-purple-100 hover:bg-purple-200 transition-all flex items-center justify-center"
                                                        title="View Details"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} size="sm" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(params.data.id); }}
                                                        className="w-8 h-8 rounded-lg text-red-700 bg-red-100 hover:bg-red-200 transition-all flex items-center justify-center"
                                                        title="Delete"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} size="sm" />
                                                    </button>
                                                </div>
                                            )
                                        }
                                    ]}
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
                                    overlayNoRowsTemplate='<span class="p-4">No buses found</span>'
                                />
                            </div>
                        </div>

                        {/* Mobile/Tablet Card View */}
                        <div className="lg:hidden p-1 space-y-4 pb-24">
                            {filteredBuses.map((bus) => (
                                <div key={bus.id} className="relative bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                                    <div className="relative p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: '#40189d' }}>
                                                    <FontAwesomeIcon icon={faBus} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg">{bus.busNumber}</h3>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border inline-block mt-1 ${getStatusColor(bus.status)}`}>
                                                        {bus.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(bus.id)}
                                                className="w-10 h-10 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-all flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FontAwesomeIcon icon={faUser} className="text-xs" style={{ color: '#40189d' }} />
                                                    <p className="text-xs text-gray-500 font-medium">Driver</p>
                                                </div>
                                                <p className="text-sm text-gray-900 font-bold truncate">{bus.driverName}</p>
                                            </div>
                                            <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FontAwesomeIcon icon={faUserFriends} className="text-xs" style={{ color: '#40189d' }} />
                                                    <p className="text-xs text-gray-500 font-medium">Capacity</p>
                                                </div>
                                                <p className="text-sm text-gray-900 font-bold">{bus.capacity} Seats</p>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: '#f8f5ff' }}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <FontAwesomeIcon icon={faPhone} className="text-xs" style={{ color: '#40189d' }} />
                                                <p className="text-xs text-gray-500 font-medium">Contact</p>
                                            </div>
                                            <p className="text-sm text-gray-900 font-semibold">{bus.contactNumber}</p>
                                        </div>

                                        <button
                                            onClick={() => setSelectedBus(bus)}
                                            className="w-full py-3.5 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                                            style={{ backgroundColor: '#40189d' }}
                                        >
                                            <FontAwesomeIcon icon={faEye} className="mr-2" /> View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {!selectedBus && (
                <button
                    onClick={() => setShowModal(true)}
                    className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
                    style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                >
                    <FontAwesomeIcon icon={faBus} className="text-xl sm:text-2xl" />
                </button>
            )}

            {/* Add Bus Modal */}
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
                    <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-gradient-to-br from-purple-50 to-white shadow-2xl z-[2000] flex flex-col">
                        <div className="relative p-8 border-b border-purple-100">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-100 transition"
                                style={{ color: COLORS.SIDEBAR_BG }}
                            >
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
                                    <FontAwesomeIcon icon={faBus} className="text-white text-2xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl" style={{ color: COLORS.SIDEBAR_BG }}>Add New Bus</h3>
                                    <p className="text-gray-500 text-sm">Enter bus vehicle details</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Bus Number</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                            <FontAwesomeIcon icon={faBus} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="e.g. BUS-101"
                                            value={newBus.busNumber}
                                            onChange={(e) => setNewBus({ ...newBus, busNumber: e.target.value })}
                                            className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Capacity</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                            <FontAwesomeIcon icon={faUserFriends} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                        </div>
                                        <input
                                            type="number"
                                            placeholder="Number of seats"
                                            value={newBus.capacity}
                                            onChange={(e) => setNewBus({ ...newBus, capacity: e.target.value })}
                                            className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Driver Name</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                            <FontAwesomeIcon icon={faUser} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Assigned Driver Name"
                                            value={newBus.driverName}
                                            onChange={(e) => setNewBus({ ...newBus, driverName: e.target.value })}
                                            className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Contact Number</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                                            <FontAwesomeIcon icon={faPhone} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="Primary contact"
                                            value={newBus.contactNumber}
                                            onChange={(e) => setNewBus({ ...newBus, contactNumber: e.target.value })}
                                            className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Status</label>
                                    <div className="flex gap-2">
                                        {['Active', 'Maintenance', 'Inactive'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setNewBus({ ...newBus, status })}
                                                className={`flex-1 py-2 text-xs font-bold rounded-lg border-2 transition-all ${newBus.status === status
                                                    ? 'bg-purple-100 border-purple-500 text-purple-700'
                                                    : 'bg-white border-gray-100 text-gray-500 hover:border-purple-200'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-purple-100 bg-white">
                            <button
                                onClick={handleAdd}
                                className="w-full py-4 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-base"
                                style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                            >
                                <FontAwesomeIcon icon={faBus} className="mr-2" />
                                Add Bus
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default BusManagement;
