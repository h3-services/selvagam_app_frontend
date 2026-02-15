import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faIdCard, faCar, faCompass, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const DriverList = ({
    filteredDrivers,
    setSelectedDriver,
    handleToggleStatus,
    handleDelete,
    activeMenuId,
    setActiveMenuId,
    viewMode
}) => {
    return (
        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDrivers.map((driver) => {
                    const isActive = driver.status === 'Active';
                    
                    return (
                        <div 
                            key={driver.id} 
                            onClick={() => setSelectedDriver(driver)}
                            className="group relative bg-white rounded-[2rem] px-6 py-5 border border-slate-200 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_45px_100px_-25px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 cursor-pointer"
                        >
                            {/* Accent Bar */}
                            <div className={`absolute left-0 top-[25%] bottom-[25%] w-1 rounded-r-full transition-all duration-500 ${isActive ? 'bg-blue-600' : 'bg-slate-200'} group-hover:h-[40%]`} />

                            <div className="flex flex-col h-full pl-3">
                                
                                {/* Photo/Identity Section */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-110 transition-transform duration-500">
                                        {driver.photo_url ? (
                                            <img src={driver.photo_url} alt={driver.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-black text-lg">
                                                {driver.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 group-hover:text-blue-600 transition-colors">Fleet Member</p>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight truncate leading-tight">
                                            {driver.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* Operational Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:border-blue-100 transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FontAwesomeIcon icon={faCar} className="text-[8px] text-slate-300" />
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Vehicle</p>
                                        </div>
                                        <p className="text-xs font-black text-slate-800 tracking-tight truncate">{driver.vehicleNumber || 'Unassigned'}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:border-blue-100 transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FontAwesomeIcon icon={faCompass} className="text-[8px] text-slate-300" />
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Route</p>
                                        </div>
                                        <p className="text-xs font-black text-slate-800 tracking-tight truncate">{driver.route || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Credentials Bar */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faIdCard} className="text-[10px] text-slate-300" />
                                        <div>
                                            <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest leading-none">License</p>
                                            <p className="text-[10px] font-black text-slate-600 leading-none mt-1">{driver.licenseNumber || 'PENDING'}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                        isActive 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                            : 'bg-slate-50 text-slate-400 border-slate-200'
                                    }`}>
                                        {driver.status}
                                    </span>
                                </div>

                                {/* Action Hook */}
                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between group/action cursor-pointer">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover/action:text-blue-600 transition-colors">View Profile</span>
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/action:bg-blue-600 group-hover/action:text-white transition-all shadow-sm">
                                        <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DriverList;
