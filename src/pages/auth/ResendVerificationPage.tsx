import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Alert from '../../shared/components/Alert';
import { authApi } from '../../features/auth/auth.api';

/**
 * TODO: The backend currently requires 'userId' (sub) for resending verification links.
 * User-facing flow should be email-based to avoid account enumeration and better UX.
 * Once the backend supports email-based lookup for resend, update this component to
 * send the email instead of mapping/using sub.
 */
const ResendVerificationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // NOTE: Using email as the identifier. If the backend fails because it's not a 'sub',
      // it confirms the implementation gap mentioned in the TODO.
      await authApi.requestVerification(email.trim());
      setSuccess(true);
    } catch {
      // Neutral success message to avoid account enumeration even on error
      setSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      title="Resend verification email" 
      subtitle="Enter your email address and we will send a new verification link if the account exists and is eligible."
    >
      {success ? (
        <div style={{ textAlign: 'center' }}>
          <Alert 
            type="success" 
            message="If the account exists and is eligible, a verification link will be sent to your email address." 
          />
          <Link to="/login" style={{ 
            display: 'inline-block', 
            marginTop: 'var(--spacing-lg)',
            color: 'var(--color-primary)',
            fontWeight: 700,
            textDecoration: 'underline'
          }}>
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <Alert type="error" message={error} />}
          
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@etroy.platform"
            disabled={isLoading}
          />
          
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Send verification link
          </Button>
          
          <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
            <Link to="/login" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Remembered your password? Back to sign in
            </Link>
          </div>
        </form>
      )}
    </Card>
  );
};

export default ResendVerificationPage;
