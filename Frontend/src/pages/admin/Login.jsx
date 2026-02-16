import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Lock, Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { PrimaryButton } from '../../components/common/Buttons';
import { toast } from 'react-toastify'; 
// 1. Import Auth Context
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth(); // Use context function
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // 2. Redirect if already logged in (Prevent accessing login page)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 3. Use the Context login function (Handles API + State Update)
    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success("Welcome back! Login successful. 🚀");
      navigate('/admin/dashboard');
    } else {
      toast.error(result.message);
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-surface)] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-3 text-[var(--color-darkblue-600)] hover:text-[var(--color-darkblue-900)] transition-all z-20 group"
      >
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-[var(--color-sapling-200)] flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <span className="text-sm font-bold hidden md:block opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity">
          Back to Home
        </span>
      </Link>

      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[var(--color-sapling-300)] rounded-full blur-[80px] md:blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-[var(--color-darkblue-200)] rounded-full blur-[80px] md:blur-[100px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-[320px] md:max-w-md relative z-10">
        
        <div className="mb-6 md:mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[var(--color-darkblue-600)] rounded-xl md:rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-[var(--color-darkblue-600)]/20">
            <MapPin className="w-6 h-6 md:w-8 md:h-8 fill-current" />
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-[var(--color-darkblue-900)] tracking-tight">
            Curator Portal
          </h1>
          <p className="text-xs md:text-sm text-[var(--color-text-muted)] mt-1 font-medium">
            Authorized personnel only.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl md:rounded-[2.5rem] shadow-2xl p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--color-sapling-400)] via-[var(--color-darkblue-500)] to-[var(--color-sapling-400)]"></div>

            <form onSubmit={handleLogin} className="space-y-4 md:space-y-6 mt-2">
            
            <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-bold text-[var(--color-darkblue-800)] ml-1 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-darkblue-600)] transition-colors" />
                  </div>
                  <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="admin@underrated.com"
                      className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-sapling-200)] text-[var(--color-darkblue-900)] rounded-xl pl-10 md:pl-12 pr-4 py-3 text-sm font-medium placeholder:text-[var(--color-darkblue-200)] focus:ring-2 focus:ring-[var(--color-sapling-300)] focus:border-transparent outline-none transition-all shadow-inner" 
                  />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-bold text-[var(--color-darkblue-800)] ml-1 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-darkblue-600)] transition-colors" />
                  </div>
                  <input 
                      type="password" 
                      name="password" 
                      required 
                      value={formData.password} 
                      onChange={handleChange} 
                      placeholder="••••••••"
                      className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-sapling-200)] text-[var(--color-darkblue-900)] rounded-xl pl-10 md:pl-12 pr-4 py-3 text-sm font-medium placeholder:text-[var(--color-darkblue-200)] focus:ring-2 focus:ring-[var(--color-sapling-300)] focus:border-transparent outline-none transition-all shadow-inner" 
                  />
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center justify-center text-center animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
            )}

            <div className="pt-2">
                <PrimaryButton 
                  type="submit" 
                  className="w-full flex justify-center items-center gap-2 py-3.5 md:py-4 text-sm md:text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 bg-[var(--color-darkblue-600)] hover:bg-[var(--color-darkblue-700)] border-none text-white" 
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Dashboard'}
                  {!loading && <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
                </PrimaryButton>
            </div>
            </form>
        </div>

        <p className="mt-8 text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest text-center opacity-60">
            © Underrated Inc. Secure System
        </p>
      </div>
    </div>
  );
};

export default Login;