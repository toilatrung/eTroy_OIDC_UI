import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import FormError from '../../shared/components/FormError';
import Alert from '../../shared/components/Alert';
import { authApi } from '../../features/auth/auth.api';
import { mapError, getSafeMessage } from '../../shared/api/apiError';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
      setError('No reset token provided.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authApi.confirmPasswordReset({ token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const apiErr = mapError(err);
      setError(getSafeMessage(apiErr));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !success) {
    return (
      <Card title="Invalid Request">
        <Alert type="error" message="No password reset token found in the URL." />
        <Link to="/forgot-password">Request a new link</Link>
      </Card>
    );
  }

  return (
    <Card title="Reset password" subtitle="Enter your new password below">
      {success ? (
        <Alert type="success" message="Password successfully reset. Redirecting to login..." />
      ) : (
        <form onSubmit={handleSubmit}>
          <FormError error={error} />
          
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Enter a strong password"
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
          />
          
          <Button type="submit" isLoading={isLoading}>
            Reset password
          </Button>
        </form>
      )}
    </Card>
  );
};

export default ResetPasswordPage;
