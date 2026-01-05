import { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { CiMenuKebab } from "react-icons/ci";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTrash, faCheck, faTimes, faSearch, faEnvelope, faUser, faPhone, faEye, faEdit, faIdCard, faCar, faArrowLeft, faRoute, faChevronRight, faEllipsisV, faClock } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Driver 1', email: 'driver1@example.com', mobile: '9876543210', licenseNumber: 'DL-2024-001', vehicleNumber: 'Bus 1 - TN 33 AA 1234', route: 'Gandhipuram - Railway Station', date: '2024-01-10', status: 'Active' },
    { id: 2, name: 'Driver 2', email: 'driver2@example.com', mobile: '9876543211', licenseNumber: 'DL-2024-002', vehicleNumber: 'Bus 2 - TN 33 AA 5678', route: 'Ukkadam - Town Hall', date: '2024-01-15', status: 'Inactive' },
    { id: 3, name: 'Driver 3', email: 'driver3@example.com', mobile: '9876543212', licenseNumber: 'DL-2024-003', vehicleNumber: 'Bus 3 - TN 33 AA 9012', route: 'Saravanampatti - Prozone Mall', date: '2024-02-01', status: 'Active' },
    { id: 4, name: 'Driver 4', email: 'driver4@example.com', mobile: '9876543213', licenseNumber: 'DL-2024-004', vehicleNumber: 'Bus 4 - TN 33 AA 3456', route: 'Peelamedu - Airport', date: '2024-02-05', status: 'Active' },
    { id: 5, name: 'Driver 5', email: 'driver5@example.com', mobile: '9876543214', licenseNumber: 'DL-2024-005', vehicleNumber: 'Bus 5 - TN 33 AA 7890', route: 'R.S. Puram - Brookefields', date: '2024-02-10', status: 'Inactive' },
    { id: 6, name: 'Driver 6', email: 'driver6@example.com', mobile: '9876543215', licenseNumber: 'DL-2024-006', vehicleNumber: 'Bus 6 - TN 33 AA 2345', route: 'Vadavalli - Maruthamalai', date: '2024-02-15', status: 'Active' },
    { id: 7, name: 'Driver 7', email: 'driver7@example.com', mobile: '9876543216', licenseNumber: 'DL-2024-007', vehicleNumber: 'Bus 7 - TN 33 AA 6789', route: 'Singanallur - Bus Stand', date: '2024-02-20', status: 'Active' },
    { id: 8, name: 'Driver 8', email: 'driver8@example.com', mobile: '9876543217', licenseNumber: 'DL-2024-008', vehicleNumber: 'Bus 8 - TN 33 AA 0123', route: 'Saibaba Colony - Thudiyalur', date: '2024-02-25', status: 'Inactive' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', email: '', mobile: '', licenseNumber: '', vehicleNumber: '', route: '', status: 'Active' });
  const [search, setSearch] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
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

  const handleToggleStatus = (id) => {
    const driver = drivers.find(d => d.id === id);
    if (driver && driver.status === 'Active') {
      setDeactivatingItemId(id);
      setDeactivationReason("");
      setShowDeactivateModal(true);
    } else {
      setDrivers(drivers.map(d =>
        d.id === id ? { ...d, status: 'Active' } : d
      ));
    }
  };

  const confirmDeactivation = () => {
    if (deactivatingItemId) {
      setDrivers(drivers.map(d =>
        d.id === deactivatingItemId ? { ...d, status: 'Inactive', deactivationReason } : d
      ));
      setDeactivatingItemId(null);
      setDeactivationReason("");
      setShowDeactivateModal(false);
    }
  };

  const filteredDrivers = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (newDriver.name && newDriver.email) {
      setDrivers([...drivers, {
        id: Date.now(),
        ...newDriver,
        date: new Date().toISOString().split('T')[0]
      }]);
      setNewDriver({ name: '', email: '', mobile: '', licenseNumber: '', vehicleNumber: '' });
      setShowModal(false);
    }
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setDrivers(drivers.filter(d => d.id !== itemToDelete));
      setItemToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...selectedDriver });
  };

  const handleSaveEdit = () => {
    const updatedData = { ...editData, date: new Date().toISOString().split('T')[0] };
    setDrivers(drivers.map(d => d.id === updatedData.id ? updatedData : d));
    setSelectedDriver(updatedData);
    setIsEditing(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold ml-20 lg:ml-0">Driver Management</h2>
          <p className="text-sm text-gray-500 mt-1 ml-20 lg:ml-0">Manage school bus drivers and status</p>
        </div>
        <div className="w-full sm:w-auto relative sm:min-w-[300px] lg:hidden">
          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-xl bg-white border border-purple-100 focus:border-purple-400 focus:bg-white transition-all text-sm outline-none shadow-sm"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {!selectedDriver && (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-2">
          <div className="flex flex-col items-start gap-2 w-full lg:w-auto pl-6">
            <div className="relative w-full lg:w-96 hidden lg:block">
              <input
                type="text"
                placeholder="Search drivers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-xl bg-white border border-purple-100 focus:border-purple-400 focus:bg-white transition-all text-sm outline-none shadow-sm"
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {selectedDriver && (
        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={() => { setSelectedDriver(null); setIsEditing(false); }}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md flex items-center justify-center text-gray-600 transition-all hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-gray-500">Back to List</span>
            <span style={{ color: '#40189d' }}>/</span>
            <span style={{ color: '#40189d' }}>{selectedDriver.name}</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {selectedDriver ? (
          <div className="h-full bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative p-5" style={{ backgroundColor: '#40189d' }}>
              <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg bg-white/20 backdrop-blur-sm border-2 border-white/30">
                      {selectedDriver.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md">
                      <FontAwesomeIcon icon={faUser} className="text-xs" style={{ color: '#40189d' }} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedDriver.name}</h2>
                    <p className="text-white/80 text-xs font-medium">Driver Account • {selectedDriver.date}</p>
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
                <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                  <div className="relative p-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                      <FontAwesomeIcon icon={faEnvelope} className="text-white text-sm" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Email Address</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                        style={{ borderColor: '#40189d' }}
                      />
                    ) : (
                      <p className="text-sm font-semibold text-black break-all">{selectedDriver.email}</p>
                    )}
                  </div>
                </div>

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
                      <p className="text-lg font-bold text-black">{selectedDriver.mobile}</p>
                    )}
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                  <div className="relative p-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                      <FontAwesomeIcon icon={faIdCard} className="text-white text-sm" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">License Number</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.licenseNumber}
                        onChange={(e) => setEditData({ ...editData, licenseNumber: e.target.value })}
                        className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                        style={{ borderColor: '#40189d' }}
                      />
                    ) : (
                      <p className="text-lg font-bold text-black">{selectedDriver.licenseNumber}</p>
                    )}
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                  <div className="relative p-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-sm" style={{ backgroundColor: '#40189d' }}>
                      <FontAwesomeIcon icon={faCar} className="text-white text-sm" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Vehicle Number</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.vehicleNumber}
                        onChange={(e) => setEditData({ ...editData, vehicleNumber: e.target.value })}
                        className="w-full border-2 rounded-lg px-3 py-2 text-base font-bold outline-none"
                        style={{ borderColor: '#40189d' }}
                      />
                    ) : (
                      <p className="text-lg font-bold text-black">{selectedDriver.vehicleNumber}</p>
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
                  rowData={filteredDrivers}
                  columnDefs={[
                    {
                      headerName: "Driver Name",
                      field: "name",
                      flex: 1.5,
                      cellStyle: { display: 'flex', alignItems: 'center', height: '100%' },
                      cellRenderer: (params) => (
                        <div
                          className="flex items-start gap-3 w-full cursor-pointer group"
                          onClick={() => setSelectedDriver(params.data)}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm transition-transform group-hover:scale-110 flex-shrink-0" style={{ backgroundColor: '#40189d' }}>
                            {params.value.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <p className="font-bold text-gray-900 leading-none group-hover:text-purple-700 transition-colors">{params.value}</p>
                            <div className="flex items-center gap-1 -mt-0.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-purple-600 transition-colors">View Details</span>
                              <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-gray-300 group-hover:text-purple-600 transition-colors" />
                            </div>
                          </div>
                        </div>
                      )
                    },

                    {
                      headerName: "Mobile",
                      field: "mobile",
                      flex: 1,
                      cellStyle: { display: 'flex', alignItems: 'center', fontWeight: '500' }
                    },

                    {
                      headerName: "Vehicle",
                      field: "vehicleNumber",
                      flex: 1.5,
                      cellStyle: { display: 'flex', alignItems: 'center' }
                    },
                    {
                      headerName: "Route",
                      field: "route",
                      flex: 1.5,
                      cellStyle: { display: 'flex', alignItems: 'center' }
                    },
                    {
                      headerName: "Status",
                      field: "status",
                      flex: 1,
                      cellRenderer: (params) => (
                        <div className="flex items-center h-full">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${params.value === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                            {params.value}
                          </span>
                        </div>
                      )
                    },

                    {
                      headerName: "Actions",
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
                        const isActive = (params.data.status || '').toLowerCase() === 'active';

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
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStatus(params.data.id);
                                    params.context.setActiveMenuId(null);
                                  }}
                                  className={`w-[calc(100%-16px)] mx-2 text-left px-3 py-2 text-sm rounded-xl flex items-center gap-3 transition-all duration-200 group/item ${isActive ? 'text-red-600 hover:bg-red-600 hover:text-white' : 'text-green-600 hover:bg-green-600 hover:text-white'}`}
                                >
                                  <div className={`w-6 h-6 rounded-lg group-hover/item:bg-white/20 flex items-center justify-center transition-colors ${isActive ? 'bg-red-50' : 'bg-green-50'}`}>
                                    <FontAwesomeIcon icon={isActive ? faTimes : faCheck} className="text-[10px]" />
                                  </div>
                                  <span className="font-medium">{isActive ? 'Set Inactive' : 'Approve'}</span>
                                </button>

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
                                  <span className="font-medium">Delete Driver</span>
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
                  overlayNoRowsTemplate='<span class="p-4">No drivers found</span>'
                />
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden p-1 space-y-4 pb-24">
              {filteredDrivers.map((driver) => (
                <div key={driver.id} className="relative bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-5" style={{ backgroundColor: '#40189d' }}></div>
                  <div className="relative p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg" style={{ backgroundColor: '#40189d' }}>
                          {driver.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{driver.name}</h3>
                          <p className="text-xs font-medium" style={{ color: '#40189d' }}>{driver.date}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(driver.id)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <FontAwesomeIcon icon={faPhone} className="text-xs" style={{ color: '#40189d' }} />
                          <p className="text-xs text-gray-500 font-medium">Mobile</p>
                        </div>
                        <p className="text-sm text-gray-900 font-bold truncate">{driver.mobile}</p>
                      </div>
                      <div className="p-3 rounded-xl" style={{ backgroundColor: '#f8f5ff' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <FontAwesomeIcon icon={faIdCard} className="text-xs" style={{ color: '#40189d' }} />
                          <p className="text-xs text-gray-500 font-medium">License</p>
                        </div>
                        <p className="text-sm text-gray-900 font-bold truncate">{driver.licenseNumber}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: '#f8f5ff' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon icon={faEnvelope} className="text-xs" style={{ color: '#40189d' }} />
                        <p className="text-xs text-gray-500 font-medium">Email</p>
                      </div>
                      <p className="text-sm text-gray-900 font-semibold break-all">{driver.email}</p>
                    </div>

                    <button
                      onClick={() => setSelectedDriver(driver)}
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

      {!selectedDriver && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
          style={{ backgroundColor: COLORS.SIDEBAR_BG }}
        >
          <FontAwesomeIcon icon={faUserPlus} className="text-xl sm:text-2xl" />
        </button>
      )}

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1999]"></div>
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
                  <FontAwesomeIcon icon={faUserPlus} className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl" style={{ color: COLORS.SIDEBAR_BG }}>Add New Driver</h3>
                  <p className="text-gray-500 text-sm">Enter driver information</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Driver Name</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                      <FontAwesomeIcon icon={faUser} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={newDriver.name}
                      onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                      className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                      <FontAwesomeIcon icon={faEnvelope} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                    </div>
                    <input
                      type="email"
                      placeholder="driver@example.com"
                      value={newDriver.email}
                      onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                      className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Mobile Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                      <FontAwesomeIcon icon={faPhone} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                    </div>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={newDriver.mobile}
                      onChange={(e) => setNewDriver({ ...newDriver, mobile: e.target.value })}
                      className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>License Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                      <FontAwesomeIcon icon={faIdCard} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                    </div>
                    <input
                      type="text"
                      placeholder="DL-2024-XXX"
                      value={newDriver.licenseNumber}
                      onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                      className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Vehicle Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                      <FontAwesomeIcon icon={faCar} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                    </div>
                    <input
                      type="text"
                      placeholder="Bus 1 - TN 33 AA 1234"
                      value={newDriver.vehicleNumber}
                      onChange={(e) => setNewDriver({ ...newDriver, vehicleNumber: e.target.value })}
                      className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                    />
                  </div>
                </div>



                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Assigned Route</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                      <FontAwesomeIcon icon={faRoute} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                    </div>
                    <input
                      type="text"
                      placeholder="Route 101"
                      value={newDriver.route}
                      onChange={(e) => setNewDriver({ ...newDriver, route: e.target.value })}
                      className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2" style={{ color: COLORS.SIDEBAR_BG }}>Status</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
                      <FontAwesomeIcon icon={faCheck} className="text-sm" style={{ color: COLORS.SIDEBAR_BG }} />
                    </div>
                    <select
                      value={newDriver.status}
                      onChange={(e) => setNewDriver({ ...newDriver, status: e.target.value })}
                      className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm appearance-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
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
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                Add Driver
              </button>
            </div>
          </div>
        </>
      )}
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
                Are you sure you want to delete this driver record? This action cannot be undone and will remove all associated data.
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
              Please provide a reason why this driver is being moved to inactive status.
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

export default DriverManagement;
