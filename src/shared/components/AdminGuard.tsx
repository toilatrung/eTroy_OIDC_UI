import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { userApi } from '../../features/user/user.api';
import type { UserProfile } from '../../features/user/user.types';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await userApi.getMe();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--color-text-subtle)', fontWeight: 500 }}>Verifying administrative access...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to profile or show Access Denied if not admin
  if (!user.isAdmin) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: 'var(--color-bg-subtle)'
      }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          color: '#ef4444', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0 0 0.5rem 0' }}>Access Denied</h2>
        <p style={{ color: 'var(--color-text-subtle)', marginBottom: '2rem', maxWidth: '400px' }}>
          You do not have the required administrative privileges to access the Management Platform.
        </p>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: 'var(--color-text-main)', 
            color: 'white', 
            border: 'none', 
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Return to Profile
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
