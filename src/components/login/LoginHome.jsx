import LoginForm from './LoginForm';
import LoginBanner from './LoginBanner';

const LoginHome = () => {
    return (
        <div className="h-screen flex overflow-hidden">
            <LoginForm />
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
