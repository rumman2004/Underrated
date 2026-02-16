import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MessageSquare, 
  LogOut, 
  MapPin,
  Pen
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
        // localStorage.removeItem('adminToken');
        navigate('/admin/login');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Add Place', path: '/admin/add', icon: PlusCircle },
    { name: 'View All', path: '/admin/viewplaces', icon: MapPin},
    { name: 'Inbox', path: '/admin/submissions', icon: Pen},
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-surface)] border-r border-[var(--color-sapling-200)]">
      
      {/* Admin Logo Area */}
      <div className="h-20 md:h-24 flex items-center px-6 md:px-8 border-b border-[var(--color-sapling-200)]">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--color-darkblue-600)] text-[var(--color-sapling-300)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-darkblue-600)]/20">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 fill-current" />
          </div>
          <span className="text-lg md:text-xl font-serif font-bold text-[var(--color-darkblue-900)]">
            Curator<span className="text-[var(--color-darkblue-600)]">.</span>
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 md:px-6 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-bold text-[var(--color-darkblue-400)] uppercase tracking-widest mb-4">Main Menu</p>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm
              ${isActive 
                ? 'bg-[var(--color-darkblue-600)] text-white shadow-lg shadow-[var(--color-darkblue-600)]/20' 
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-sapling-100)] hover:text-[var(--color-darkblue-900)]'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* User Profile / Logout */}
      <div className="p-4 md:p-6 border-t border-[var(--color-sapling-200)]">
        <div className="bg-white border border-[var(--color-sapling-200)] rounded-2xl p-3 md:p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-sapling-100)] border border-[var(--color-sapling-300)] flex items-center justify-center text-[var(--color-darkblue-600)] font-bold text-xs md:text-sm">
              AD
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-[var(--color-darkblue-900)]">Admin</p>
              <p className="text-[10px] text-[var(--color-darkblue-400)] font-medium">Super User</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-[var(--color-darkblue-300)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;