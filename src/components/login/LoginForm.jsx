import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faLock, faArrowRight, faBolt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
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
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

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
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-16 h-full overflow-y-auto bg-slate-50">
            <div className="max-w-[420px] w-full">
                {/* Mobile Logo - Only on small screens */}
                <div className="flex items-center justify-center mb-8 lg:hidden">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 bg-white p-3">
                        <img src={Logo} alt="Selvagam Logo" className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.SIDEBAR_BG }}></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Admin Portal</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-slate-400 font-medium">
                        Sign in to your <span className="font-bold" style={{ color: COLORS.SIDEBAR_BG }}>Selvagam</span> account
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 px-4 py-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                        </div>
                        <p className="text-rose-600 text-xs font-bold">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Mobile Input */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Mobile Number</label>
                        <div className={`relative flex items-center bg-white rounded-2xl border-2 transition-all duration-500 ${
                            focusedField === 'mobile' 
                                ? 'border-blue-500 shadow-lg shadow-blue-500/10' 
                                : 'border-slate-100 hover:border-slate-200'
                        }`}>
                            <div className={`w-14 h-14 flex items-center justify-center pointer-events-none transition-all duration-500 ${
                                focusedField === 'mobile' ? 'text-blue-600 scale-110' : 'text-slate-300'
                            }`}>
                                <FontAwesomeIcon icon={faPhone} className="text-sm" />
                            </div>
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                onFocus={() => setFocusedField('mobile')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="Enter mobile number"
                                className="w-full pr-5 py-4 bg-transparent rounded-2xl text-sm font-bold text-slate-700 placeholder-slate-300 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Password</label>
                        <div className={`relative flex items-center bg-white rounded-2xl border-2 transition-all duration-500 ${
                            focusedField === 'password' 
                                ? 'border-blue-500 shadow-lg shadow-blue-500/10' 
                                : 'border-slate-100 hover:border-slate-200'
                        }`}>
                            <div className={`w-14 h-14 flex items-center justify-center pointer-events-none transition-all duration-500 ${
                                focusedField === 'password' ? 'text-blue-600 scale-110' : 'text-slate-300'
                            }`}>
                                <FontAwesomeIcon icon={faLock} className="text-sm" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="Enter your password"
                                className="w-full pr-14 py-4 bg-transparent rounded-2xl text-sm font-bold text-slate-700 placeholder-slate-300 focus:outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xs" />
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                        <button type="button" className="text-[11px] font-bold text-slate-400 hover:text-blue-600 transition-colors">
                            Forgot password?
                        </button>
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 group relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${COLORS.SIDEBAR_BG} 0%, #1e3a8a 100%)` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
                                    <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-4 bg-slate-50 text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">or</span>
                    </div>
                </div>

                {/* Quick Access */}
                <button
                    onClick={handleQuickAccess}
                    className="w-full h-14 bg-white hover:bg-slate-900 text-slate-600 hover:text-white rounded-2xl font-bold text-sm border-2 border-slate-100 hover:border-slate-900 transition-all duration-500 flex items-center justify-center gap-3 group active:scale-95"
                >
                    <FontAwesomeIcon icon={faBolt} className="text-amber-500 group-hover:text-amber-400 group-hover:scale-125 transition-all duration-500" />
                    <span className="tracking-wide">Quick Access</span>
                </button>

                {/* Footer */}
                <p className="text-center mt-8 text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                    Selvagam Santhanalakshmi Noble School
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
