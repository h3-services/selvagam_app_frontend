import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import StatsModule from './StatsModule';
import MaintenanceModule from './MaintenanceModule';
import ClassEnrollmentModule from './ClassEnrollmentModule';
import LiveFleetMap from '../fleet-tracking/LiveFleetMap';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

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

                    {/* Live Fleet Map Section */}
                    <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <FontAwesomeIcon icon={faMapLocationDot} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Live Fleet Progression</h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-time bus location tracking</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/fleet')}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95"
                            >
                                Open Map
                            </button>
                        </div>
                        <div className="h-[400px] w-full relative">
                            <LiveFleetMap height="400px" zoom={13} />
                        </div>
                    </div>

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
