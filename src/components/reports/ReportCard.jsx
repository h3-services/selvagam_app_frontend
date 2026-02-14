import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const ReportCard = ({ report }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group cursor-pointer relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <FontAwesomeIcon icon={faChartPie} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${report.status === 'Generated' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                    {report.status}
                </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{report.name}</h3>
            <p className="text-sm text-gray-500 font-medium mb-4">{report.type} Report</p>

            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Date</span>
                    <span className="font-semibold text-gray-700">{report.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Size</span>
                    <span className="font-semibold text-gray-700">{report.size}</span>
                </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-50">
                <button className="flex-1 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faFileExcel} /> Excel
                </button>
                <button className="flex-1 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faFilePdf} /> PDF
                </button>
            </div>
        </div>
    );
};

export default ReportCard;
