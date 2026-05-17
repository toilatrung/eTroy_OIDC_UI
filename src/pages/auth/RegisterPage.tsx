import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Alert from '../../shared/components/Alert';
import { authApi } from '../../features/auth/auth.api';
import { mapError, getSafeMessage } from '../../shared/api/apiError';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const registerResponse = await authApi.register({ 
        email: email.trim(), 
        password, 
        name: name.trim() || undefined 
      });
      const payload = registerResponse.data?.data as
        | { user?: { sub?: string; email?: string }; sub?: string; email?: string }
        | undefined;
      const registeredSub = payload?.user?.sub ?? payload?.sub ?? '';
      const registeredEmail = payload?.user?.email ?? payload?.email ?? email.trim();

      if (registeredSub) {
        try {
          await authApi.requestVerification(registeredSub);
        } catch {
          // Keep UX moving; success page can offer manual resend.
        }
      }

      sessionStorage.setItem('pendingVerificationEmail', registeredEmail);
      sessionStorage.setItem('pendingVerificationSub', registeredSub);

      navigate('/register/success', {
        state: {
          email: registeredEmail,
          sub: registeredSub,
        },
      });
    } catch (err) {
      const apiErr = mapError(err);
      const message = getSafeMessage(apiErr);
      
      if (message.toLowerCase().includes('already exists')) {
        setError('An account with this email already exists. Sign in or request a new verification link.');
      } else if (apiErr.code === 'VALIDATION_ERROR' || apiErr.statusCode === 400) {
        setError(message);
      } else {
        setError('We could not create your account right now. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#000000', marginBottom: '0.5rem' }}>
        Create Your Account
      </h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Join the eTroy Platform ecosystem
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {error && <Alert type="error" title="Email duplication error" message={error} />}
        
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Eva and Alice"
          disabled={isLoading}
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="user@etroy.platform"
          error={fieldErrors.email}
          disabled={isLoading}
        />
        
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          placeholder="abcd@1234"
          error={fieldErrors.password}
          disabled={isLoading}
        />

        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          placeholder="Re-type password"
          error={fieldErrors.confirmPassword}
          disabled={isLoading}
        />

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', marginTop: '1.5rem' }}>
          <input
            type="checkbox"
            id="agree"
            aria-label="I agree to the Platform User Agreement and Data Privacy Policy."
            style={{ width: '16px', height: '16px', marginTop: '0.25rem', cursor: 'pointer' }}
            required
          />
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>
            <label htmlFor="agree" style={{ cursor: 'pointer' }}>
              I agree to the
            </label>{' '}
            <Link to="/platform-user-agreement" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Platform User Agreement
            </Link>{' '}
            and{' '}
            <Link to="/data-privacy-policy" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Data Privacy Policy
            </Link>
            .
          </div>
        </div>
        
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          Register
        </Button>
      </form>
      
      <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
        <Link to="/login" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 700 }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
