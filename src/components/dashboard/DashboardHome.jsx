import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import StatsModule from './StatsModule';
import MaintenanceModule from './MaintenanceModule';
import ClassEnrollmentModule from './ClassEnrollmentModule';

const DashboardHome = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full p-6 lg:p-8 flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                   <h1 className="text-2xl font-bold text-gray-800 ml-20 lg:ml-0">Dashboard Overview</h1>
                   {/* <p className="text-gray-500 text-sm mt-1 ml-20 lg:ml-0">Real-time insights and fleet management summary.</p> */}
                </div>
            </div>

            {/* Component Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-10">
                <StatsModule />
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MaintenanceModule />
                    <ClassEnrollmentModule />
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
