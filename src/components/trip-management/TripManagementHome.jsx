import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import TripList from './TripList';
import { tripService } from '../../services/tripService';
import { driverService } from '../../services/driverService';
import { busService } from '../../services/busService';
import { routeService } from '../../services/routeService';

const TripManagementHome = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Derived States
    const searchQuery = searchParams.get('search') || "";
    const selectedDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tripsData, driversData, busesData, routesData] = await Promise.all([
                tripService.getAllTrips(),
                driverService.getAllDrivers(),
                busService.getAllBuses(),
                routeService.getAllRoutes()
            ]);

            // Map IDs to details
            const mappedTrips = tripsData.map(trip => {
                const driver = driversData.find(d => d.driver_id === trip.driver_id);
                const bus = busesData.find(b => b.bus_id === trip.bus_id);
                const route = routesData.find(r => r.route_id === trip.route_id);

                return {
                    id: trip.trip_id,
                    route: route ? `${route.name} (${trip.trip_type})` : 'Unknown Route',
                    bus: bus ? `${bus.registration_number || bus.bus_number || 'Bus'} (${bus.seating_capacity || bus.capacity || '?'} seats)` : 'Unknown Bus',
                    driver: driver ? driver.name : 'Unassigned',
                    startTime: trip.started_at ? new Date(trip.started_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-',
                    endTime: trip.ended_at ? new Date(trip.ended_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-',
                    status: trip.status === 'NOT_STARTED' ? 'Scheduled' : 
                            trip.status === 'IN_PROGRESS' ? 'In Progress' : 
                            trip.status === 'COMPLETED' ? 'Completed' : trip.status,
                    date: trip.trip_date,
                    driverMobile: driver ? driver.contact_number : '-',
                    description: route ? `${route.start_location} to ${route.end_location}` : 'No route details',
                    trip_type: trip.trip_type
                };
            });

            setTrips(mappedTrips);
        } catch (error) {
            console.error("Failed to fetch trip data:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSearchChange = (value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) newParams.set('search', value);
        else newParams.delete('search');
        setSearchParams(newParams);
    };

    const handleDateChange = (value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) newParams.set('date', value);
        else newParams.delete('date');
        setSearchParams(newParams);
    };


    const filteredTrips = trips.filter(trip => {
        const matchesSearch = trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.bus.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.driver.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesDate = !selectedDate || trip.date === selectedDate;
        
        return matchesSearch && matchesDate;
    });

    const handleStatusChange = async (id, newStatus) => {
        try {
            const apiStatus = newStatus === 'In Progress' ? 'IN_PROGRESS' : 
                              newStatus === 'Completed' ? 'COMPLETED' : newStatus;
            
            await tripService.updateTripStatus(id, apiStatus);
            setTrips(trips.map(t => t.id === id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update trip status"); 
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className='ml-14 lg:ml-0'>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Trip Management</h1>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative group">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-full sm:w-44 bg-blue-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none"
                            />
                            <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search trips..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-full md:w-80 bg-blue-50/50 border border-indigo-100/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-indigo-300 transition-all outline-none placeholder:text-indigo-300"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 px-2 lg:px-8 pt-4 pb-4 overflow-hidden flex flex-col w-full">
                <div className="flex-1 flex flex-col min-h-0 lg:bg-white lg:rounded-[2.5rem] lg:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] lg:border lg:border-white lg:px-6 lg:pt-2 lg:pb-3 overflow-hidden">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faCalendarAlt} spin className="text-2xl text-blue-600" />
                            </div>
                            <p className="text-gray-500 font-medium tracking-wide">Loading...</p>
                        </div>
                    ) : (
                        <TripList
                            filteredTrips={filteredTrips}
                            handleStatusChange={handleStatusChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TripManagementHome;
