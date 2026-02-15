import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faTimes, 
    faCheck, 
    faEdit, 
    faEnvelope, 
    faPhone, 
    faIdCard, 
    faCar, 
    faCalendarAlt, 
    faPassport, 
    faShieldHalved, 
    faClock, 
    faToggleOn, 
    faToggleOff, 
    faLink, 
    faFingerprint,
    faBriefcase,
    faUserCircle,
    faCogs
} from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';

const DriverDetail = ({ selectedDriver, onBack, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        if (selectedDriver) {
            setEditData({
                ...selectedDriver,
                phone: Number(selectedDriver.mobile || selectedDriver.phone),
                licence_number: selectedDriver.licenseNumber || selectedDriver.licence_number,
                kyc_verified: selectedDriver.kyc_verified === 1 || selectedDriver.kyc_verified === true,
                is_available: selectedDriver.is_available === 1 || selectedDriver.is_available === true
            });
        }
    }, [selectedDriver]);

    const handleSaveEdit = () => {
        const payload = {
            ...editData,
            status: editData.status?.toUpperCase() || "ACTIVE"
        };
        onUpdate(payload);
        setIsEditing(false);
    };

    if (!selectedDriver) return null;

    const DetailItem = ({ icon, label, value, field, type = "text", editable = true }) => (
        <div className="group p-5 bg-[#fcfcfd] rounded-[2rem] border border-slate-100 hover:border-blue-100 transition-all duration-300">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white text-slate-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 group-hover:text-blue-600 transition-colors">{label}</p>
                    {isEditing && editable ? (
                        <input
                            type={type}
                            value={editData?.[field] || ''}
                            onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-black text-slate-900 outline-none focus:border-blue-400"
                        />
                    ) : (
                        <p className="text-sm font-black text-slate-900 tracking-tight truncate leading-tight">{value || 'NOT_SET'}</p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-[#f1f5f9] animate-fade-in overflow-hidden">
            {/* Action Bar */}
            <div className="px-10 py-6 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center shadow-sm">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">Dossier Access</p>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none font-['Outfit']">Identity Verification</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-2xl bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Abort</button>
                            <button onClick={handleSaveEdit} className="px-8 py-3 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-indigo-100">
                                <FontAwesomeIcon icon={faCheck} /> Commit Changes
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-8 py-3 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-indigo-100">
                            <FontAwesomeIcon icon={faEdit} /> Modify Dossier
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-10">
                    
                    {/* Left Panel: Profile & Status */}
                    <div className="col-span-12 lg:col-span-4 space-y-10">
                        {/* Profile Bento */}
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-bl-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
                            
                            <div className="relative mx-auto w-32 h-32 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden mb-8 group-hover:scale-105 transition-transform duration-500">
                                {selectedDriver.photo_url ? (
                                    <img src={selectedDriver.photo_url} alt={selectedDriver.name} className="w-full h-full object-cover" />
                                ) : (
                                    <FontAwesomeIcon icon={faUserCircle} className="text-6xl text-slate-200" />
                                )}
                            </div>

                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 relative z-10 font-['Outfit']">{selectedDriver.name}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 relative z-10">System ID: {selectedDriver.id}</p>

                            <div className="flex flex-wrap justify-center gap-3 relative z-10 mb-8">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${selectedDriver.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                    {selectedDriver.status}
                                </span>
                                {selectedDriver.kyc_verified === 1 && (
                                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faShieldHalved} /> Verified
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="p-4 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex items-center justify-between group/toggle">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${selectedDriver.is_available === 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                            <FontAwesomeIcon icon={selectedDriver.is_available === 1 ? faCheck : faTimes} />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Availability</p>
                                    </div>
                                    {isEditing && (
                                        <button onClick={() => setEditData({ ...editData, is_available: !editData.is_available })} className="text-2xl text-blue-600 transition-transform active:scale-95">
                                            <FontAwesomeIcon icon={editData?.is_available ? faToggleOn : faToggleOff} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Operational Card */}
                        <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-tl-full -mr-16 -mb-16 group-hover:scale-110 transition-transform duration-700" />
                            <h4 className="flex items-center gap-3 text-[10px] font-black text-white/40 uppercase tracking-widest mb-6">
                                <FontAwesomeIcon icon={faCogs} className="text-blue-500" />
                                Active Assignment
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Vehicle</p>
                                    <p className="text-lg font-black tracking-tight">{selectedDriver.vehicleNumber || 'BASE'}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Route</p>
                                    <p className="text-lg font-black tracking-tight">{selectedDriver.route || 'TRANSIT'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Detailed Metrics */}
                    <div className="col-span-12 lg:col-span-8 space-y-10">
                        {/* Information Grid */}
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16" />
                            <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-widest mb-10 relative z-10">
                                <FontAwesomeIcon icon={faFingerprint} className="text-blue-600" />
                                Identification Metrics
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                <DetailItem icon={faEnvelope} label="Communication Line" value={selectedDriver.email} field="email" type="email" />
                                <DetailItem icon={faPhone} label="Terminal Contact" value={selectedDriver.mobile || selectedDriver.phone} field="phone" type="number" />
                                <DetailItem icon={faCalendarAlt} label="Lifecycle Origin" value={selectedDriver.dob} field="dob" type="date" />
                                <DetailItem icon={faIdCard} label="License Directive" value={selectedDriver.licenseNumber || selectedDriver.licence_number} field="licence_number" />
                                <DetailItem icon={faClock} label="Clearance Expiry" value={selectedDriver.licence_expiry} field="licence_expiry" type="date" />
                                <DetailItem icon={faPassport} label="Universal Registry" value={selectedDriver.aadhar_number} field="aadhar_number" />
                            </div>
                        </div>

                        {/* Document Assets */}
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                            <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-widest mb-10">
                                <FontAwesomeIcon icon={faLink} className="text-blue-600" />
                                Legal Documentation Assets
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { label: 'License Clearance', url: selectedDriver.licence_url, icon: faIdCard },
                                    { label: 'Aadhar Registry', url: selectedDriver.aadhar_url, icon: faPassport }
                                ].map((doc, idx) => (
                                    <div key={idx} className="group/asset relative aspect-[16/10] bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 overflow-hidden hover:border-blue-400 hover:shadow-2xl transition-all duration-500">
                                        {doc.url ? (
                                            <>
                                                <img src={doc.url} alt={doc.label} className="w-full h-full object-cover group-hover/asset:scale-105 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-slate-900/0 group-hover/asset:bg-slate-900/20 transition-all flex items-center justify-center">
                                                    <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl scale-90 opacity-0 group-hover/asset:scale-100 group-hover/asset:opacity-100 transition-all">Inspect Asset</button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                                                <FontAwesomeIcon icon={doc.icon} className="text-4xl mb-4 group-hover/asset:text-slate-300 transition-colors" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Asset Missing</span>
                                            </div>
                                        )}
                                        <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
                                            {doc.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDetail;
