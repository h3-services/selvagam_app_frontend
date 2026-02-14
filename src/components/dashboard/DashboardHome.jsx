import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import StatsModule from './StatsModule';
import MapModule from './MapModule';
import MaintenanceModule from './MaintenanceModule';

const DashboardHome = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full p-6 lg:p-8 flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 ml-20 lg:ml-0">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm mt-1 ml-20 lg:ml-0">Real-time insights and fleet management summary.</p>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-3 ml-20 lg:ml-0">
                    <button 
                        onClick={() => navigate('/students')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                        <FontAwesomeIcon icon={faUserGraduate} />
                        Manage Students
                    </button>
                    <button 
                        onClick={() => navigate('/parents')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white text-sm font-bold rounded-xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-200 active:scale-95"
                    >
                        <FontAwesomeIcon icon={faUserFriends} />
                        Manage Parents
                    </button>
                </div>
            </div>

            {/* Component Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-10">
                <StatsModule />
                <MapModule />
                <MaintenanceModule />
            </div>
        </div>
    );
};

export default DashboardHome;
