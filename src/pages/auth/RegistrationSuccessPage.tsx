import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Alert from '../../shared/components/Alert';
import { authApi } from '../../features/auth/auth.api';

const RegistrationSuccessPage: React.FC = () => {
  const location = useLocation();
  const [isResending, setIsResending] = React.useState(false);
  const [resendMessage, setResendMessage] = React.useState<string | null>(null);
  const [resendError, setResendError] = React.useState<string | null>(null);

  const state = (location.state as { email?: string; sub?: string } | null) ?? null;
  const email =
    state?.email ??
    sessionStorage.getItem('pendingVerificationEmail') ??
    'your registered email address';
  const sub = state?.sub ?? sessionStorage.getItem('pendingVerificationSub') ?? '';

  const handleResend = async () => {
    if (!sub) {
      setResendError('Missing verification context. Please register again or sign in and request a new link.');
      return;
    }
    setIsResending(true);
    setResendError(null);
    setResendMessage(null);
    try {
      await authApi.requestVerification(sub);
      setResendMessage('A new verification email has been requested. Please check your inbox and spam folder.');
    } catch {
      setResendError('Could not request a new verification email right now. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card 
      title="Verify your email" 
    >
      <div style={{ textAlign: 'left', marginTop: 'var(--spacing-md)' }}>
        <p style={{ color: 'var(--color-text-main)', marginBottom: 'var(--spacing-lg)', lineHeight: 1.6 }}>
          We've sent a verification link to <strong>{email}</strong>. 
          Please check your inbox and click the link to activate your account.
        </p>

        {resendMessage && <Alert type="success" message={resendMessage} />}
        {resendError && <Alert type="error" message={resendError} />}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <button
            onClick={handleResend}
            disabled={isResending}
            style={{ 
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--color-primary)',
            color: 'var(--color-primary)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9375rem',
            opacity: isResending ? 0.7 : 1
          }}>
            {isResending ? 'Requesting...' : 'Resend Verification Email'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-sm)' }}>
            <Link to="/register" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
              Change email address
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RegistrationSuccessPage;
