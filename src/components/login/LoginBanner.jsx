import { COLORS } from '../../constants/colors';
import Logo from '../../assets/Logo.png';

const LoginBanner = () => {
    return (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden h-full" style={{ background: `linear-gradient(135deg, ${COLORS.SIDEBAR_BG} 0%, #1e3a8a 50%, #0f172a 100%)` }}>
            {/* Animated Gradient Orbs */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] animate-float"></div>
                <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[100px] animate-float-slow"></div>
                <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-sky-400/10 rounded-full blur-[80px] animate-float-delayed"></div>
            </div>

            {/* Dot Grid */}
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
                {/* Logo Card */}
                <div className="relative group mb-10">
                    <div className="absolute -inset-4 bg-white/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                    <div className="relative w-48 h-48 bg-white/10 backdrop-blur-xl rounded-[3rem] border border-white/20 shadow-2xl flex items-center justify-center p-6 group-hover:scale-105 transition-all duration-700">
                        <img
                            src={Logo}
                            alt="Selvagam Logo"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* Title */}
                <div className="text-center space-y-5">
                    <h2 className="text-4xl font-black text-white tracking-[4px] uppercase leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Selvagam<br />Santhanalakshmi<br />Noble School
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-1 bg-white/40 rounded-full"></div>
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
                        <div className="w-12 h-1 bg-white/40 rounded-full"></div>
                    </div>
                    <p className="text-white/50 text-[11px] font-bold uppercase tracking-[0.4em]">
                        Tirukalikundram
                    </p>
                </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
    );
};

export default LoginBanner;
