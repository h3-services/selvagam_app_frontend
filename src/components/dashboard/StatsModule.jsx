import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faUserFriends, faRoute } from '@fortawesome/free-solid-svg-icons';

const StatsModule = () => {
    const stats = [
        {
            title: 'Total Drivers',
            value: '28',
            icon: faCar,
            iconBg: 'bg-blue-100 text-blue-600',
            iconColor: 'text-white',
            variant: 'blue'
        },
        {
            title: 'Total Parents',
            value: '156',
            icon: faUserFriends,
            iconBg: 'bg-violet-100 text-violet-600',
            iconColor: 'text-white',
            variant: 'violet'
        },
        {
            title: 'Route Total',
            value: '5',
            icon: faRoute,
            iconBg: 'bg-emerald-100 text-emerald-600',
            iconColor: 'text-white',
            variant: 'emerald'
        }
    ];

    return (
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
                <div key={index} className={`group rounded-3xl p-6 border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden ${stat.variant === 'dark' ? 'bg-slate-900 border-slate-900 text-white' :
                    stat.variant === 'blue' ? 'bg-white border-blue-100' :
                        stat.variant === 'violet' ? 'bg-white border-violet-100' :
                            'bg-white border-emerald-100'
                    }`}>
                    {/* Decorative Gradients for Color Variants */}
                    {stat.variant === 'blue' && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-4 -mt-4 opacity-50 transaction-transform group-hover:scale-110 duration-500"></div>}
                    {stat.variant === 'violet' && <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-bl-[100px] -mr-4 -mt-4 opacity-50 transaction-transform group-hover:scale-110 duration-500"></div>}
                    {stat.variant === 'emerald' && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -mr-4 -mt-4 opacity-50 transaction-transform group-hover:scale-110 duration-500"></div>}

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${stat.iconBg}`}>
                                <FontAwesomeIcon icon={stat.icon} className="text-lg" />
                            </div>
                        </div>
                        <div>
                            <h3 className={`text-4xl font-bold tracking-tight mb-1 ${stat.variant === 'dark' ? 'text-white' : 'text-black'
                                }`}>{stat.value}</h3>
                            <p className={`font-medium ${stat.variant === 'dark' ? 'text-slate-400' :
                                stat.variant === 'blue' ? 'text-blue-600/80' :
                                    stat.variant === 'violet' ? 'text-violet-600/80' :
                                        'text-emerald-600/80'
                                }`}>{stat.title}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsModule;
