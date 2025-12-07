import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const usersRef = collection(db, 'schools', 'hope3-school', 'users');
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setError('No account found with this email.');
        setLoading(false);
        return;
      }
      
      const userData = snapshot.docs[0].data();
      
      if (userData.password !== password) {
        setError('Incorrect password.');
        setLoading(false);
        return;
      }
      
      console.log('User Role:', userData.roll);
      console.log('User Name:', userData.name);
      console.log('User Email:', userData.email);
      
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
              <FontAwesomeIcon icon={faUserShield} className="text-white text-4xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">Welcome Back</h1>
            <p className="text-sm sm:text-base text-gray-500">Sign in to your admin account</p>
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-purple-400 focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-purple-400 focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: COLORS.SIDEBAR_BG }} />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="font-medium hover:underline" style={{ color: COLORS.SIDEBAR_BG }}>Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
              style={{ backgroundColor: COLORS.SIDEBAR_BG }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
            Don't have an account? <button onClick={() => navigate('/signup')} className="font-semibold hover:underline" style={{ color: COLORS.SIDEBAR_BG }}>Sign Up</button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-white">
        <div className="text-center max-w-lg">
          <img 
            src="https://img.freepik.com/free-vector/admin-concept-illustration_114360-2139.jpg" 
            alt="Admin Portal" 
            className="w-full max-w-md mx-auto mb-8 rounded-2xl"
          />
          <h2 className="text-4xl font-bold mb-4" style={{ color: COLORS.SIDEBAR_BG }}>Admin Portal</h2>
          <p className="text-lg text-gray-600 leading-relaxed">Manage parent access, track student information, and oversee all administrative tasks in one place.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
