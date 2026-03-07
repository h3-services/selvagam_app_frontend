import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faRoute, 
    faBus, 
    faUser, 
    faClock, 
    faMapMarkerAlt,
    faCheckCircle,
    faCircle,
    faHistory,
    faCalendarAlt,
    faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import { tripService } from '../../services/tripService';
import { driverService } from '../../services/driverService';
import { busService } from '../../services/busService';
import { routeService } from '../../services/routeService';
import TripStatusBadge from './TripStatusBadge';

const TripDetail = ({ tripId, onBack }) => {
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTripDetails();
    }, [tripId]);

    const fetchTripDetails = async () => {
        setLoading(true);
        try {
            const [tripData, driversData, busesData, routesData] = await Promise.all([
                tripService.getTripById(tripId),
                driverService.getAllDrivers(),
                busService.getAllBuses(),
                routeService.getAllRoutes()
            ]);

            const driver = driversData.find(d => d.driver_id === tripData.driver_id);
            const bus = busesData.find(b => b.bus_id === tripData.bus_id);
            const route = routesData.find(r => r.route_id === tripData.route_id);

            setTrip({
                ...tripData,
                driverName: driver ? driver.name : 'Unknown',
                driverMobile: driver ? driver.contact_number : '-',
                busName: bus ? `${bus.registration_number || bus.bus_number || 'Bus'}` : 'Unknown',
                busCapacity: bus ? (bus.seating_capacity || bus.capacity || '?') : '?',
                routeName: route ? route.name : 'Unknown',
                routeDetails: route ? `${route.start_location} to ${route.end_location}` : 'No details'
            });
        } catch (err) {
            console.error("Failed to fetch trip details:", err);
            setError("Failed to load trip details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faHistory} spin className="text-2xl text-blue-600" />
                </div>
                <p className="text-gray-500 font-medium tracking-wide">Loading trip logs...</p>
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-red-500 font-medium">{error || "Trip not found"}</p>
                <button onClick={onBack} className="mt-4 text-blue-600 font-bold flex items-center gap-2">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Trips
                </button>
            </div>
        );
    }

    const formatTime = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="h-full flex flex-col animate-fade-in overflow-hidden">
            {/* Header / Nav */}
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-100 transition-all active:scale-95"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div>
                    <h2 className="text-xl font-black text-gray-900 leading-tight">Trip Details</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">ID: {trip.trip_id.substring(0, 8)}...</p>
                </div>
                <div className="ml-auto">
                    <TripStatusBadge status={trip.status === 'NOT_STARTED' ? 'Scheduled' : trip.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed'} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-8">
                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Route Info */}
                    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <FontAwesomeIcon icon={faRoute} />
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Route</h3>
                                <p className="font-bold text-gray-900">{trip.routeName}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Service</span>
                                <span className="font-bold text-gray-700">{trip.trip_type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Path</span>
                                <span className="font-bold text-gray-700 text-xs text-right">{trip.routeDetails}</span>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle & Driver */}
                    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <FontAwesomeIcon icon={faBus} />
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Bus & Driver</h3>
                                <p className="font-bold text-gray-900">{trip.busName}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <FontAwesomeIcon icon={faUser} className="text-gray-300 w-4" />
                                <span className="font-bold text-gray-700">{trip.driverName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="w-4" />
                                <span className="text-xs">{trip.driverMobile}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timing */}
                    <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <FontAwesomeIcon icon={faClock} />
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Timeline</h3>
                                <p className="font-bold text-gray-900">{formatDate(trip.trip_date)}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Started</span>
                                <span className="font-bold text-emerald-600">{formatTime(trip.started_at)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Ended</span>
                                <span className="font-bold text-rose-600">{formatTime(trip.ended_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trip Logs Section */}
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                                <FontAwesomeIcon icon={faHistory} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Trip Stop Logs</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-0.5">Real-time arrival tracking</p>
                            </div>
                        </div>
                        
                        {trip.status === 'COMPLETED' && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-wider">
                                <FontAwesomeIcon icon={faCheckCircle} />
                                All Stops Verified
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="relative pl-8 md:pl-12 py-4">
                        {/* The Vertical Line */}
                        <div className="absolute left-[2.45rem] md:left-[3.45rem] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-400 to-slate-200"></div>

                        <div className="space-y-8">
                            {trip.stop_logs && trip.stop_logs.length > 0 ? (
                                trip.stop_logs
                                    .sort((a, b) => a.stop_order - b.stop_order)
                                    .map((stop, index) => {
                                        const isArrived = !!stop.arrived_at;
                                        const isLast = index === trip.stop_logs.length - 1;
                                        
                                        return (
                                            <div key={stop.stop_id} className="relative group animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                                                {/* Stop Indicator Node */}
                                                <div className={`absolute -left-[1.3rem] md:-left-[1.3rem] top-1.5 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                                                    isArrived 
                                                    ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-110' 
                                                    : 'bg-white border-2 border-slate-200'
                                                }`}>
                                                    {isArrived ? (
                                                        <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xs" />
                                                    ) : (
                                                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                                    )}
                                                </div>

                                                <div className={`flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${isArrived ? 'bg-blue-50/40 border border-blue-100/50' : 'hover:bg-slate-50'}`}>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isArrived ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                                Stop {stop.stop_order}
                                                            </span>
                                                            <h4 className={`text-sm md:text-base font-bold ${isArrived ? 'text-blue-900' : 'text-gray-600'}`}>
                                                                {stop.stop_name}
                                                            </h4>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs font-bold">
                                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                                <FontAwesomeIcon icon={faLocationDot} className="text-[10px]" />
                                                                <span>Point {stop.stop_id.substring(0, 4)}</span>
                                                            </div>
                                                            {isArrived && (
                                                                <div className="flex items-center gap-1.5 text-blue-500">
                                                                    <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                                                                    <span>Arrived at {formatTime(stop.arrived_at)}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {isArrived ? (
                                                        <div className="hidden md:flex flex-col items-end">
                                                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Status</span>
                                                            <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase">Reached</span>
                                                        </div>
                                                    ) : (
                                                        <div className="hidden md:flex flex-col items-end">
                                                            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider mb-1">Status</span>
                                                            <span className="bg-slate-100 text-slate-400 text-[9px] font-black px-2 py-1 rounded-full uppercase">Pending</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-[2rem]">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-4xl mb-4 opacity-20" />
                                    <p className="font-bold">No stop logs available for this trip</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDetail;
