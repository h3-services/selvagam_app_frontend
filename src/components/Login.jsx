import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { COLORS } from '../constants/colors';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore, if not create basic profile
      const userRef = doc(db, 'schools', 'hope3-school', 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user document (Optional: restrict this if you only want pre-approved emails)
        await setDoc(userRef, {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          role: 'admin', // Default role, change as needed
          createdAt: serverTimestamp()
        });
      }

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
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

          <form onSubmit={handleEmailLogin} className="space-y-3 sm:space-y-4 mb-6">
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 bg-white border-2 rounded-xl font-bold shadow-sm hover:shadow-md hover:bg-purple-50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            style={{
              borderColor: COLORS.SIDEBAR_BG,
              color: COLORS.SIDEBAR_BG
            }}
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                <FontAwesomeIcon icon={faGoogle} className="text-xl" />
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">By signing in, you agree to our Terms and Privacy Policy.</p>
          </div>

          {/* Sign Up Link Removed */}
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
