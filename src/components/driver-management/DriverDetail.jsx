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
        <div className="flex items-center gap-3 p-3 hover:bg-[#3A7BFF]/5 rounded-lg transition-colors border-b border-gray-100 last:border-0">
            <div className="w-8 h-8 rounded-full bg-[#3A7BFF]/10 flex items-center justify-center text-[#3A7BFF] shrink-0">
                <FontAwesomeIcon icon={icon} className="text-xs" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                {isEditing ? (
                    <input
                        type={type}
                        value={editData?.[field] || ''}
                        onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                        className="w-full mt-1 px-2 py-1 text-sm border-b border-[#3A7BFF]/50 focus:border-[#3A7BFF] outline-none bg-transparent font-medium text-gray-900"
                    />
                ) : (
                    <p className="text-sm font-semibold text-gray-900 truncate">{value || 'N/A'}</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-full bg-white rounded-3xl overflow-hidden flex flex-col">
            {/* Header Toolbar */}
            <div className="bg-[#3A7BFF] px-6 py-4 flex items-center justify-between shadow-md z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all backdrop-blur-sm"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
                    </button>
                    <h2 className="text-lg font-bold text-white">Driver Profile</h2>
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 rounded-lg text-white hover:bg-white/20 text-sm font-medium transition-all backdrop-blur-sm">
                                Cancel
                            </button>
                            <button onClick={handleSaveEdit} className="px-3 py-1.5 rounded-lg bg-white text-[#3A7BFF] hover:bg-gray-50 text-sm font-bold shadow-sm transition-all flex items-center gap-2">
                                <FontAwesomeIcon icon={faCheck} /> Save
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 rounded-lg bg-white text-[#3A7BFF] hover:bg-gray-50 text-sm font-bold shadow-sm transition-all flex items-center gap-2">
                            <FontAwesomeIcon icon={faEdit} /> Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">

                    {/* Left Column - Profile Summary */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-[#3A7BFF]"></div>

                            <div className="relative z-10 w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white mb-4">
                                {isEditing ? (
                                    <div className="flex flex-col justify-center h-full bg-gray-50">
                                        <input
                                            type="text"
                                            placeholder="Photo URL"
                                            value={editData?.photo_url || ''}
                                            onChange={(e) => setEditData({ ...editData, photo_url: e.target.value })}
                                            className="text-xs p-2 text-center bg-transparent outline-none w-full"
                                        />
                                    </div>
                                ) : (
                                    selectedDriver.photo_url ? (
                                        <img src={selectedDriver.photo_url} alt={selectedDriver.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-3xl font-bold text-[#3A7BFF]">
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
                                    className="text-xl font-bold text-gray-900 mb-1 text-center bg-transparent border-b border-gray-300 focus:border-[#3A7BFF] outline-none relative z-10"
                                />
                            ) : (
                                <h3 className="text-xl font-bold text-gray-900 mb-1 relative z-10">{selectedDriver.name}</h3>
                            )}

                            <div className="flex items-center gap-2 mb-6 relative z-10 flex-wrap justify-center">
                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <select
                                            value={editData.status}
                                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                            className="px-2 py-1 text-xs rounded border border-gray-300 bg-white"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        <button
                                            onClick={() => setEditData({ ...editData, kyc_verified: !editData.kyc_verified })}
                                            className={`px-2 py-1 rounded text-xs font-bold border flex items-center gap-1 ${editData.kyc_verified ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
                                        >
                                            KYC: {editData.kyc_verified ? 'Yes' : 'No'}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${selectedDriver.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                            {selectedDriver.status}
                                        </span>
                                        {selectedDriver.kyc_verified === 1 && (
                                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
                                                <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" /> KYC Verified
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 text-left">
                                <InfoRow icon={faEnvelope} label="Email Address" value={selectedDriver.email} isEditing={isEditing} field="email" type="email" />
                                <InfoRow icon={faPhone} label="Mobile Number" value={selectedDriver.mobile || selectedDriver.phone} isEditing={isEditing} field="phone" type="number" />
                                <InfoRow icon={faCalendarAlt} label="Date of Birth" value={selectedDriver.dob} isEditing={isEditing} field="dob" type="date" />
                            </div>
                        </div>

                        {/* Availability Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Current Status</h4>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedDriver.is_available === 1 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        <FontAwesomeIcon icon={selectedDriver.is_available === 1 ? faCheck : faTimes} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Driver Availability</p>
                                        <p className={`text-xs font-medium ${selectedDriver.is_available === 1 ? 'text-green-600' : 'text-red-500'}`}>
                                            {selectedDriver.is_available === 1 ? 'Available for assignment' : 'Currently Unavailable'}
                                        </p>
                                    </div>
                                </div>
                                {isEditing && (
                                    <div className="cursor-pointer text-2xl text-[#3A7BFF]" onClick={() => setEditData({ ...editData, is_available: !editData.is_available })}>
                                        <FontAwesomeIcon icon={editData?.is_available ? faToggleOn : faToggleOff} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">
                        {/* Professional Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <div className="w-2 h-6 bg-[#3A7BFF] rounded-full"></div>
                                Professional Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <InfoRow icon={faIdCard} label="License Number" value={selectedDriver.licenseNumber || selectedDriver.licence_number} isEditing={isEditing} field="licence_number" />
                                <div className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-0 md:border-0 hover:bg-[#3A7BFF]/5 rounded-lg transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-[#3A7BFF]/10 flex items-center justify-center text-[#3A7BFF] shrink-0">
                                        <FontAwesomeIcon icon={faClock} className="text-xs" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">License Expiry</p>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={editData?.licence_expiry || ''}
                                                onChange={(e) => setEditData({ ...editData, licence_expiry: e.target.value })}
                                                className="w-full mt-1 px-2 py-1 text-sm border-b border-[#3A7BFF]/50 focus:border-[#3A7BFF] outline-none bg-transparent"
                                            />
                                        ) : (
                                            <p className={`text-sm font-semibold truncate ${new Date(selectedDriver.licence_expiry) < new Date() ? 'text-red-500' : 'text-gray-900'}`}>
                                                {selectedDriver.licence_expiry || 'N/A'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <InfoRow icon={faPassport} label="Aadhar Number" value={selectedDriver.aadhar_number} isEditing={isEditing} field="aadhar_number" />
                                <div className="flex items-center gap-3 p-3 hover:bg-[#3A7BFF]/5 rounded-lg transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-[#3A7BFF]/10 flex items-center justify-center text-[#3A7BFF] shrink-0">
                                        <FontAwesomeIcon icon={faCar} className="text-xs" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned Vehicle</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate">{selectedDriver.vehicleNumber || 'Unassigned'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <div className="w-2 h-6 bg-[#3A7BFF] rounded-full"></div>
                                Documents
                            </h3>
                            {isEditing ? (
                                <div className="grid grid-cols-1 gap-4 mb-4">
                                    <InfoRow icon={faLink} label="License URL" value={selectedDriver.licence_url} isEditing={true} field="licence_url" />
                                    <InfoRow icon={faLink} label="Aadhar URL" value={selectedDriver.aadhar_url} isEditing={true} field="aadhar_url" />
                                </div>
                            ) : null}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* License Card */}
                                <div className="group relative rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-all bg-gray-50 h-[200px]">
                                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded z-10">
                                        License
                                    </div>
                                    {selectedDriver.licence_url ? (
                                        <>
                                            <img src={selectedDriver.licence_url} alt="License" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold shadow-lg">View Full</button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                            <FontAwesomeIcon icon={faIdCard} className="text-4xl mb-2 opacity-30" />
                                            <span className="text-xs font-medium">No Document Uploaded</span>
                                        </div>
                                    )}
                                </div>

                                {/* Aadhar Card */}
                                <div className="group relative rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-all bg-gray-50 h-[200px]">
                                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded z-10">
                                        Aadhar
                                    </div>
                                    {selectedDriver.aadhar_url ? (
                                        <>
                                            <img src={selectedDriver.aadhar_url} alt="Aadhar" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold shadow-lg">View Full</button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                            <FontAwesomeIcon icon={faPassport} className="text-4xl mb-2 opacity-30" />
                                            <span className="text-xs font-medium">No Document Uploaded</span>
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
