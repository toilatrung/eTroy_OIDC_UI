import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import LoadingState from '../../shared/components/LoadingState';
import { authApi } from '../../features/auth/auth.api';

const VerifyEmailResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await authApi.confirmVerification(token);
        setSuccess(true);
      } catch {
        // Silently fail as we show the error state via the success=false flag
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <Card 
      title={isLoading ? 'Verifying your email...' : ''}
      padding="0"
    >
      {isLoading ? (
        <div style={{ padding: 'var(--spacing-xl)' }}>
          <LoadingState />
        </div>
      ) : success ? (
        <div style={{ textAlign: 'left' }}>
          {/* Success Banner */}
          <div style={{ 
            backgroundColor: '#f0fdf4', 
            border: '1px solid #dcfce7',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            margin: 'var(--spacing-lg) var(--spacing-lg) 0'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.9375rem' }}>Email verified successfully.</span>
          </div>

          <div style={{ padding: 'var(--spacing-lg)' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 'var(--spacing-sm)' }}>Welcome back</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)', lineHeight: 1.5 }}>
              Your account is now fully verified. You can now continue to your requested application
            </p>
            
            <button 
              onClick={() => navigate('/login')}
              style={{ 
                width: '100%',
                padding: '0.875rem',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'left' }}>
          {/* Error Banner */}
          <div style={{ 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fee2e2',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            margin: 'var(--spacing-lg) var(--spacing-lg) 0'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.9375rem' }}>Invalid or expired token.</span>
          </div>

          <div style={{ padding: 'var(--spacing-lg)' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)', lineHeight: 1.5 }}>
              The link you followed has either expired or was already used. Please request a new one
            </p>
            
            <button 
              onClick={() => navigate('/resend-verification')}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-primary)',
                color: 'var(--color-primary)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9375rem'
              }}
            >
              Request a new link
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VerifyEmailResultPage;
