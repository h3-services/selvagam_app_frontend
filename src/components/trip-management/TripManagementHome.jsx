import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import TripList from './TripList';

const TripManagementHome = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [trips, setTrips] = useState([
        {
            id: 'TRIP-001',
            route: 'Route A - Downtown',
            bus: 'AP 29 BD 1234',
            driver: 'John Doe',
            startTime: '08:00 AM',
            endTime: '09:30 AM',
            status: 'Completed',
            date: '2024-01-20',
            driverMobile: '+91 98765 43210',
            description: 'Regular morning route for downtown office areas'
        },
        {
            id: 'TRIP-002',
            route: 'Route B - Westside',
            bus: 'AP 29 BD 5678',
            driver: 'Jane Smith',
            startTime: '08:15 AM',
            endTime: '09:45 AM',
            status: 'In Progress',
            date: '2024-01-20',
            driverMobile: '+91 98765 43211',
            description: 'Serves Westside residential complex'
        },
        {
            id: 'TRIP-003',
            route: 'Route C - North Hills',
            bus: 'AP 29 BD 9012',
            driver: 'Mike Johnson',
            startTime: '07:45 AM',
            endTime: '09:15 AM',
            status: 'In Progress',
            date: '2024-01-21',
            driverMobile: '+91 98765 43212',
            description: 'North Hills school district loop'
        },
    ]);

    const filteredTrips = trips.filter(trip =>
        trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.bus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.driver.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStatusChange = (id, newStatus) => {
        setTrips(trips.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className='ml-20 lg:ml-0'>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Trip Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage daily trips, schedules, and assignments</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search trips..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-64 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                            />
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <TripList
                filteredTrips={filteredTrips}
                handleStatusChange={handleStatusChange}
            />
        </div>
    );
};

export default TripManagementHome;
