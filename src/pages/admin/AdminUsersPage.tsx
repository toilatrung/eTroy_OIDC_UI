import React, { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../features/admin/admin.api';
import type { AdminUserView } from '../../features/admin/admin.types';
import { Users, Plus, AlertCircle, ShieldCheck, Mail, ShieldAlert } from 'lucide-react';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ email: '', name: '', password: 'Password123!!!', emailVerified: true });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminApi.listUsers();
      setUsers(data);
    } catch {
      setError('Could not retrieve user directory. Please ensure the administrative API is accessible.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchUsers);
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createUser({
        email: newUserData.email,
        name: newUserData.name,
        password: newUserData.password,
        email_verified: newUserData.emailVerified
      });
      setShowCreateModal(false);
      void fetchUsers();
    } catch {
      alert('Failed to provision user. Ensure email is unique.');
    }
  };

  const handleToggleStatus = async (sub: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'disable' : 'enable';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    
    try {
      if (currentStatus === 'active') {
        await adminApi.disableUser(sub);
      } else {
        await adminApi.enableUser(sub);
      }
      void fetchUsers();
    } catch {
      alert('Failed to update user status.');
    }
  };

  const handlePurgeUnverified = async () => {
    if (!window.confirm('CRITICAL ACTION: This will permanently delete ALL users who have not verified their email. Are you sure?')) return;
    try {
      const result = await adminApi.purgeUnverifiedUsers();
      alert(`Success: ${result.deletedCount} unverified users have been purged from the eTroy OIDC user directory.`);
      void fetchUsers();
    } catch {
      alert('Failed to execute purge operation.');
    }
  };

  return (
    <div className="admin-users">
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0 0 0.5rem 0' }}>User Management</h1>
          <p style={{ color: 'var(--color-text-subtle)', margin: 0 }}>Review and manage eTroy OIDC user accounts.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handlePurgeUnverified}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.75rem 1.25rem', 
              backgroundColor: 'transparent', 
              color: 'var(--color-error)', 
              border: '1px solid var(--color-error)', 
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ShieldAlert size={18} />
            Purge Unverified
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.75rem 1.25rem', 
              backgroundColor: 'var(--color-primary)', 
              color: 'white', 
              border: 'none', 
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Plus size={18} />
            Provision New User
          </button>
        </div>
      </header>

      {error ? (
        <div style={{ 
          backgroundColor: 'var(--color-warning-bg)', 
          border: '1px solid var(--color-warning-border)', 
          padding: '1.25rem', 
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          gap: '1rem',
          color: 'var(--color-warning)'
        }}>
          <AlertCircle size={20} />
          <p style={{ fontSize: '0.9375rem', margin: 0, fontWeight: 500 }}>{error}</p>
        </div>
      ) : isLoading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-subtle)' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>Retrieving user directory...</p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>User Identity</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>Subject (sub)</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', textAlign: 'right' }}>Status Control</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.sub} style={{ borderBottom: '1px solid var(--color-border)', transition: 'var(--transition-fast)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        backgroundColor: 'var(--color-bg-subtle)', 
                        borderRadius: 'var(--radius-sm)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'var(--color-text-subtle)'
                      }}>
                        <Users size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.9375rem' }}>{user.name || 'Unnamed User'}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-subtle)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Mail size={12} />
                          {user.email}
                          {user.email_verified && <ShieldCheck size={12} style={{ color: 'var(--color-success)' }} />}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--color-text-subtle)' }}>
                    {user.sub}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: user.status === 'active' ? 'var(--color-success)' : 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                        {user.status === 'active' ? 'Active' : 'Disabled'}
                      </span>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={user.status === 'active'}
                          onChange={() => handleToggleStatus(user.sub, user.status)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-subtle)' }}>
                    No eTroy OIDC users found in the identity directory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Provision User Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Provision eTroy OIDC User</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateUser} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name</label>
                <input 
                  required 
                  value={newUserData.name} 
                  onChange={e => setNewUserData({...newUserData, name: e.target.value})}
                  placeholder="e.g. John Doe" 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email Address</label>
                <input 
                  required 
                  type="email"
                  value={newUserData.email} 
                  onChange={e => setNewUserData({...newUserData, email: e.target.value})}
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} 
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input 
                  type="checkbox" 
                  id="emailVerified"
                  checked={newUserData.emailVerified} 
                  onChange={e => setNewUserData({...newUserData, emailVerified: e.target.checked})}
                />
                <label htmlFor="emailVerified" style={{ margin: 0, fontWeight: 500, cursor: 'pointer' }}>Mark email as verified</label>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', margin: 0 }}>
                Default temporary password: <code>Password123!!!</code>
              </p>
              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.875rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer' }}>Provision Account</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
