import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser, faTimes, faCheck, faEdit, faEnvelope, faPhone, faIdCard, faCar, faCalendarAlt, faPassport, faShieldHalved, faClock, faToggleOn, faToggleOff, faLink, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const DriverDetail = ({ selectedDriver, onBack, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        if (selectedDriver) {
            setEditData({
                ...selectedDriver,
                phone: Number(selectedDriver.mobile || selectedDriver.phone), // Ensure number
                licence_number: selectedDriver.licenseNumber || selectedDriver.licence_number, // Handle mapping
                kyc_verified: selectedDriver.kyc_verified === 1 || selectedDriver.kyc_verified === true, // Check boolean/int
                is_available: selectedDriver.is_available === 1 || selectedDriver.is_available === true
            });
        }
    }, [selectedDriver]);

    const handleSaveEdit = () => {
        const payload = {
            name: editData.name,
            phone: Number(editData.phone),
            email: editData.email,
            dob: editData.dob,
            kyc_verified: editData.kyc_verified,
            licence_number: editData.licence_number,
            licence_expiry: editData.licence_expiry,
            aadhar_number: editData.aadhar_number,
            licence_url: editData.licence_url,
            aadhar_url: editData.aadhar_url,
            photo_url: editData.photo_url,
            fcm_token: editData.fcm_token || "", // Preserve or empty
            is_available: editData.is_available,
            status: editData.status?.toUpperCase() || "ACTIVE"
        };
        onUpdate(payload);
        setIsEditing(false);
    };

    if (!selectedDriver) return null;

    const InfoRow = ({ icon, label, value, isEditing, field, type = "text" }) => (
        <div className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg transition-colors border-b border-gray-100 last:border-0">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#40189d] shrink-0">
                <FontAwesomeIcon icon={icon} className="text-xs" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                {isEditing ? (
                    <input
                        type={type}
                        value={editData?.[field] || ''}
                        onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                        className="w-full mt-1 px-2 py-1 text-sm border-b border-purple-200 focus:border-[#40189d] outline-none bg-transparent font-medium text-gray-900"
                    />
                ) : (
                    <p className="text-sm font-bold text-gray-700 truncate">{value || 'N/A'}</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-full bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            {/* Header Toolbar */}
            <div className="relative p-8 border-b border-purple-100 bg-gradient-to-br from-purple-50 to-white">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onBack}
                            className="w-12 h-12 rounded-2xl bg-white border border-purple-100 flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-all shadow-md"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight" style={{ color: '#40189d' }}>Driver Profile</h2>
                            <p className="text-gray-500 text-sm font-medium mt-1">Manage driver details & documents</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all text-sm font-bold shadow-sm">
                                    <FontAwesomeIcon icon={faTimes} className="mr-2" />Cancel
                                </button>
                                <button onClick={handleSaveEdit} className="px-6 py-2.5 text-white rounded-xl hover:shadow-xl transition-all text-sm font-bold flex items-center gap-2" style={{ backgroundColor: '#40189d' }}>
                                    <FontAwesomeIcon icon={faCheck} /> Save Changes
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 text-white rounded-xl hover:shadow-lg transition-all text-sm font-bold flex items-center gap-2" style={{ backgroundColor: '#40189d' }}>
                                <FontAwesomeIcon icon={faEdit} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">

                    {/* Left Column - Profile Summary */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-8">
                        {/* Profile Card */}
                        <div className="bg-white rounded-[32px] shadow-sm border-2 border-purple-50 p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-purple-100 transition-all">
                            
                            <div className="relative z-10 w-28 h-28 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-purple-50 mb-6 flex items-center justify-center">
                                {isEditing ? (
                                    <div className="flex flex-col justify-center h-full w-full bg-purple-50 p-2">
                                        <input
                                            type="text"
                                            placeholder="Photo URL"
                                            value={editData?.photo_url || ''}
                                            onChange={(e) => setEditData({ ...editData, photo_url: e.target.value })}
                                            className="text-xs p-2 text-center bg-white rounded-lg outline-none w-full border border-purple-100"
                                        />
                                    </div>
                                ) : (
                                    selectedDriver.photo_url ? (
                                        <img src={selectedDriver.photo_url} alt={selectedDriver.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#40189d]">
                                            {selectedDriver.name ? selectedDriver.name.charAt(0) : 'U'}
                                        </div>
                                    )
                                )}
                            </div>

                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="text-xl font-bold text-gray-900 mb-2 text-center bg-transparent border-b border-purple-200 focus:border-[#40189d] outline-none relative z-10"
                                />
                            ) : (
                                <h3 className="text-2xl font-black text-[#40189d] mb-2 relative z-10">{selectedDriver.name}</h3>
                            )}

                            <div className="flex items-center gap-3 mb-8 relative z-10 flex-wrap justify-center">
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <select
                                            value={editData.status}
                                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                            className="px-3 py-1.5 text-xs rounded-lg border border-purple-200 bg-white font-bold text-gray-700 outline-none focus:border-[#40189d]"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        <button
                                            onClick={() => setEditData({ ...editData, kyc_verified: !editData.kyc_verified })}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-2 transition-all ${editData.kyc_verified ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                                        >
                                            KYC: {editData.kyc_verified ? 'Yes' : 'No'}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${selectedDriver.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                            {selectedDriver.status}
                                        </span>
                                        {selectedDriver.kyc_verified === 1 && (
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
                                                <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" /> Verified
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="w-full bg-gray-50/50 rounded-2xl p-1 border border-gray-100 text-left space-y-1">
                                <InfoRow icon={faEnvelope} label="Email Address" value={selectedDriver.email} isEditing={isEditing} field="email" type="email" />
                                <InfoRow icon={faPhone} label="Mobile Number" value={selectedDriver.mobile || selectedDriver.phone} isEditing={isEditing} field="phone" type="number" />
                                <InfoRow icon={faCalendarAlt} label="Date of Birth" value={selectedDriver.dob} isEditing={isEditing} field="dob" type="date" />
                            </div>
                        </div>

                        {/* Availability Card */}
                        <div className="bg-white rounded-[32px] shadow-sm border-2 border-purple-50 p-8">
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-6">Current Status</h4>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-purple-200 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${selectedDriver.is_available === 1 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        <FontAwesomeIcon icon={selectedDriver.is_available === 1 ? faCheck : faTimes} className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Driver Availability</p>
                                        <p className={`text-xs font-bold mt-0.5 ${selectedDriver.is_available === 1 ? 'text-green-600' : 'text-red-500'}`}>
                                            {selectedDriver.is_available === 1 ? 'Available for assignment' : 'Currently Unavailable'}
                                        </p>
                                    </div>
                                </div>
                                {isEditing && (
                                    <div className="cursor-pointer text-3xl text-[#40189d] hover:scale-110 transition-transform" onClick={() => setEditData({ ...editData, is_available: !editData.is_available })}>
                                        <FontAwesomeIcon icon={editData?.is_available ? faToggleOn : faToggleOff} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-8">
                        {/* Professional Info */}
                        <div className="bg-white rounded-[32px] shadow-sm border-2 border-purple-50 p-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100px] -mr-8 -mt-8 opacity-50"></div>
                            
                            <h3 className="text-lg font-black text-[#40189d] mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#40189d] border border-purple-100">
                                    <FontAwesomeIcon icon={faIdCard} />
                                </span>
                                Professional Details
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                <InfoRow icon={faIdCard} label="License Number" value={selectedDriver.licenseNumber || selectedDriver.licence_number} isEditing={isEditing} field="licence_number" />
                                <div className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-0 md:border-0 hover:bg-purple-50 rounded-lg transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#40189d] shrink-0">
                                        <FontAwesomeIcon icon={faClock} className="text-xs" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">License Expiry</p>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={editData?.licence_expiry || ''}
                                                onChange={(e) => setEditData({ ...editData, licence_expiry: e.target.value })}
                                                className="w-full mt-1 px-2 py-1 text-sm border-b border-purple-200 focus:border-[#40189d] outline-none bg-transparent"
                                            />
                                        ) : (
                                            <p className={`text-sm font-bold truncate ${new Date(selectedDriver.licence_expiry) < new Date() ? 'text-red-500' : 'text-gray-700'}`}>
                                                {selectedDriver.licence_expiry || 'N/A'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <InfoRow icon={faPassport} label="Aadhar Number" value={selectedDriver.aadhar_number} isEditing={isEditing} field="aadhar_number" />
                                <div className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg transition-colors border-b border-gray-100 md:border-b-0">
                                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#40189d] shrink-0">
                                        <FontAwesomeIcon icon={faCar} className="text-xs" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Assigned Vehicle</p>
                                        <p className="text-sm font-bold text-gray-700 truncate">{selectedDriver.vehicleNumber || 'Unassigned'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-white rounded-[32px] shadow-sm border-2 border-purple-50 p-8 flex-1">
                            <h3 className="text-lg font-black text-[#40189d] mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#40189d] border border-purple-100">
                                    <FontAwesomeIcon icon={faLink} />
                                </span>
                                Legal Documents
                            </h3>
                            
                            {isEditing ? (
                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    <InfoRow icon={faLink} label="License URL" value={selectedDriver.licence_url} isEditing={true} field="licence_url" />
                                    <InfoRow icon={faLink} label="Aadhar URL" value={selectedDriver.aadhar_url} isEditing={true} field="aadhar_url" />
                                </div>
                            ) : null}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* License Card */}
                                <div className="group relative rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all bg-gray-50 h-[220px]">
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#40189d] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10 shadow-sm">
                                        Driving License
                                    </div>
                                    {selectedDriver.licence_url ? (
                                        <>
                                            <img src={selectedDriver.licence_url} alt="License" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-[#40189d]/0 group-hover:bg-[#40189d]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                                                <button className="bg-white text-[#40189d] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all">View Document</button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                            <FontAwesomeIcon icon={faIdCard} className="text-5xl mb-3 opacity-20" />
                                            <span className="text-xs font-black uppercase tracking-widest opacity-50">No Document</span>
                                        </div>
                                    )}
                                </div>

                                {/* Aadhar Card */}
                                <div className="group relative rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all bg-gray-50 h-[220px]">
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#40189d] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10 shadow-sm">
                                        Aadhar Card
                                    </div>
                                    {selectedDriver.aadhar_url ? (
                                        <>
                                            <img src={selectedDriver.aadhar_url} alt="Aadhar" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-[#40189d]/0 group-hover:bg-[#40189d]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                                                <button className="bg-white text-[#40189d] px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all">View Document</button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                            <FontAwesomeIcon icon={faPassport} className="text-5xl mb-3 opacity-20" />
                                            <span className="text-xs font-black uppercase tracking-widest opacity-50">No Document</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDetail;
