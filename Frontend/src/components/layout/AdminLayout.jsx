import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import Auth Context
import Sidebar from '../common/Sidebar';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MessageSquare, 
  MapPin,
  Pen,
  LogOut,
  Loader2
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout } = useAuth(); // 2. Get auth state

  // 3. SECURITY CHECK: Redirect if not logged in
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Mobile Bottom Nav Items
  const mobileNavItems = [
    { name: 'Dash', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'All', path: '/admin/viewplaces', icon: MapPin },
    { name: 'Add', path: '/admin/add', icon: PlusCircle }, 
    { name: 'Inbox', path: '/admin/submissions', icon: Pen },
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
  ];

  const handleLogout = () => {
    if(window.confirm("Logout?")) {
      logout(); // Clear context state
      navigate('/admin/login');
    }
  };

  // 4. Show loading spinner while checking token to prevent flashing protected content
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-darkblue-600)]" />
      </div>
    );
  }

  // If not authenticated, return null (useEffect will handle redirect)
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[var(--color-sapling-200)] bg-[var(--color-bg-surface)]">
        <Sidebar />
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* ── MOBILE TOP HEADER ── */}
        <header className="md:hidden bg-[var(--color-bg-surface)] border-b border-[var(--color-sapling-200)] h-14 flex justify-between items-center px-4 z-20">
          <div className="flex items-center gap-2">
             <div className="w-7 h-7 bg-[var(--color-darkblue-600)] text-[var(--color-sapling-300)] rounded-lg flex items-center justify-center shadow-md">
              <MapPin className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-base font-serif font-bold text-[var(--color-darkblue-900)]">Curator.</span>
          </div>
          <button onClick={handleLogout} className="text-[var(--color-darkblue-400)] hover:text-red-500">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* ── SCROLLABLE CONTENT ── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
             <Outlet />
          </div>
        </main>

        {/* ── MOBILE BOTTOM NAVIGATION ── */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[var(--color-sapling-200)] h-16 flex items-center justify-around z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center w-full h-full gap-1 transition-colors
                ${isActive 
                  ? 'text-[var(--color-darkblue-600)]' 
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-darkblue-800)]'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className={isActive ? 'transform scale-110 transition-transform duration-200' : ''}>
                    <item.icon className={`w-5 h-5 ${item.name === 'Add' ? 'text-[var(--color-darkblue-600)] fill-current' : ''}`} />
                  </div>
                  <span className="text-[9px] font-bold tracking-wide">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
      </div>
    </div>
  );
};

export default AdminLayout;