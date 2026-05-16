import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ShieldCheck, 
  Activity, 
  Key, 
  LogOut,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/clients', label: 'Client Management', icon: Settings },
    { to: '/admin/sessions', label: 'Sessions & Tokens', icon: ShieldCheck },
    { to: '/admin/audit', label: 'Audit Logs', icon: ShieldAlert },
    { to: '/admin/observability', label: 'Observability', icon: Activity },
    { to: '/admin/keys', label: 'Key Management', icon: Key },
  ];

  return (
    <div className="admin-container" style={{ display: 'flex', height: '100%', backgroundColor: 'var(--color-bg-subtle)', width: '100%' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ 
        width: '260px', 
        backgroundColor: 'var(--color-surface)', 
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0
      }}>
        <div className="admin-sidebar-header" style={{ 
          padding: '2rem', 
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: 'var(--color-primary)', 
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>Management</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', margin: 0 }}>Identity Layer Foundation</p>
          </div>
        </div>

        <nav className="admin-sidebar-nav" style={{ flex: 1, padding: '1.5rem 1rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
                    backgroundColor: isActive ? 'var(--color-primary-soft)' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.9375rem',
                    transition: 'var(--transition-fast)'
                  })}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {/* Decorative indicator for active state */}
                  <div style={{ marginLeft: 'auto', opacity: 0.5 }}>
                    <ChevronRight size={14} />
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar-footer" style={{ 
          padding: '1.5rem', 
          borderTop: '1px solid var(--color-border)',
          marginTop: 'auto'
        }}>
          <button 
            onClick={() => navigate('/')}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-main)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'var(--transition-fast)'
            }}
          >
            <LogOut size={16} />
            <span>Back to Profile</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main" style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        .admin-nav-item:hover {
          background-color: var(--color-bg-subtle) !important;
          color: var(--color-primary) !important;
        }
        .admin-nav-item.active:hover {
          background-color: var(--color-primary-soft-hover) !important;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
