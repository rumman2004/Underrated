import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MessageSquare, 
  MapPin,
  Pen,
  LogOut
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  // Mobile Bottom Nav Items (Icons only for compactness)
  const mobileNavItems = [
    { name: 'Dash', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'All', path: '/admin/viewplaces', icon: MapPin },
    { name: 'Add', path: '/admin/add', icon: PlusCircle }, // Center Action
    { name: 'Inbox', path: '/admin/submissions', icon: Pen },
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
  ];

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
        // Remove token if you have one
        // localStorage.removeItem('adminToken');
        navigate('/admin/login');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* ── DESKTOP SIDEBAR (Hidden on Mobile) ── */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[var(--color-sapling-200)] bg-[var(--color-bg-surface)]">
        <Sidebar />
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* ── MOBILE TOP HEADER (Hidden on Desktop) ── */}
        <header className="md:hidden bg-[var(--color-bg-surface)] border-b border-[var(--color-sapling-200)] h-16 flex justify-between items-center px-4 z-20">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-[var(--color-darkblue-600)] text-[var(--color-sapling-300)] rounded-lg flex items-center justify-center shadow-md">
              <MapPin className="w-4 h-4 fill-current" />
            </div>
            <span className="text-lg font-serif font-bold text-[var(--color-darkblue-900)]">Curator.</span>
          </div>
          <button onClick={handleLogout} className="text-[var(--color-darkblue-400)] hover:text-red-500 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* ── SCROLLABLE CONTENT ── */}
        {/* Added pb-24 for mobile to prevent content hiding behind bottom nav */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
             <Outlet />
          </div>
        </main>

        {/* ── MOBILE BOTTOM NAVIGATION (Fixed) ── */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[var(--color-sapling-200)] h-16 flex items-center justify-around z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-pb">
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
              {/* FIX: Use render prop here to safely access isActive state for the div className */}
              {({ isActive }) => (
                <>
                  <div className={isActive ? 'transform scale-110 transition-transform duration-200' : ''}>
                    <item.icon className={`w-6 h-6 ${item.name === 'Add' ? 'text-[var(--color-darkblue-600)] fill-current' : ''}`} />
                  </div>
                  <span className="text-[10px] font-bold tracking-wide">{item.name}</span>
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