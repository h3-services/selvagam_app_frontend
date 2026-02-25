import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import StatsModule from './StatsModule';
import MaintenanceModule from './MaintenanceModule';
import ClassEnrollmentModule from './ClassEnrollmentModule';

const DashboardHome = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className='ml-14 lg:ml-0'>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    </div>
                </div>
            </div>

            {/* Component Grid */}
            <div className="flex-1 px-3 sm:px-4 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-[1600px] mx-auto">
                    <StatsModule />
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <MaintenanceModule />
                        <ClassEnrollmentModule />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
