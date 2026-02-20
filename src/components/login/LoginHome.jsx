import LoginForm from './LoginForm';
import LoginBanner from './LoginBanner';
import { COLORS } from '../../constants/colors';
import Logo from '../../assets/Logo.png';

const LoginHome = () => {
    return (
        <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row overflow-hidden">
            {/* Mobile/Tablet Header Branding - visible below lg */}
            <div 
                className="lg:hidden relative overflow-hidden px-6 py-8 sm:py-10 flex flex-col items-center justify-center shrink-0"
                style={{ background: `linear-gradient(135deg, ${COLORS.SIDEBAR_BG} 0%, #1e3a8a 50%, #0f172a 100%)` }}
            >
                {/* Animated Orbs */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-30%] right-[-20%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-blue-400/20 rounded-full blur-[80px] animate-float"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-indigo-500/15 rounded-full blur-[60px] animate-float-slow"></div>
                </div>

                {/* Dot Grid */}
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-5">
                    {/* Logo */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-xl flex items-center justify-center p-3 sm:p-4">
                        <img src={Logo} alt="Selvagam Logo" className="w-full h-full object-contain drop-shadow-xl" />
                    </div>

                    {/* Title */}
                    <div className="text-center">
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-[3px] sm:tracking-[4px] uppercase leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Selvagam Santhanalakshmi<br />Noble School
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-3">
                            <div className="w-8 h-0.5 bg-white/30 rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></div>
                            <div className="w-8 h-0.5 bg-white/30 rounded-full"></div>
                        </div>
                        <p className="text-white/40 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
                            Tirukalikundram
                        </p>
                    </div>
                </div>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* Desktop Banner - hidden below lg */}
            <LoginBanner />

            <style dangerouslySetInnerHTML={{
                __html: `
            @keyframes float {
                0%, 100% { transform: translateY(0) rotate(0); }
                50% { transform: translateY(-20px) rotate(2deg); }
            }
            @keyframes float-slow {
                0%, 100% { transform: translateY(0) rotate(0); }
                50% { transform: translateY(-12px) rotate(-1deg); }
            }
            @keyframes float-delayed {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
            }
            .animate-float { animation: float 6s ease-in-out infinite; }
            .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
            .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 2s; }
        `
            }} />
        </div>
    );
};

export default LoginHome;
