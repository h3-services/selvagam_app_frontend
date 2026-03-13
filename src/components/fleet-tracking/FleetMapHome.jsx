import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBus, 
    faMapMarkerAlt, 
    faArrowsRotate, 
    faPhone,
    faIdCard,
    faCircleDot
} from '@fortawesome/free-solid-svg-icons';
import { driverService } from '../../services/driverService';
import LiveFleetMap from './LiveFleetMap';

const FleetMapHome = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBus, setSelectedBus] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchLocations = useCallback(async (manual = false) => {
        if (manual) setIsRefreshing(true);
        try {
            const data = await driverService.getAllDriverLocations();
            setLocations(data || []);
        } catch (error) {
            console.error("Failed to fetch locations:", error);
        } finally {
            setLoading(false);
            if (manual) setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchLocations();
        const timer = setInterval(() => fetchLocations(), 10000);
        return () => clearInterval(timer);
    }, [fetchLocations]);

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-30 shadow-sm">
                <div className="flex items-center justify-between max-w-[1600px] mx-auto w-full">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                                Live Bus Map
                            </h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Track all buses in real-time</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => fetchLocations(true)}
                            disabled={isRefreshing}
                            className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95 flex items-center gap-3 group"
                        >
                            <FontAwesomeIcon icon={faArrowsRotate} className={`${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                            {isRefreshing ? 'Syncing...' : 'Refresh Hub'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row p-4 lg:p-8 gap-6 overflow-hidden">
                {/* Sidebar - Bus List */}
                <div className="w-full lg:w-[400px] flex flex-col gap-6 order-2 lg:order-1 overflow-hidden">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden max-h-full">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">All Buses</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{locations.length} Buses Tracking</p>
                            </div>
                            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-200">Live</div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="animate-pulse bg-slate-50 rounded-2xl p-4 flex gap-4">
                                        <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                                            <div className="h-2 bg-slate-200 rounded w-1/3"></div>
                                        </div>
                                    </div>
                                ))
                            ) : locations.length === 0 ? (
                                <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-4">
                                        <FontAwesomeIcon icon={faBus} size="2x" />
                                    </div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">No Active Drivers</h4>
                                    <p className="text-[10px] text-slate-300 font-bold uppercase mt-2 leading-relaxed">System is waiting for updates from driver devices</p>
                                </div>
                            ) : locations.map((loc) => (
                                <button
                                    key={loc.driver_id}
                                    onClick={() => setSelectedBus(loc)}
                                    className={`w-full p-4 rounded-3xl border transition-all flex items-center gap-4 group text-left ${selectedBus?.driver_id === loc.driver_id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedBus?.driver_id === loc.driver_id ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
                                        <FontAwesomeIcon icon={faBus} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-sm font-black tracking-tight leading-none mb-1 group-hover:translate-x-1 transition-transform truncate ${selectedBus?.driver_id === loc.driver_id ? 'text-white' : 'text-slate-900'}`}>
                                            {loc.driver_name || 'Vehicle ' + loc.driver_id.substring(0, 4)}
                                        </h4>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedBus?.driver_id === loc.driver_id ? 'text-white/60' : 'text-slate-400'}`}>
                                            Active • {loc.updated_at ? new Date(loc.updated_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </p>
                                    </div>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className={`text-xs ${selectedBus?.driver_id === loc.driver_id ? 'text-white' : 'text-slate-300 group-hover:text-indigo-500 transition-colors'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bus Detail Card (Selected) */}
                    {selectedBus && (
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl animate-in slide-in-from-bottom-8 duration-500 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                           
                           <div className="flex items-center justify-between mb-8">
                               <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                       <FontAwesomeIcon icon={faBus} />
                                   </div>
                                   <div>
                                       <h3 className="text-base font-black uppercase tracking-tight">Bus Information</h3>
                                       <div className="flex items-center gap-2">
                                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                           <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400">Linked to Trip</span>
                                       </div>
                                   </div>
                               </div>
                               <button 
                                onClick={() => setSelectedBus(null)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                               >
                                   <FontAwesomeIcon icon={faIdCard} className="text-[10px]" />
                               </button>
                           </div>

                           <div className="space-y-6">
                               <div>
                                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Full Name</p>
                                   <p className="text-lg font-black tracking-tight">{selectedBus.driver_name}</p>
                               </div>

                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                       <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Contact</p>
                                       <div className="flex items-center gap-2 text-indigo-400">
                                           <FontAwesomeIcon icon={faPhone} className="text-[10px]" />
                                           <span className="text-xs font-bold font-mono">{selectedBus.contact_number || 'N/A'}</span>
                                       </div>
                                   </div>
                                   <div>
                                       <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Coordinates</p>
                                       <div className="flex items-center gap-2 text-slate-400">
                                           <FontAwesomeIcon icon={faCircleDot} className="text-[10px]" />
                                           <span className="text-xs font-bold font-mono text-white/80">{selectedBus.latitude?.toFixed(4)}, {selectedBus.longitude?.toFixed(4)}</span>
                                       </div>
                                   </div>
                               </div>
                           </div>
                        </div>
                    )}
                </div>

                {/* Map Interface */}
                <div className="flex-1 h-[500px] lg:h-auto rounded-[3rem] border-4 border-white shadow-2xl relative overflow-hidden group order-1 lg:order-2 bg-white">
                    <LiveFleetMap onSelectBus={setSelectedBus} />
                    
                    {/* Floating Legend */}
                    <div className="absolute bottom-10 left-10 z-[1000] p-6 bg-white/90 backdrop-blur-2xl border border-white shadow-2xl rounded-[2.5rem] max-w-xs text-slate-900 pointer-events-none">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                                <FontAwesomeIcon icon={faBus} className="text-xs" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest">Fleet Legend</h4>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Online & Moving</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Offline (Timeout)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 0; }
            `}</style>
        </div>
    );
};

export default FleetMapHome;
