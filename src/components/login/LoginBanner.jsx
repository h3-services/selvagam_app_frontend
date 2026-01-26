import { COLORS } from '../../constants/colors';

const LoginBanner = () => {
    return (
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-gray-50/50 relative overflow-hidden h-full">
            {/* Abstract Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-purple-100/50 to-transparent rounded-full blur-[120px] -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full blur-[100px] -ml-20 -mb-20"></div>
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#40189d 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
            </div>

            <div className="text-center max-w-2xl relative z-10 w-full px-4 flex flex-col items-center justify-center h-full py-8">
                {/* Main Center Card (Campus/System) */}
                <div className="relative z-20 group mb-8">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl border border-white/50 overflow-hidden transform group-hover:scale-[1.01] transition-transform duration-700">
                        <img
                            src="https://img.freepik.com/free-vector/learning-concept-illustration_114360-3896.jpg"
                            alt="School Management"
                            className="w-full h-auto max-h-[45vh] object-contain rounded-[2.5rem]"
                        />
                    </div>
                </div>

                <div className="space-y-4 shrink-0">
                    <h2 className="text-4xl lg:text-3xl xl:text-5xl font-black tracking-tight leading-none" style={{ color: COLORS.SIDEBAR_BG }}>
                        School Management System
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-16 h-1.5 bg-purple-600 rounded-full"></div>
                        <div className="w-3 h-1.5 bg-purple-300 rounded-full"></div>
                        <div className="w-3 h-1.5 bg-purple-100 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginBanner;
