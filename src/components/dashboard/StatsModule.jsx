import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUserFriends, faRoute, faGraduationCap, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { studentService } from '../../services/studentService';
import { driverService } from '../../services/driverService';
import { parentService } from '../../services/parentService';
import { routeService } from '../../services/routeService';

const StatsModule = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([
        {
            title: 'Total Students',
            value: '-',
            icon: faGraduationCap,
            iconBg: 'bg-indigo-100 text-blue-600',
            variant: 'indigo',
            link: '/students',
            loading: true
        },
        {
            title: 'Total Drivers',
            value: '-',
            icon: faCar,
            iconBg: 'bg-blue-100 text-blue-600',
            variant: 'purple',
            link: '/drivers',
            loading: true
        },
        {
            title: 'Total Parents',
            value: '-',
            icon: faUserFriends,
            iconBg: 'bg-pink-100 text-pink-600',
            variant: 'pink',
            link: '/parents',
            loading: true
        },
        {
            title: 'Total Routes',
            value: '-',
            icon: faRoute,
            iconBg: 'bg-emerald-100 text-emerald-600',
            variant: 'emerald',
            link: '/routes',
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
                        iconBg: 'bg-indigo-100 text-blue-600',
                        variant: 'indigo',
                        link: '/students',
                        loading: false
                    },
                    {
                        title: 'Total Drivers',
                        value: drivers.length,
                        icon: faCar,
                        iconBg: 'bg-blue-100 text-blue-600',
                        variant: 'purple',
                        link: '/drivers',
                        loading: false
                    },
                    {
                        title: 'Total Parents',
                        value: parents.length,
                        icon: faUserFriends,
                        iconBg: 'bg-pink-100 text-pink-600',
                        variant: 'pink',
                        link: '/parents',
                        loading: false
                    },
                    {
                        title: 'Total Routes',
                        value: routes.length,
                        icon: faRoute,
                        iconBg: 'bg-emerald-100 text-emerald-600',
                        variant: 'emerald',
                        link: '/routes',
                        loading: false
                    }
                ]);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setStats(prev => prev.map(s => ({ ...s, loading: false, value: '0' })));
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {stats.map((stat, index) => (
                <div key={index} onClick={() => navigate(stat.link)} className={`group rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 border shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden bg-white cursor-pointer hover:-translate-y-1 ${
                    stat.variant === 'indigo' ? 'border-indigo-100' :
                    stat.variant === 'purple' ? 'border-blue-100' :
                    stat.variant === 'pink' ? 'border-pink-100' :
                    'border-emerald-100'
                }`}>
                    {/* Decorative Gradients */}
                    {stat.variant === 'indigo' && <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-blue-50 rounded-bl-full -mr-4 sm:-mr-8 -mt-4 sm:-mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>}
                    {stat.variant === 'purple' && <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-blue-50 rounded-bl-full -mr-4 sm:-mr-8 -mt-4 sm:-mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>}
                    {stat.variant === 'pink' && <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-pink-50 rounded-bl-full -mr-4 sm:-mr-8 -mt-4 sm:-mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>}
                    {stat.variant === 'emerald' && <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-emerald-50 rounded-bl-full -mr-4 sm:-mr-8 -mt-4 sm:-mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>}

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${stat.iconBg}`}>
                                <FontAwesomeIcon icon={stat.icon} className="text-sm sm:text-base lg:text-lg" />
                            </div>
                        </div>
                        <div>
                            {stat.loading ? (
                                <div className="h-7 sm:h-9 w-16 sm:w-24 bg-gray-100 rounded-lg animate-pulse mb-1"></div>
                            ) : (
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-0.5 sm:mb-1">{stat.value}</h3>
                            )}
                            <p className="text-xs sm:text-sm font-medium text-slate-500 leading-tight">{stat.title}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsModule;
