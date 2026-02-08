import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUserFriends, faRoute, faGraduationCap, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { studentService } from '../../services/studentService';
import { driverService } from '../../services/driverService';
import { parentService } from '../../services/parentService';
import { routeService } from '../../services/routeService';

const StatsModule = () => {
    const [stats, setStats] = useState([
        {
            title: 'Total Students',
            value: '-',
            icon: faGraduationCap,
            iconBg: 'bg-indigo-100 text-indigo-600',
            variant: 'indigo',
            loading: true
        },
        {
            title: 'Total Drivers',
            value: '-',
            icon: faCar,
            iconBg: 'bg-purple-100 text-purple-600',
            variant: 'purple',
            loading: true
        },
        {
            title: 'Total Parents',
            value: '-',
            icon: faUserFriends,
            iconBg: 'bg-pink-100 text-pink-600',
            variant: 'pink',
            loading: true
        },
        {
            title: 'Active Routes',
            value: '-',
            icon: faRoute,
            iconBg: 'bg-emerald-100 text-emerald-600',
            variant: 'emerald',
            loading: true
        }
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [students, drivers, parents, routes] = await Promise.all([
                    studentService.getAllStudents(),
                    driverService.getAllDrivers(),
                    parentService.getAllParents(),
                    routeService.getAllRoutes()
                ]);

                setStats([
                    {
                        title: 'Total Students',
                        value: students.length,
                        icon: faGraduationCap,
                        iconBg: 'bg-indigo-100 text-indigo-600',
                        variant: 'indigo',
                        loading: false
                    },
                    {
                        title: 'Total Drivers',
                        value: drivers.length,
                        icon: faCar,
                        iconBg: 'bg-purple-100 text-purple-600',
                        variant: 'purple',
                        loading: false
                    },
                    {
                        title: 'Total Parents',
                        value: parents.length,
                        icon: faUserFriends,
                        iconBg: 'bg-pink-100 text-pink-600',
                        variant: 'pink',
                        loading: false
                    },
                    {
                        title: 'Active Routes',
                        value: routes.length,
                        icon: faRoute,
                        iconBg: 'bg-emerald-100 text-emerald-600',
                        variant: 'emerald',
                        loading: false
                    }
                ]);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                // Simplify error handling by just removing loading state
                setStats(prev => prev.map(s => ({ ...s, loading: false, value: '0' })));
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div key={index} className={`group rounded-3xl p-6 border shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden bg-white ${
                    stat.variant === 'indigo' ? 'border-indigo-100' :
                    stat.variant === 'purple' ? 'border-purple-100' :
                    stat.variant === 'pink' ? 'border-pink-100' :
                    'border-emerald-100'
                }`}>
                    {/* Decorative Gradients */}
                    {stat.variant === 'indigo' && <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>}
                    {stat.variant === 'purple' && <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>}
                    {stat.variant === 'pink' && <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>}
                    {stat.variant === 'emerald' && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>}

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${stat.iconBg}`}>
                                <FontAwesomeIcon icon={stat.icon} className="text-lg" />
                            </div>
                        </div>
                        <div>
                            {stat.loading ? (
                                <div className="h-9 w-24 bg-gray-100 rounded-lg animate-pulse mb-1"></div>
                            ) : (
                                <h3 className="text-4xl font-bold tracking-tight text-slate-900 mb-1">{stat.value}</h3>
                            )}
                            <p className="font-medium text-slate-500">{stat.title}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsModule;
