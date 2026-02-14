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

    // Detect next class for promotion path
    const nextClass = allClasses.find(c => {
        const currentGrade = parseInt(classData.class_name);
        const targetGrade = parseInt(c.class_name);
        return !isNaN(currentGrade) && !isNaN(targetGrade) && 
               targetGrade === currentGrade + 1 && 
               c.section === classData.section;
    });

    return (
        <div className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
            <div className="flex flex-col h-full">
                {/* Header: Grade & Status */}
                <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm transition-transform duration-300 group-hover:scale-105 ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {classData.class_name}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                            isActive
                                ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'
                                : 'bg-amber-50 text-amber-600 ring-1 ring-amber-100'
                        }`}>
                            {classData.status || 'Inactive'}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                            ID: {classData.class_id?.substring(0, 6)}
                        </span>
                    </div>
                </div>

                {/* Main Info */}
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Grade {classData.class_name} - {classData.section}
                    </h3>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faLayerGroup} className="text-[8px] opacity-70" />
                            Academic Unit
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 transition-colors group-hover:bg-white">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Academic Year</p>
                            <div className="flex items-center gap-2 text-gray-700">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 text-[10px]" />
                                <span className="text-sm font-bold">{classData.academic_year}</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 transition-colors group-hover:bg-white">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Updated</p>
                            <div className="flex items-center gap-2 text-gray-700">
                                <FontAwesomeIcon icon={faClock} className="text-blue-500 text-[10px]" />
                                <span className="text-sm font-bold">{new Date(classData.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    {nextClass && (
                        <div className="p-4 bg-blue-50 rounded-2xl border border-indigo-100 flex items-center justify-between group/next transition-all hover:bg-blue-600 hover:border-blue-600 hover:shadow-lg hover:shadow-indigo-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-blue-50 transition-colors group-hover/next:bg-white/20 group-hover/next:text-white group-hover/next:border-transparent">
                                    <FontAwesomeIcon icon={faArrowUpRightDots} className="text-xs" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1 group-hover/next:text-indigo-100">Promotion Path</p>
                                    <p className="text-xs font-bold text-gray-800 group-hover/next:text-white">To Grade {nextClass.class_name}-{nextClass.section}</p>
                                </div>
                            </div>
                            <FontAwesomeIcon icon={faArrowRight} className="text-indigo-300 text-[10px] group-hover/next:translate-x-1 transition-transform group-hover/next:text-white" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassCard;
