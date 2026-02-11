import ClassCard from './ClassCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';

const ClassList = ({ classes, onRefresh }) => {
    if (classes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100 italic">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                    <FontAwesomeIcon icon={faInbox} className="text-3xl" />
                </div>
                <p className="text-gray-400 font-bold">No classes found matching your criteria</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {classes.map((c) => (
                <ClassCard 
                    key={c.class_id} 
                    classData={c} 
                    onRefresh={onRefresh}
                    allClasses={classes}
                />
            ))}
        </div>
    );
};

export default ClassList;
