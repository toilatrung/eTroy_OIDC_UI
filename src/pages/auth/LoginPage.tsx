import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Alert from '../../shared/components/Alert';
import { authApi } from '../../features/auth/auth.api';
import { mapError, getSafeMessage } from '../../shared/api/apiError';
import { mapOidcError, oidcApi } from '../../features/oidc/oidc.api';
import OidcPopupLayoutStyles from '../../features/oidc/OidcPopupLayoutStyles';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const interactionId = searchParams.get('interaction_id')?.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authApi.login({ email: email.trim(), password });
    } catch (err) {
      const apiErr = mapError(err);
      setError(getSafeMessage(apiErr));
      setIsLoading(false);
      return;
    }

    try {
      if (interactionId) {
        const interaction = await oidcApi.getInteraction(interactionId);

        if (interaction.redirectUrl) {
          window.location.assign(interaction.redirectUrl);
          return;
        }

        if (interaction.requiresConsent) {
          navigate(`/oidc/consent?interaction_id=${encodeURIComponent(interaction.interactionId)}`);
          return;
        }

        setError('Authorization could not continue because the server did not return a redirect or consent step.');
        return;
      }

      navigate('/');
    } catch (err) {
      const oidcError = mapOidcError(err);

      if (oidcError.redirectUrl) {
        window.location.assign(oidcError.redirectUrl);
        return;
      }

      setError(oidcError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="oidc-popup-flow" style={{ width: '100%', maxWidth: '420px' }}>
      <OidcPopupLayoutStyles />
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
          {interactionId ? 'Sign in and continue' : 'Sign in'}
        </Button>
      </form>
      
      <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        New to eTroy Platform? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 700, marginLeft: '4px' }}>Create account</Link>
      </div>
    </div>
  );
};

export default LoginPage;
