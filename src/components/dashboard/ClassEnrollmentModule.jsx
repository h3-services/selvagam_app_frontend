import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSchool, faUserGraduate, faChalkboardTeacher, faUsers, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { classService } from '../../services/classService';

const ClassEnrollmentModule = () => {
    const [classData, setClassData] = useState([]);
    const [loading, setLoading] = useState(true);

    const colorVariants = [
        { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600', subText: 'text-indigo-400' },
        { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-600', subText: 'text-pink-400' },
        { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', subText: 'text-emerald-400' },
        { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', subText: 'text-amber-400' },
        { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', subText: 'text-blue-400' },
        { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-600', subText: 'text-violet-400' },
        { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600', subText: 'text-rose-400' },
        { bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-600', subText: 'text-cyan-400' },
    ];

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const classes = await classService.getAllClasses();
                
                // Group classes by name (e.g. "9") and sum students across sections
                const grouped = classes.reduce((acc, curr) => {
                    const name = curr.class_name;
                    if (!acc[name]) {
                        acc[name] = 0;
                    }
                    acc[name] += (curr.number_of_students || 0);
                    return acc;
                }, {});

                // Convert to array and sort numerically
                const formattedData = Object.entries(grouped)
                    .map(([name, count]) => ({
                        name: `Class ${name}`,
                        count: count,
                        originalName: name // for sorting
                    }))
                    .sort((a, b) => {
                        // Numeric sort for clean ordering (e.g. 1, 2, 9, 10 instead of 1, 10, 2)
                        const numA = parseInt(a.originalName) || 0;
                        const numB = parseInt(b.originalName) || 0;
                        return numA - numB;
                    });

                setClassData(formattedData);
            } catch (error) {
                console.error("Error fetching class enrollment:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClassData();
    }, []);

    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6 relative z-10 shrink-0">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Enrollment by Class</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Student Distribution</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <FontAwesomeIcon icon={faSchool} className="text-xl" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10 min-h-0">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                         <div className="h-8 w-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : classData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                        <FontAwesomeIcon icon={faChalkboardTeacher} className="text-4xl mb-3 opacity-50" />
                        <p className="text-sm font-bold">No Class Data</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {classData.map((item, index) => {
                            const theme = colorVariants[index % colorVariants.length];
                            return (
                                <div key={index} className={`relative overflow-hidden rounded-2xl p-4 border ${theme.bg} ${theme.border} transition-all duration-300 hover:shadow-md group/card`}>
                                    {/* Decorative Icon Watermark */}
                                    <FontAwesomeIcon 
                                        icon={faLayerGroup} 
                                        className={`absolute -bottom-2 -right-2 text-4xl opacity-10 transform -rotate-12 group-hover/card:scale-110 transition-transform ${theme.text}`} 
                                    />
                                    
                                    <div className="relative z-10 flex flex-col items-start h-full justify-between">
                                        <div className="w-full">
                                            <span className={`text-[10px] font-black uppercase tracking-wider opacity-70 block mb-0.5 ${theme.text}`}>Class</span>
                                            <span className={`text-2xl font-black leading-none ${theme.text}`}>{item.originalName}</span>
                                        </div>
                                        
                                        <div className={`mt-3 flex items-center gap-1.5 text-xs font-bold ${theme.text} bg-white/60 px-2 py-1 rounded-lg backdrop-blur-sm self-start`}>
                                            <FontAwesomeIcon icon={faUsers} className="text-[10px] opacity-80" />
                                            <span>{item.count}</span>
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
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 4px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                }
            `}</style>

            {/* Decorative Background */}
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-50/50 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none"></div>
        </div>
    );
};

export default ClassEnrollmentModule;
