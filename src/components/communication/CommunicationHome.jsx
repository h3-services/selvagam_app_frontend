import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroadcastTower, faUsers } from '@fortawesome/free-solid-svg-icons';
import ComposeMessage from './ComposeMessage';

const CommunicationHome = () => {
    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-3 sticky top-0 z-30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className='ml-20 lg:ml-0'>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Communication Hub
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-blue-50/50 px-5 py-2.5 rounded-xl border border-indigo-100/50 shadow-sm transition-all hover:bg-white hover:border-indigo-200 group">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm border border-blue-50 group-hover:scale-110 transition-transform">
                                <FontAwesomeIcon icon={faUsers} className="text-sm" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-0.5">Recipient Group</p>
                                <p className="text-sm font-bold text-gray-800">All Registered Parents</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 px-4 lg:px-8 pt-4 pb-8 overflow-y-auto custom-scrollbar shadow-inner">
                <div className="max-w-6xl mx-auto">
                    <ComposeMessage />
                </div>
            </div>
        </div>
    );
};

export default CommunicationHome;
