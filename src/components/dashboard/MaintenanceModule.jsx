import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faTools, faCheckCircle, faExclamationTriangle, faWrench, faBan, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { busService } from '../../services/busService';

const MaintenanceModule = () => {
    const [fleetStatus, setFleetStatus] = useState({
        active: 0,
        inactive: 0,
        maintenance: 0,
        spare: 0,
        total: 0,
        loading: true
    });

    useEffect(() => {
        const fetchFleetStatus = async () => {
            try {
                const buses = await busService.getAllBuses();
                
                let active = 0;
                let inactive = 0;
                let maintenance = 0;
                let spare = 0;

                buses.forEach(bus => {
                    const status = (bus.status || '').toUpperCase();
                    if (status === 'ACTIVE') active++;
                    else if (status === 'INACTIVE') inactive++;
                    else if (status === 'MAINTENANCE') maintenance++;
                    else if (status === 'SPARE') spare++;
                });
                
                setFleetStatus({
                    active,
                    inactive,
                    maintenance,
                    spare,
                    total: buses.length,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching fleet stats:", error);
                setFleetStatus(prev => ({ ...prev, loading: false }));
            }
        };

        fetchFleetStatus();
    }, []);

    const StatusCard = ({ label, count, icon, colorClass, bgClass, borderClass, ringClass, iconBgClass }) => (
        <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 border transition-all duration-300 hover:shadow-md group/card ${bgClass} ${borderClass}`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs transition-colors ${iconBgClass} ${colorClass}`}>
                    <FontAwesomeIcon icon={icon} />
                </div>
                <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${colorClass}`}>{label}</span>
            </div>
            <div className="flex items-end gap-1.5 sm:gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                    {fleetStatus.loading ? '-' : count}
                </span>
                <span className={`text-[9px] sm:text-[10px] font-bold mb-0.5 sm:mb-1 opacity-70 ${colorClass}`}>
                    Buses
                </span>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10 shrink-0">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800">Fleet Status</h3>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <FontAwesomeIcon icon={faBus} className="text-lg sm:text-xl" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 relative z-10 mb-4 sm:mb-6">
                {/* Active */}
                <StatusCard 
                    label="Active" 
                    count={fleetStatus.active} 
                    icon={faCheckCircle}
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-50/50 hover:bg-emerald-50"
                    borderClass="border-emerald-100/50"
                    iconBgClass="bg-emerald-100"
                />

                {/* Inactive */}
                <StatusCard 
                    label="Inactive" 
                    count={fleetStatus.inactive} 
                    icon={faBan}
                    colorClass="text-rose-600"
                    bgClass="bg-rose-50/50 hover:bg-rose-50"
                    borderClass="border-rose-100/50"
                    iconBgClass="bg-rose-100"
                />

                {/* Maintenance */}
                <StatusCard 
                    label="Maintenance" 
                    count={fleetStatus.maintenance} 
                    icon={faWrench}
                    colorClass="text-amber-600"
                    bgClass="bg-amber-50/50 hover:bg-amber-50"
                    borderClass="border-amber-100/50"
                    iconBgClass="bg-amber-100"
                />

                {/* Spare */}
                <StatusCard 
                    label="Spare" 
                    count={fleetStatus.spare} 
                    icon={faWarehouse}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-50/50 hover:bg-blue-50"
                    borderClass="border-blue-100/50"
                    iconBgClass="bg-blue-100"
                />
            </div>


            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-slate-50 rounded-full -mr-10 sm:-mr-16 -mt-10 sm:-mt-16 opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
        </div>
    );
};

export default MaintenanceModule;
