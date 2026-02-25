import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faPlus, faCheck, faTimes, faPen, faTrash, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const AdminTeam = ({
    admins,
    onAddAdmin,
    onUpdateAdmin,
    onDeleteAdmin,
    onToggleStatus
}) => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', phone: '', password: '' });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAdd = async () => {
        if (newAdmin.name && newAdmin.email && newAdmin.password) {
            setIsSubmitting(true);
            try {
                await onAddAdmin({
                    ...newAdmin,
                    phone: Number(newAdmin.phone) // Ensure phone is sent as Number
                });
                setNewAdmin({ name: '', email: '', phone: '', password: '' });
                setIsAddOpen(false);
            } catch (error) {
                console.error("Failed to add admin:", error);
                alert("Failed to create admin account.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
             alert("Please fill in all required fields (Name, Email, Password)");
        }
    };

    const startEdit = (admin) => {
        setEditingId(admin.id);
        setEditData({ ...admin });
    };

    const saveEdit = () => {
        onUpdateAdmin(editingId, editData);
        setEditingId(null);
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                    School Management Team
                </h2>
                <button
                    onClick={() => setIsAddOpen(!isAddOpen)}
                    className="text-sm font-semibold text-blue-600 hover:text-indigo-800 transition-colors"
                >
                    {isAddOpen ? 'Close Form' : '+ Add New Admin'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Add New Admin Card */}
                {isAddOpen && (
                    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden relative group animate-fade-in-up">
                        <div className="h-1 bg-blue-500 w-full absolute top-0 left-0"></div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">New School Admin</h3>
                            <div className="space-y-4">
                                <input
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                    placeholder="Full Name"
                                    value={newAdmin.name}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                />
                                <input
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                    placeholder="Email Address"
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                />
                                <input
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                    placeholder="Phone Number"
                                    value={newAdmin.phone}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                                />
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                    placeholder="Password"
                                    value={newAdmin.password}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                />
                                <button
                                    onClick={handleAdd}
                                    disabled={isSubmitting}
                                    className={`w-full py-2.5 bg-blue-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm shadow-md mt-2 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FontAwesomeIcon icon={faCircleNotch} spin />
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        'Create Account'
                                    )}
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
                                            <button onClick={() => startEdit(admin)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FontAwesomeIcon icon={faPen} size="sm" /></button>
                                            <button onClick={() => onDeleteAdmin(admin.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FontAwesomeIcon icon={faTrash} size="sm" /></button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 w-4" />
                                    {editingId === admin.id ? (
                                        <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="flex-1 border-b border-gray-200 focus:border-blue-500 outline-none" />
                                    ) : (
                                        <span className="truncate">{admin.email}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FontAwesomeIcon icon={faPhone} className="text-gray-400 w-4" />
                                    {editingId === admin.id ? (
                                        <input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="flex-1 border-b border-gray-200 focus:border-blue-500 outline-none" />
                                    ) : (
                                        <span>{admin.phone}</span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <button
                                    onClick={() => onToggleStatus(admin.id)}
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
                        className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-indigo-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all min-h-[250px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                        <span className="font-semibold text-sm">Add New Admin</span>
                    </button>
                )}
            </div>
        </section>
    );
};

export default AdminTeam;
