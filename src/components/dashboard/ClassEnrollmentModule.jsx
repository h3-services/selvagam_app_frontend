import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faUsers, faMars, faVenus, faRoute } from '@fortawesome/free-solid-svg-icons';
import { routeService } from '../../services/routeService';
import { studentService } from '../../services/studentService';

const ClassEnrollmentModule = () => {
    const [routeData, setRouteData] = useState([]);
    const [loading, setLoading] = useState(true);

    const colorVariants = [
        { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600', male: 'text-indigo-500', female: 'text-indigo-400' },
        { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', male: 'text-emerald-500', female: 'text-emerald-400' },
        { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', male: 'text-blue-500', female: 'text-blue-400' },
        { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', male: 'text-amber-500', female: 'text-amber-400' },
        { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-600', male: 'text-violet-500', female: 'text-violet-400' },
        { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600', male: 'text-rose-500', female: 'text-rose-400' },
        { bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-600', male: 'text-cyan-500', female: 'text-cyan-400' },
        { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-600', male: 'text-pink-500', female: 'text-pink-400' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [routes, students] = await Promise.all([
                    routeService.getAllRoutes(),
                    studentService.getAllStudents()
                ]);
                
                // Process data: Group students by route and gender for ACTIVE routes only
                const formattedData = routes
                    .filter(route => (route.routes_active_status || '').toUpperCase() === 'ACTIVE')
                    .map(route => {
                        const routeStudents = students.filter(s => s.pickup_route_id === route.route_id);
                        const maleCount = routeStudents.filter(s => (s.gender || '').toUpperCase() === 'MALE').length;
                        const femaleCount = routeStudents.filter(s => (s.gender || '').toUpperCase() === 'FEMALE').length;
                        
                        return {
                            id: route.route_id,
                            name: route.name || route.route_name,
                            total: routeStudents.length,
                            male: maleCount,
                            female: femaleCount
                        };
                    }); 

                setRouteData(formattedData);
            } catch (error) {
                console.error("Error fetching route enrollment:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1 min-h-[300px] sm:min-h-[350px] lg:h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10 shrink-0">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800">Routes</h3>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-inner">
                    <FontAwesomeIcon icon={faBus} className="text-lg sm:text-xl" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar relative z-10 min-h-0">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                         <div className="h-8 w-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : routeData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                        <FontAwesomeIcon icon={faRoute} className="text-3xl sm:text-4xl mb-3 opacity-50" />
                        <p className="text-sm font-bold">No Route Data</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-2">
                        {routeData.map((item, index) => {
                            const theme = colorVariants[index % colorVariants.length];
                            return (
                                <div key={index} className={`relative overflow-hidden rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 border ${theme.bg} ${theme.border} transition-all duration-300 hover:shadow-md group/card`}>
                                    {/* Decorative Icon Watermark - Smaller */}
                                    <FontAwesomeIcon 
                                        icon={faBus} 
                                        className={`absolute -bottom-1 -right-1 text-2xl sm:text-3xl opacity-5 transform -rotate-12 group-hover/card:scale-110 transition-transform ${theme.text}`} 
                                    />
                                    
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="mb-2 sm:mb-2.5">
                                            <span className={`text-[11px] sm:text-[13px] font-extrabold leading-tight block truncate ${theme.text}`}>{item.name || 'Unnamed'}</span>
                                        </div>
                                        
                                        <div className="pt-1.5 sm:pt-2 flex items-center gap-1 sm:gap-1.5 border-t border-black/5 mt-auto">
                                            <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md sm:rounded-lg bg-blue-100/80 flex items-center justify-center text-blue-600 text-[8px] sm:text-[10px]">
                                                    <FontAwesomeIcon icon={faMars} />
                                                </div>
                                                <span className="text-[10px] sm:text-[12px] font-black text-slate-700 leading-none">{item.male}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md sm:rounded-lg bg-rose-100/80 flex items-center justify-center text-rose-600 text-[8px] sm:text-[10px]">
                                                    <FontAwesomeIcon icon={faVenus} />
                                                </div>
                                                <span className="text-[10px] sm:text-[12px] font-black text-slate-700 leading-none">{item.female}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .custom-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>

            {/* Decorative Background */}
            <div className="absolute -bottom-8 -left-8 w-28 sm:w-40 h-28 sm:h-40 bg-indigo-50/50 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none"></div>
        </div>
    );
};

export default ClassEnrollmentModule;
