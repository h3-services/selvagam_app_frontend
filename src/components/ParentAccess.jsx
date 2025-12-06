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
    <div className="p-3 sm:p-4 md:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Parent Access Management</h2>
        <div className="lg:hidden">
          <button className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <FontAwesomeIcon icon={faSearch} className="text-gray-600" />
          </button>
        </div>
        <div className="hidden lg:block relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-8 sm:px-10 py-2.5 sm:py-3 pr-10 rounded-3xl bg-gray-300 font-medium text-sm sm:text-base"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <div className="text-xs sm:text-sm font-semibold text-gray-600 flex items-center gap-2">
          <button onClick={() => { setSelectedParent(null); setIsEditing(false); }} className="transition" style={{ color: selectedParent ? '#6b7280' : COLORS.SIDEBAR_BG }}>
            Table
          </button>
          {selectedParent && (
            <>
              <span>/</span>
              <span style={{ color: COLORS.SIDEBAR_BG }}>{isEditing ? 'Edit' : 'View'}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-4 flex-1">
        <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden max-h-full">
          {selectedParent ? (
            <div className="h-full p-6">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setSelectedParent(null)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <FontAwesomeIcon icon={faTimes} />
                  <span>Back to List</span>
                </button>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:opacity-90 transition">
                      <FontAwesomeIcon icon={faTimes} />
                      <span>Cancel</span>
                    </button>
                    <button onClick={handleSaveEdit} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
                      <FontAwesomeIcon icon={faCheck} />
                      <span>Save</span>
                    </button>
                  </div>
                ) : (
                  <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
                    <FontAwesomeIcon icon={faEdit} />
                    <span>Edit</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-60px)]">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
                      {selectedParent.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedParent.name}</h2>
                      <p className="text-gray-500">Parent</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Child Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.childName}
                        onChange={(e) => setEditData({ ...editData, childName: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 font-semibold"
                      />
                    ) : (
                      <p className="font-semibold text-lg">{selectedParent.childName}</p>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 font-semibold"
                      />
                    ) : (
                      <p className="font-semibold">{selectedParent.email}</p>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.mobile}
                        onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 font-semibold"
                      />
                    ) : (
                      <p className="font-semibold">{selectedParent.mobile}</p>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Date Added</p>
                    <p className="font-semibold">{selectedParent.date}</p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: `${COLORS.SIDEBAR_BG}20` }}>
                    <p className="text-sm mb-1" style={{ color: COLORS.SIDEBAR_BG }}>Distance from School</p>
                    <p className="font-bold text-2xl" style={{ color: COLORS.SIDEBAR_BG }}>{selectedParent.distance}</p>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden h-full">
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
          ) : (
            <div className="h-full flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                <thead className="sticky top-0 z-10">
                <tr className="border-b-2" style={{ borderColor: COLORS.SIDEBAR_BG }}>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50">Parent Name</th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50">Child Name</th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50">Email</th>
                  {!showForm && <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50">Mobile</th>}
                  {!showForm && <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50">Date</th>}
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParents.map((parent, index) => (
                  <tr key={parent.id} onClick={() => { setSelectedParent(parent); setShowForm(false); }} className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors cursor-pointer">
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
                          {parent.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 text-xs sm:text-sm">{parent.name}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-gray-700 text-xs sm:text-sm">{parent.childName}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-gray-600 text-xs sm:text-sm">{parent.email}</td>
                    {!showForm && <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-gray-700 text-xs sm:text-sm">{parent.mobile}</td>}
                    {!showForm && <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-gray-600 text-xs sm:text-sm">{parent.date}</td>}
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-center">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedParent(parent); setShowForm(false); }}
                          className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-purple-50 hover:bg-purple-100 transition-all flex items-center justify-center"
                          style={{ color: COLORS.SIDEBAR_BG }}
                        >
                          <FontAwesomeIcon icon={faEye} className="text-xs sm:text-sm" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(parent.id); }}
                          className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-xs sm:text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {showForm && <div className="w-80 h-full flex flex-col">
          {showForm ? (
            <div className="h-full flex flex-col bg-white rounded-t-[50px] shadow-2xl">
              <div className="p-8 text-center relative">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
                <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center shadow-xl" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
                  <FontAwesomeIcon icon={faUserPlus} className="text-white text-4xl" />
                </div>
                <h3 className="font-bold text-2xl" style={{ color: COLORS.SIDEBAR_BG }}>Add Parent</h3>
                <p className="text-gray-500 text-sm mt-1">Fill in the details</p>
              </div>
              <div className="flex-1 px-8 pb-8 flex flex-col">
                <div className="space-y-4 flex-1 overflow-y-auto">
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={newParent.email}
                      onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-purple-400 focus:bg-white focus:outline-none transition"
                    />
                  </div>
                  <div className="relative">
                    <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Parent Name"
                      value={newParent.name}
                      onChange={(e) => setNewParent({ ...newParent, name: e.target.value })}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-purple-400 focus:bg-white focus:outline-none transition"
                    />
                  </div>
                  <div className="relative">
                    <FontAwesomeIcon icon={faChild} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Child Name"
                      value={newParent.childName}
                      onChange={(e) => setNewParent({ ...newParent, childName: e.target.value })}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-purple-400 focus:bg-white focus:outline-none transition"
                    />
                  </div>
                  <div className="relative">
                    <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={newParent.mobile}
                      onChange={(e) => setNewParent({ ...newParent, mobile: e.target.value })}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-purple-400 focus:bg-white focus:outline-none transition"
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
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="mt-auto ml-auto w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center"
              style={{ backgroundColor: COLORS.SIDEBAR_BG }}
            >
              <FontAwesomeIcon icon={faUserPlus} className="text-xl" />
            </button>
          )}
        </div>}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="fixed bottom-8 right-8 w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center"
            style={{ backgroundColor: COLORS.SIDEBAR_BG }}
          >
            <FontAwesomeIcon icon={faUserPlus} className="text-xl" />
          </button>
        )}
        

      </div>
    </div>
  );
};

export default ParentAccess;
