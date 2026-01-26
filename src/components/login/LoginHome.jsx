import LoginForm from './LoginForm';
import LoginBanner from './LoginBanner';

const LoginHome = () => {
    return (
        <div className="h-screen flex bg-white overflow-hidden">
            <LoginForm />
            <LoginBanner />

            {/* CSS for custom animations that Tailwind might not have by default */}
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
            .animate-float { animation: float 6s ease-in-out infinite; }
            .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
            .animate-float-delayed { animation: float 7s ease-in-out infinite 2s; }
            .animate-float-slow-delayed { animation: float-slow 9s ease-in-out infinite 1s; }
        `
            }} />
        </div>
    );
};

export default LoginHome;
