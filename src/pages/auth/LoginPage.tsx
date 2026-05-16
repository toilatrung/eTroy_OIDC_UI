import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Alert from '../../shared/components/Alert';
import { authApi } from '../../features/auth/auth.api';
import { mapError, getSafeMessage } from '../../shared/api/apiError';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authApi.login({ email: email.trim(), password });
      navigate('/'); 
    } catch (err) {
      const apiErr = mapError(err);
      setError(getSafeMessage(apiErr));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#000000', marginBottom: '0.5rem' }}>
        Sign in to Your Account
      </h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Please enter your eTroy Platform credentials below
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {error && <Alert type="error" title="Invalid credentials" message={error} />}
        
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="user@etroy.platform"
          disabled={isLoading}
        />
        
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="••••••••••••"
          disabled={isLoading}
        />
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          marginBottom: '2rem',
          marginTop: '1rem'
        }}>
          <label className="switch">
            <input type="checkbox" id="remember" />
            <span className="slider"></span>
          </label>
          <label htmlFor="remember" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500, margin: 0, cursor: 'pointer' }}>
            Remember session
          </label>
        </div>
        
        <Button type="submit" isLoading={isLoading} variant="primary">
          Sign in
        </Button>
      </form>
      
      <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        New to eTroy Platform? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 700, marginLeft: '4px' }}>Create account</Link>
      </div>
    </div>
  );
};

export default LoginPage;
