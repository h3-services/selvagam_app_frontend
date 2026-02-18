import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faBus, 
    faCheck, 
    faMagic, 
    faHashtag, 
    faTruck, 
    faTrademark, 
    faCarSide, 
    faChair, 
    faInfoCircle, 
    faUser, 
    faRoute, 
    faCalendarAlt, 
    faLink,
    faChevronDown,
    faCogs,
    faShieldAlt,
    faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';

const InputField = ({ label, icon, type = "text", value, onChange, placeholder, disabled = false, error }) => (
    <div className="relative group/field">
        <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em] ml-1">{label}</label>
        <div className={`relative flex items-center bg-white rounded-2xl border transition-all duration-500 ${disabled ? 'bg-slate-50 border-slate-100' : error ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500'}`}>
            <div className="w-12 h-12 flex items-center justify-center text-slate-400 absolute left-0 top-0 pointer-events-none transition-all group-focus-within/field:text-blue-600 group-focus-within/field:scale-110">
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full pl-12 pr-4 py-4 bg-transparent rounded-2xl text-[13px] font-bold text-slate-700 placeholder-slate-300 focus:outline-none disabled:text-slate-400"
                placeholder={placeholder}
            />
        </div>
    </div>
);

const SelectField = ({ label, icon, value, onChange, options, placeholder, disabled = false }) => (
    <div className="relative group/field">
        <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-[0.15em] ml-1">{label}</label>
        <div className={`relative flex items-center bg-white rounded-2xl border transition-all duration-500 ${disabled ? 'bg-slate-50 border-slate-100' : 'border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500'}`}>
            <div className="w-12 h-12 flex items-center justify-center text-slate-400 absolute left-0 top-0 pointer-events-none transition-all group-focus-within/field:text-blue-600 group-focus-within/field:scale-110">
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full pl-12 pr-10 py-4 bg-transparent rounded-2xl text-[13px] font-bold text-slate-700 focus:outline-none appearance-none disabled:text-slate-400 cursor-pointer"
            >
                <option value="">{placeholder}</option>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 text-xs">
                <FontAwesomeIcon icon={faChevronDown} />
            </div>
        </div>
    </div>
);

