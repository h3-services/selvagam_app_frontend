import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faCheckCircle, faTimesCircle, faWrench } from '@fortawesome/free-solid-svg-icons';

const MaintenanceModule = () => {
    const busStatus = [
        { label: 'Active Buses', value: '24', color: 'emerald', icon: faBus },
        { label: 'Maintenance', value: '2', color: 'amber', icon: faWrench },
        { label: 'Inactive', value: '6', color: 'slate', icon: faTimesCircle }
    ];

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 h-[600px] flex flex-col">
            <div className="mb-8">
                <h3 className="font-bold text-lg text-slate-900">Fleet Status</h3>
            </div>

            <div className="flex-1 flex flex-col gap-6">
                {busStatus.map((status, index) => (
                    <div key={index} className="group p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                                    status.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                                        'bg-slate-200 text-slate-600'
                                    }`}>
                                    <FontAwesomeIcon icon={status.icon} className="text-sm" />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-slate-900 block">{status.label}</span>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-slate-900">{status.value}</span>
                        </div>
                        <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${status.color === 'emerald' ? 'bg-emerald-500' :
                                    status.color === 'amber' ? 'bg-amber-500' :
                                        'bg-slate-400'
                                    }`}
                                style={{ width: `${(parseInt(status.value) / 32) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}

                {/* Total Summary Card */}
                <div className="mt-auto bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Total Fleet Size</p>
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-bold">32</span>
                            <span className="text-sm text-slate-400 mb-1.5">Vehicles registered</span>
                        </div>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-indigo-500 opacity-20 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-20 h-20 rounded-full bg-emerald-500 opacity-20 blur-2xl"></div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceModule;
