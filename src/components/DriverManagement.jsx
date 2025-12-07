import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTrash, faCheck, faTimes, faSearch, faEnvelope, faUser, faPhone, faEye, faEdit, faIdCard, faCar } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Robert Wilson', email: 'robert@example.com', mobile: '555-0101', licenseNumber: 'DL-2024-001', vehicleNumber: 'ABC-1234', date: '2024-01-10' },
    { id: 2, name: 'Sarah Martinez', email: 'sarah@example.com', mobile: '555-0102', licenseNumber: 'DL-2024-002', vehicleNumber: 'XYZ-5678', date: '2024-01-15' },
    { id: 3, name: 'David Brown', email: 'david@example.com', mobile: '555-0103', licenseNumber: 'DL-2024-003', vehicleNumber: 'LMN-9012', date: '2024-02-01' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', email: '', mobile: '', licenseNumber: '', vehicleNumber: '' });
  const [search, setSearch] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

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
    setDrivers(drivers.filter(d => d.id !== id));
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
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 h-auto flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold ml-15 lg:ml-0">Driver Management</h2>
          <p className="text-sm text-gray-500 mt-1 ml-15 lg:ml-0">Manage driver information and vehicles</p>
        </div>
        <div className="w-full sm:w-auto relative sm:min-w-[300px]">
          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 pl-12 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-100 focus:border-purple-400 focus:bg-white shadow-sm hover:shadow-md transition-all text-sm outline-none"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
        </div>
      </div>

      {!selectedDriver && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="font-bold" style={{ color: '#40189d' }}>Table</span>
          </div>
        </div>
      )}

      {selectedDriver && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <button 
              onClick={() => { setSelectedDriver(null); setIsEditing(false); }} 
              className="hover:opacity-70 transition-all text-black font-bold"
            >
              Table
            </button>
            <span style={{ color: '#40189d' }}>/</span>
            <span style={{ color: '#40189d' }}>{selectedDriver.name}</span>
            <span style={{ color: '#40189d' }}>/</span>
            <span style={{ color: '#40189d' }}>View</span>
          </div>
        </div>
      )}

      <div className="flex-1 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {selectedDriver ? (
          <div className="h-full">
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
            <div className="hidden md:block h-full w-full p-6">
              <div className="space-y-3">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-200"
                    style={{ background: 'linear-gradient(to right, #ffffff, #faf5ff)' }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: '#40189d' }}>
                          {driver.name.charAt(0)}
                        </div>
                        <div className="flex-1 grid gap-6 grid-cols-5">
                          <div>
                            <p className="text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#40189d' }}>Driver Name</p>
                            <p className="font-bold text-gray-900 text-base">{driver.name}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#40189d' }}>Email</p>
                            <p className="text-sm text-gray-600">{driver.email}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#40189d' }}>Mobile</p>
                            <p className="text-sm text-gray-700 font-medium">{driver.mobile}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#40189d' }}>License</p>
                            <p className="text-sm text-gray-700 font-medium">{driver.licenseNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#40189d' }}>Vehicle</p>
                            <p className="text-sm text-gray-700 font-medium">{driver.vehicleNumber}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedDriver(driver); }}
                          className="w-10 h-10 rounded-xl text-white transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                          style={{ backgroundColor: '#40189d' }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(driver.id); }}
                          className="w-10 h-10 rounded-xl bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:hidden p-4 space-y-4">
              {filteredDrivers.map((driver) => (
                <div key={driver.id} className="relative bg-white rounded-3xl shadow-xl overflow-hidden" style={{ border: '2px solid #e9d5ff' }}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-10" style={{ backgroundColor: '#40189d' }}></div>
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

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
        style={{ backgroundColor: COLORS.SIDEBAR_BG }}
      >
        <FontAwesomeIcon icon={faUserPlus} className="text-xl sm:text-2xl" />
      </button>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
          <div className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-gradient-to-br from-purple-50 to-white shadow-2xl z-50 flex flex-col">
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
                      placeholder="555-0000"
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
                      placeholder="ABC-1234"
                      value={newDriver.vehicleNumber}
                      onChange={(e) => setNewDriver({ ...newDriver, vehicleNumber: e.target.value })}
                      className="w-full bg-white border-2 border-purple-100 rounded-xl pl-16 pr-4 py-3.5 text-sm focus:border-purple-400 focus:outline-none transition shadow-sm"
                    />
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
    </div>
  );
};

export default DriverManagement;