const AddBusForm = ({ show, onClose, onAdd, drivers = [], routes = [] }) => {
    const [newBus, setNewBus] = useState({ 
        registration_number: '', 
        bus_name: '',
        vehicle_type: 'School Bus', 
        bus_brand: '', 
        bus_model: '', 
        seating_capacity: '', 
        status: 'Active',
        driver_id: '',
        route_id: '',
        rc_expiry_date: '',
        fc_expiry_date: '',
        rc_book_url: '',
        fc_certificate_url: ''
    });

    const [touched, setTouched] = useState({});

    const isValid = newBus.registration_number && newBus.bus_name && newBus.vehicle_type;

    const handleAutoFill = () => {
        const brand = ['Tata', 'Ashok Leyland', 'Eicher', 'Force'][Math.floor(Math.random() * 4)];
        const model = ['Starbus', 'Viking', 'Pro 3000', 'Traveller'][Math.floor(Math.random() * 4)];
        setNewBus({
            registration_number: `TN${Math.floor(Math.random() * 90) + 10}AB${Math.floor(Math.random() * 9000) + 1000}`,
            bus_name: `${brand} ${model} - ${Math.floor(Math.random() * 100)}`,
            vehicle_type: ['School Bus', 'Mini', 'Van'][Math.floor(Math.random() * 3)],
            bus_brand: brand,
            bus_model: model,
            seating_capacity: Math.floor(Math.random() * 30) + 20,
            status: ['Active', 'Maintenance', 'Inactive'][Math.floor(Math.random() * 3)],
            driver_id: drivers.length > 0 ? drivers[Math.floor(Math.random() * drivers.length)].driver_id : '',
            route_id: routes.length > 0 ? routes[Math.floor(Math.random() * routes.length)].route_id : '',
            rc_expiry_date: new Date(Date.now() + Math.random() * 31536000000).toISOString().split('T')[0],
            fc_expiry_date: new Date(Date.now() + Math.random() * 15768000000).toISOString().split('T')[0],
            rc_book_url: 'https://example.com/rc_book.pdf',
            fc_certificate_url: 'https://example.com/fc_cert.pdf'
        });
        setTouched({ registration_number: true, bus_name: true, vehicle_type: true });
    };

    const handleAdd = () => {
        setTouched({ registration_number: true, bus_name: true, vehicle_type: true });
        if (isValid) {
            onAdd(newBus);
            setNewBus({ 
                registration_number: '', 
                bus_name: '',
                vehicle_type: 'School Bus', 
                bus_brand: '', 
                bus_model: '', 
                seating_capacity: '', 
                status: 'Active',
                driver_id: '',
                route_id: '',
                rc_expiry_date: '',
                fc_expiry_date: '',
                rc_book_url: '',
                fc_certificate_url: ''
            });
            setTouched({});
        }
    };

    const handleClose = () => {
        setNewBus({ 
            registration_number: '', 
            bus_name: '',
            vehicle_type: 'School Bus', 
            bus_brand: '', 
            bus_model: '', 
            seating_capacity: '', 
            status: 'Active',
            driver_id: '',
            route_id: '',
            rc_expiry_date: '',
            fc_expiry_date: '',
            rc_book_url: '',
            fc_certificate_url: ''
        });
        setTouched({});
        onClose();
    };

    if (!show) return null;

    return (
        <>
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[1999] transition-opacity duration-300" onClick={handleClose} />
            
            <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-slate-50 shadow-2xl z-[2001] flex flex-col transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
                
                {/* Header Substrate */}
                <div className="relative px-8 py-8 bg-slate-50 flex justify-between items-center z-10">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-blue-600 blur-xl opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-700"></div>
                            <div className="w-14 h-14 rounded-[22px] flex items-center justify-center shadow-[0_10px_25px_rgba(58,123,255,0.25)] relative z-10 text-white transform group-hover:rotate-6 transition-transform duration-500" style={{ background: `linear-gradient(135deg, ${COLORS.SIDEBAR_BG}, #1e3a8a)` }}>
                                <FontAwesomeIcon icon={faBus} className="text-lg" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-none mb-1.5">Add Fleet Asset</h3>
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-600 w-1.5 h-1.5 rounded-full animate-pulse"></span>
                                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em]">Vehicle Inventory Management</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleAutoFill}
                            className="h-12 px-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[10px] uppercase tracking-widest gap-2.5 transition-all active:scale-95 shadow-sm"
                        >
                            <FontAwesomeIcon icon={faMagic} className="opacity-70" /> 
                            <span>Auto Pilot</span>
                        </button>
                        <button 
                            onClick={handleClose} 
                            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all duration-300 shadow-sm active:scale-90"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* Form Environment */}
                <div className="flex-1 overflow-y-auto px-8 pb-32 space-y-8 custom-scrollbar">
                    
                    {/* Vehicle Specifications Bento */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                <FontAwesomeIcon icon={faClipboardList} className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1.5">Specifications</h4>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Core Asset Identification</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-5">
                                <InputField 
                                    label="Registration No" 
                                    icon={faHashtag} 
                                    value={newBus.registration_number} 
                                    onChange={(e) => setNewBus({...newBus, registration_number: e.target.value})} 
                                    placeholder="TNXXABXXXX" 
                                    error={touched.registration_number && !newBus.registration_number}
                                />
                                <InputField 
                                    label="Asset Callsign" 
                                    icon={faBus} 
                                    value={newBus.bus_name} 
                                    onChange={(e) => setNewBus({...newBus, bus_name: e.target.value})} 
                                    placeholder="e.g. ALPHA-01" 
                                    error={touched.bus_name && !newBus.bus_name}
                                />
                            </div>

                            <SelectField 
                                label="Vehicle Category" 
                                icon={faTruck} 
                                value={newBus.vehicle_type} 
                                onChange={(e) => setNewBus({...newBus, vehicle_type: e.target.value})} 
                                placeholder="Select Category"
                                options={[
                                    { value: 'School Bus', label: 'School Bus' },
                                    { value: 'Mini', label: 'Mini Bus' },
                                    { value: 'Van', label: 'Utility Van' }
                                ]} 
                            />

                            <div className="grid grid-cols-2 gap-5">
                                <InputField label="Manufacturer" icon={faTrademark} value={newBus.bus_brand} onChange={(e) => setNewBus({...newBus, bus_brand: e.target.value})} placeholder="Tata / AL" />
                                <InputField label="Fleet Model" icon={faCarSide} value={newBus.bus_model} onChange={(e) => setNewBus({...newBus, bus_model: e.target.value})} placeholder="Viking / Starbus" />
                            </div>
                        </div>
                    </div>

                    {/* Fleet Layout Bento */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                <FontAwesomeIcon icon={faCogs} className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1.5">Asset Layout</h4>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Capacity & Status Configuration</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <InputField label="Seat Capacity" icon={faChair} type="number" value={newBus.seating_capacity} onChange={(e) => setNewBus({...newBus, seating_capacity: e.target.value})} placeholder="40" />
                            <SelectField 
                                label="Operational Status" 
                                icon={faInfoCircle} 
                                value={newBus.status} 
                                onChange={(e) => setNewBus({...newBus, status: e.target.value})} 
                                options={[
                                    { value: 'Active', label: 'Active Service' },
                                    { value: 'Maintenance', label: 'Maintenance Bay' },
                                    { value: 'Inactive', label: 'Decommissioned' }
                                ]} 
                            />
                        </div>
                    </div>

                    {/* Operational Assignment Bento */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                <FontAwesomeIcon icon={faRoute} className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1.5">Assignments</h4>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Personnel & Logistics Link</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <SelectField 
                                label="Fleet Captain" 
                                icon={faUser} 
                                value={newBus.driver_id} 
                                onChange={(e) => setNewBus({...newBus, driver_id: e.target.value})} 
                                placeholder="Select Captain"
                                options={drivers.map(d => ({ value: d.driver_id, label: d.name }))} 
                            />
                            <SelectField 
                                label="Assigned Route" 
                                icon={faRoute} 
                                value={newBus.route_id} 
                                onChange={(e) => setNewBus({...newBus, route_id: e.target.value})} 
                                placeholder="Select Route"
                                options={routes.map(r => ({ value: r.route_id, label: r.name }))} 
                            />
                        </div>
                    </div>

                    {/* Compliance Assets Bento */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-2xl" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1.5">Compliance Assets</h4>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Legal Registry Documents</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-5">
                                <InputField label="RC Lifecycle End" icon={faCalendarAlt} type="date" value={newBus.rc_expiry_date} onChange={(e) => setNewBus({...newBus, rc_expiry_date: e.target.value})} />
                                <InputField label="FC Lifecycle End" icon={faCalendarAlt} type="date" value={newBus.fc_expiry_date} onChange={(e) => setNewBus({...newBus, fc_expiry_date: e.target.value})} />
                            </div>
                            <InputField label="RC Digital Asset" icon={faLink} value={newBus.rc_book_url} onChange={(e) => setNewBus({...newBus, rc_book_url: e.target.value})} placeholder="https://..." />
                            <InputField label="FC Digital Asset" icon={faLink} value={newBus.fc_certificate_url} onChange={(e) => setNewBus({...newBus, fc_certificate_url: e.target.value})} placeholder="https://..." />
                        </div>
                    </div>
                </div>

                {/* Execution Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-20">
                    <button
                        onClick={handleAdd}
                        className={`group w-full h-14 rounded-2xl font-black text-white text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 ${!isValid && Object.keys(touched).length > 0 ? 'bg-slate-400 opacity-60 cursor-not-allowed' : 'hover:scale-[1.01] hover:shadow-blue-500/25 active:scale-95'}`}
                        style={{ 
                            background: isValid || Object.keys(touched).length === 0 
                                ? 'linear-gradient(135deg, #3A7BFF 0%, #1e3a8a 100%)' 
                                : '' 
                        }}
                    >
                        <span>Add Vehicle</span>
                        <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                            <FontAwesomeIcon icon={faCheck} className="text-xs" />
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddBusForm;
