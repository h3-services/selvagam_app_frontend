import StatsModule from './StatsModule';
import MapModule from './MapModule';
import MaintenanceModule from './MaintenanceModule';

const DashboardHome = () => {
    return (
        <div className="h-full p-6 lg:p-10 bg-slate-50 overflow-y-auto">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                </div>
            </div>

            {/* Component Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <StatsModule />
                <MapModule />
                <MaintenanceModule />
            </div>
        </div>
    );
};

export default DashboardHome;
