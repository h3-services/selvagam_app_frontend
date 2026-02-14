import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheckCircle, faClock, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const TripStatusBadge = ({ status }) => {
    let colorClass = 'bg-gray-100 text-gray-600';
    let icon = faSpinner;

    if (status === 'Completed') {
        colorClass = 'bg-green-100 text-green-700 border-green-200';
        icon = faCheckCircle;
    } else if (status === 'In Progress') {
        colorClass = 'bg-blue-100 text-blue-700 border-blue-200';
        icon = faSpinner; // Or a moving icon
    } else if (status === 'Scheduled') {
        colorClass = 'bg-blue-100 text-blue-700 border-purple-200';
        icon = faClock;
    } else if (status === 'Cancelled') {
        colorClass = 'bg-red-100 text-red-700 border-red-200';
        icon = faTimesCircle;
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 w-fit ${colorClass}`}>
            <FontAwesomeIcon icon={icon} className={status === 'In Progress' ? 'animate-spin' : ''} />
            {status}
        </span>
    );
};

export default TripStatusBadge;
