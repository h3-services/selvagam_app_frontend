import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTrash, faCheck, faTimes, faSearch, faEnvelope, faUser, faChild, faPhone, faEye, faEdit } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';

const ParentAccess = () => {
  const [parents, setParents] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', childName: 'Emma Doe', mobile: '123-456-7890', distance: '2.5 km', date: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', childName: 'Liam Smith', mobile: '234-567-8901', distance: '3.8 km', date: '2024-01-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', childName: 'Olivia Johnson', mobile: '345-678-9012', distance: '1.2 km', date: '2024-02-01' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newParent, setNewParent] = useState({ name: '', email: '', childName: '', mobile: '' });
  const [search, setSearch] = useState('');
  const [selectedParent, setSelectedParent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const filteredParents = parents.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (newParent.name && newParent.email) {
      setParents([...parents, {
        id: Date.now(),
        name: newParent.name,
        email: newParent.email,
        childName: newParent.childName,
        mobile: newParent.mobile,
        date: new Date().toISOString().split('T')[0]
      }]);
      setNewParent({ name: '', email: '', childName: '', mobile: '' });
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    setParents(parents.filter(p => p.id !== id));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...selectedParent });
  };

  const handleSaveEdit = () => {
    const updatedData = { ...editData, date: new Date().toISOString().split('T')[0] };
    setParents(parents.map(p => p.id === updatedData.id ? updatedData : p));
    setSelectedParent(updatedData);
    setIsEditing(false);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 h-full flex flex-col via-white ">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-clip-text ml-15 lg:ml-0 ">Parent Access</h2>
          <p className="text-sm text-gray-500 mt-1 ml-15 lg:ml-0 ">Manage parent information and access</p>
        </div>
        <div className="w-full sm:w-auto relative sm:min-w-[300px]">
          <input
            type="text"
            placeholder="Search parents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 pl-12 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-purple-100 focus:border-purple-400 focus:bg-white shadow-sm hover:shadow-md transition-all text-sm outline-none"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
        </div>
      </div>

      {selectedParent && (
        <div className="mb-4">
          <button 
            onClick={() => { setSelectedParent(null); setIsEditing(false); }} 
            className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-all"
            style={{ color: '#40189d' }}
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to all parents</span>
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-3xl shadow-2xl overflow-hidden">
          {selectedParent ? (
            <div className="h-full">
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

                  {/* Email Card */}
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
                        <p className="text-sm font-semibold text-black break-all">{selectedParent.email}</p>
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
                    <h3 className="text-base font-bold text-black">Location Map</h3>
                    <p className="text-xs text-gray-500">View parent's location relative to school</p>
                  </div>
                  <div className="h-64">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841374555634!2d-73.98823492346618!3d40.75797097138558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop/Tablet Table View */}
              <div className="hidden md:block h-full w-full p-6">
                <div className="space-y-3">
                  {filteredParents.map((parent, index) => (
                    <div
                      key={parent.id}
                      onClick={() => { setSelectedParent(parent); setShowForm(false); }}
                      className="group bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-200"
                      style={{ background: 'linear-gradient(to right, #ffffff, #faf5ff)' }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: '#40189d' }}>
                            {parent.name.charAt(0)}
                          </div>
                          <div className={`flex-1 grid gap-6 ${showForm ? 'grid-cols-3' : 'grid-cols-5'}`}>
                            <div>
                              <p className="text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#40189d' }}>Parent Name</p>
                              <p className="font-bold text-gray-900 text-base">{parent.name}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#40189d' }}>Child Name</p>
                              <p className="font-semibold text-gray-700 text-base">{parent.childName}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#40189d' }}>Email</p>
                              <p className="text-sm text-gray-600">{parent.email}</p>
                            </div>
                            {!showForm && (
                              <div>
                                <p className="text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#40189d' }}>Mobile</p>
                                <p className="text-sm text-gray-700 font-medium">{parent.mobile}</p>
                              </div>
                            )}
                            {!showForm && (
                              <div>
                                <p className="text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: '#40189d' }}>Date</p>
                                <p className="text-sm text-gray-600">{parent.date}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedParent(parent); setShowForm(false); }}
                            className="w-10 h-10 rounded-xl text-white transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                            style={{ backgroundColor: '#40189d' }}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(parent.id); }}
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

              {/* Mobile Card View */}
              <div className="md:hidden p-4 space-y-4">
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
                      
                      <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: '#f8f5ff' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <FontAwesomeIcon icon={faEnvelope} className="text-xs" style={{ color: '#40189d' }} />
                          <p className="text-xs text-gray-500 font-medium">Email</p>
                        </div>
                        <p className="text-sm text-gray-900 font-semibold break-all">{parent.email}</p>
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
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setShowForm(false)}></div>
            <div className="fixed inset-0 lg:relative lg:w-80 flex items-center justify-center lg:block z-50 lg:z-auto p-4 lg:p-0">
              <div className="w-full max-w-md lg:max-w-none lg:h-full flex flex-col bg-white rounded-3xl lg:rounded-t-[50px] shadow-2xl">
              <div className="p-6 sm:p-8 text-center relative">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full flex items-center justify-center shadow-xl" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
                  <FontAwesomeIcon icon={faUserPlus} className="text-white text-3xl sm:text-4xl" />
                </div>
                <h3 className="font-bold text-xl sm:text-2xl" style={{ color: COLORS.SIDEBAR_BG }}>Add Parent</h3>
                <p className="text-gray-500 text-sm mt-1">Fill in the details</p>
              </div>
              <div className="flex-1 px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col overflow-y-auto">
                <div className="space-y-4 flex-1">
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={newParent.email}
                      onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
                      className="w-full bg-gray-50 border-2 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:bg-white focus:outline-none transition"
                      style={{ borderColor: '#e9d5ff' }}
                      onFocus={(e) => e.target.style.borderColor = '#40189d'}
                      onBlur={(e) => e.target.style.borderColor = '#e9d5ff'}
                    />
                  </div>
                  <div className="relative">
                    <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Parent Name"
                      value={newParent.name}
                      onChange={(e) => setNewParent({ ...newParent, name: e.target.value })}
                      className="w-full bg-gray-50 border-2 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:bg-white focus:outline-none transition"
                      style={{ borderColor: '#e9d5ff' }}
                      onFocus={(e) => e.target.style.borderColor = '#40189d'}
                      onBlur={(e) => e.target.style.borderColor = '#e9d5ff'}
                    />
                  </div>
                  <div className="relative">
                    <FontAwesomeIcon icon={faChild} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Child Name"
                      value={newParent.childName}
                      onChange={(e) => setNewParent({ ...newParent, childName: e.target.value })}
                      className="w-full bg-gray-50 border-2 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:bg-white focus:outline-none transition"
                      style={{ borderColor: '#e9d5ff' }}
                      onFocus={(e) => e.target.style.borderColor = '#40189d'}
                      onBlur={(e) => e.target.style.borderColor = '#e9d5ff'}
                    />
                  </div>
                  <div className="relative">
                    <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={newParent.mobile}
                      onChange={(e) => setNewParent({ ...newParent, mobile: e.target.value })}
                      className="w-full bg-gray-50 border-2 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:bg-white focus:outline-none transition"
                      style={{ borderColor: '#e9d5ff' }}
                      onFocus={(e) => e.target.style.borderColor = '#40189d'}
                      onBlur={(e) => e.target.style.borderColor = '#e9d5ff'}
                    />
                  </div>
                </div>
                <button
                  onClick={handleAdd}
                  className="w-full mt-6 py-4 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
                  style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                >
                  Add Parent
                </button>
              </div>
            </div>
            </div>
          </>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
            style={{ backgroundColor: COLORS.SIDEBAR_BG }}
          >
            <FontAwesomeIcon icon={faUserPlus} className="text-xl sm:text-2xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ParentAccess;
