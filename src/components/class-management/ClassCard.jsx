import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faUsers } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';

const ClassCard = ({ classData, onRefresh, allClasses = [] }) => {
    const navigate = useNavigate();
    const isActive = classData.status === 'ACTIVE';

    // Detect next class for promotion path
    const nextClass = allClasses.find(c => {
        const currentGrade = parseInt(classData.class_name);
        const targetGrade = parseInt(c.class_name);
        return !isNaN(currentGrade) && !isNaN(targetGrade) && 
               targetGrade === currentGrade + 1 && 
               c.section === classData.section;
    });

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="group relative bg-white rounded-[2rem] px-6 py-5 border border-slate-200 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_45px_100px_-25px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-blue-500/10">
            
            {/* Minimalist Vertical Bar Decoration */}
            <div className={`absolute left-0 top-[25%] bottom-[25%] w-1 rounded-r-full transition-all duration-500 ${isActive ? 'bg-blue-600' : 'bg-slate-200'} group-hover:h-[40%]`} />

            <div className="flex flex-col h-full pl-3">
                
                {/* Visual Label */}
                <div className="mb-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1.5 transition-colors group-hover:text-blue-600">
                        Academic Unit
                    </p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                        {classData.class_name.toLowerCase().startsWith('grade') ? '' : 'Grade '}{classData.class_name}
                    </h3>
                </div>

                {/* Primary Data Points */}
                <div className="grid grid-cols-1 mb-4">
                    <div>
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Section</p>
                        <p className="text-sm font-black text-slate-800 tracking-tight">{classData.section}</p>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2 mb-4">
                    <button 
                        onClick={() => handleNavigate('/students')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
                    >
                        <FontAwesomeIcon icon={faUserGraduate} className="text-[10px]" />
                        Students
                    </button>
                    <button 
                        onClick={() => handleNavigate('/parents')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
                    >
                        <FontAwesomeIcon icon={faUsers} className="text-[10px]" />
                        Parents
                    </button>
                </div>

                {/* Promotion Strategy */}
                <div className="mt-auto">
                    {nextClass && (
                        <div className="inline-flex items-center gap-4 py-2 px-1 group/link cursor-pointer">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 group-hover/link:text-blue-500 transition-colors">Target Pipeline</span>
                                <span className="text-[12px] font-black text-slate-900">Class {nextClass.class_name}-{nextClass.section}</span>
                            </div>
                            <div className="w-6 h-[2px] bg-slate-100 group-hover/link:w-10 group-hover/link:bg-blue-600 transition-all duration-500" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassCard;
