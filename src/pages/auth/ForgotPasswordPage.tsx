import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Alert from '../../shared/components/Alert';
import { authApi } from '../../features/auth/auth.api';
import { mapError, getSafeMessage } from '../../shared/api/apiError';

const ForgotPasswordPage: React.FC = () => {
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
      await authApi.requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      const apiErr = mapError(err);
      // To avoid account enumeration, the backend might return success even if user doesn't exist.
      // We should handle that based on backend contract.
      setError(getSafeMessage(apiErr));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Forgot password" subtitle="Enter your email to receive a password reset link">
      {success ? (
        <div style={{ textAlign: 'center' }}>
          <Alert type="success" message="If an account exists with this email, a reset link has been sent." />
          <Link to="/login" style={{ 
            display: 'inline-block', 
            marginTop: 'var(--spacing-md)', 
            color: 'var(--color-primary)', 
            fontWeight: 700, 
            textDecoration: 'underline' 
          }}>
            Return to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <Alert type="error" message={error} />}
          
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="name@example.com"
          />
          
          <Button type="submit" isLoading={isLoading}>
            Send reset link
          </Button>
          
          <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center', fontSize: '1rem', color: '#000000' }}>
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'underline' }}>Return to sign in</Link>
          </div>
        </form>
      )}
    </Card>
  );
};

export default ForgotPasswordPage;
