import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, 
    faCircle, 
    faEllipsisH, 
    faArrowRight,
    faClock,
    faArrowUpRightDots,
    faLayerGroup,
    faFingerprint
} from '@fortawesome/free-solid-svg-icons';

const ClassCard = ({ classData, onRefresh, allClasses = [] }) => {
    const isActive = classData.status === 'ACTIVE';

    // Automatically detect next class
    const nextClass = allClasses.find(c => {
        const currentGrade = parseInt(classData.class_name);
        const targetGrade = parseInt(c.class_name);
        return !isNaN(currentGrade) && !isNaN(targetGrade) && 
               targetGrade === currentGrade + 1 && 
               c.section === classData.section;
    });

    return (
        <div className="group relative bg-white rounded-[38px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 hover:-translate-y-3 overflow-hidden">
            {/* Unique Abstract Background Graphic */}
            <div className={`absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 ${isActive ? 'bg-indigo-600 rotate-12' : 'bg-slate-600'}`}></div>
            <div className={`absolute -left-10 -bottom-10 w-32 h-32 rounded-full opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700 ${isActive ? 'bg-indigo-400 -rotate-12 scale-150' : 'bg-slate-400'}`}></div>

            <div className="relative flex flex-col h-full z-10">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-8">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-2xl font-bold shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${isActive ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                        {classData.class_name}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-4 ring-emerald-50/50' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                            {classData.status}
                        </div>
                        <div className="text-[9px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg">
                            <FontAwesomeIcon icon={faFingerprint} className="text-xs" />
                            ID: {classData.class_id ? classData.class_id.substring(0, 6) : 'NEW'}
                        </div>
                    </div>
                </div>

                {/* Info Content */}
                <div className="flex-1 space-y-6">
                    <div>
                        <h3 className="text-[26px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight tracking-tight">
                            Grade {classData.class_name} <span className="text-slate-300 mx-1">/</span> <span className="text-indigo-600/70">{classData.section}</span>
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="px-2.5 py-1 bg-slate-100 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faLayerGroup} className="text-[8px]" />
                                Division Unit
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50/80 rounded-[28px] p-5 border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-all duration-500">
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Timeline</p>
                             <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500 text-xs" />
                                <span className="text-sm font-bold text-slate-700">{classData.academic_year}</span>
                             </div>
                        </div>
                        <div className="bg-slate-50/80 rounded-[28px] p-5 border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-all duration-500">
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Last Sync</p>
                             <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faClock} className="text-indigo-500 text-xs" />
                                <span className="text-sm font-bold text-slate-700">{new Date(classData.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                             </div>
                        </div>
                    </div>

                    {nextClass && (
                        <div className="mt-6 p-5 bg-indigo-600 rounded-[30px] shadow-xl shadow-indigo-100 flex items-center justify-between group/path hover:scale-[1.02] transition-transform duration-300 cursor-help">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                    <FontAwesomeIcon icon={faArrowUpRightDots} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider opacity-70 mb-0.5">Next Evolution</p>
                                    <p className="text-sm font-bold text-white">Grade {nextClass.class_name}-{nextClass.section}</p>
                                </div>
                            </div>
                            <FontAwesomeIcon icon={faArrowRight} className="text-indigo-200 group-hover/path:translate-x-1 transition-transform" />
                        </div>
                    )}
                </div>

                {/* Interactive Footer */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between group-hover:opacity-100 transition-all duration-500">
                    <button className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-wider hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2">
                        Unit Config <FontAwesomeIcon icon={faArrowRight} className="text-[8px]" />
                    </button>
                    <button className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all duration-300 border border-slate-100">
                        <FontAwesomeIcon icon={faEllipsisH} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassCard;
