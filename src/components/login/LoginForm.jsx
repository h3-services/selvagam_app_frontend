import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faLock, faUserShield, faArrowRight, faBolt } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../../constants/colors';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Logo from '../../assets/Logo.png';

const LoginForm = () => {
    const navigate = useNavigate();
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const usersRef = collection(db, 'schools', 'hope3-school', 'users');
            const q = query(usersRef, where('mobile', '==', mobile));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setError('No account found with this mobile number.');
                setLoading(false);
                return;
            }

            const userData = snapshot.docs[0].data();

            if (userData.password !== password) {
                setError('Incorrect password.');
                setLoading(false);
                return;
            }

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAccess = () => {
        navigate('/dashboard');
    };

    return (
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 sm:p-10 max-w-md w-full border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-[2.5rem] flex items-center justify-center shadow-xl transition-transform hover:scale-105 duration-300 bg-white p-3 border border-gray-100">
                        <img src={Logo} alt="Selvagam Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 tracking-tight">Welcome Back</h1>
                    <p className="text-sm sm:text-base text-gray-400 font-bold uppercase tracking-[1px]" style={{ fontFamily: "'Outfit', sans-serif" }}>Sign in to <span className="text-purple-600">Selvagam</span> Portal</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Mobile Number</label>
                        <div className="relative group">
                            <FontAwesomeIcon icon={faPhone} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="Enter mobile number"
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm focus:border-purple-200 focus:bg-white focus:outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                        <div className="relative group">
                            <FontAwesomeIcon icon={faLock} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm focus:border-purple-200 focus:bg-white focus:outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="button" className="text-xs font-bold text-purple-600 hover:underline">
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 text-white rounded-2xl font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                        style={{ backgroundColor: COLORS.SIDEBAR_BG }}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <FontAwesomeIcon icon={faArrowRight} className="text-sm group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-gray-300">
                        <span className="px-4 bg-white">Or Quick Access</span>
                    </div>
                </div>

                <button
                    onClick={handleQuickAccess}
                    className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl font-bold border-2 border-transparent hover:border-gray-200 transition-all flex items-center justify-center gap-3 group"
                >
                    <FontAwesomeIcon icon={faBolt} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                    <span>Quick Login Bypass</span>
                </button>
            </div>
        </div>
    );
};

export default LoginForm;
