import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Alert from '../../shared/components/Alert';
import Button from '../../shared/components/Button';
import LoadingState from '../../shared/components/LoadingState';
import OidcPopupLayoutStyles from '../../features/oidc/OidcPopupLayoutStyles';
import { mapOidcError, oidcApi } from '../../features/oidc/oidc.api';
import type { OidcInteractionContext } from '../../features/oidc/oidc.types';

const SCOPE_DESCRIPTIONS: Record<string, string> = {
  openid: 'Allows the application to verify your identity through eTroy OIDC.',
  profile: 'Allows the application to access your basic profile information.',
  email: 'Allows the application to access your email address and email verification status.',
  offline_access: 'Allows the application to maintain access according to approved session and consent rules.',
};

const ConsentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const interactionId = searchParams.get('interaction_id')?.trim();
  const [interaction, setInteraction] = React.useState<OidcInteractionContext | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [decisionLoading, setDecisionLoading] = React.useState<'approve' | 'deny' | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchInteraction = async () => {
      if (!interactionId) {
        setError('Missing authorization interaction. Please restart sign-in from the client application.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const context = await oidcApi.getInteraction(interactionId);

        if (context.redirectUrl) {
          window.location.assign(context.redirectUrl);
          return;
        }

        if (!context.requiresConsent) {
          setInteraction(null);
          setError('This authorization request is not waiting for consent. Please restart sign-in from the client application.');
          return;
        }

        setInteraction(context);
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

    void fetchInteraction();
  }, [interactionId]);

  const handleDecision = async (decision: 'approve' | 'deny') => {
    if (!interactionId) return;

    setDecisionLoading(decision);
    setError(null);

    try {
      const result = await oidcApi.submitDecision(interactionId, decision);
      window.location.assign(result.redirectUrl);
    } catch (err) {
      const oidcError = mapOidcError(err);

      if (oidcError.redirectUrl) {
        window.location.assign(oidcError.redirectUrl);
        return;
      }

      setError(oidcError.message);
      setDecisionLoading(null);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="oidc-popup-flow" style={{ width: '100%', maxWidth: '520px' }}>
      <OidcPopupLayoutStyles />
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#000000', marginBottom: '0.5rem' }}>
        Authorize this application
      </h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Review the access this application is requesting through eTroy OIDC before continuing.
      </p>

      {error && <Alert type="error" title="Authorization request failed" message={error} />}

      {interaction && (
        <section style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          padding: '1.5rem',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '0.5rem',
            }}>
              Client application
            </span>
            <h2 style={{ fontSize: '1.25rem', color: '#000000', margin: 0 }}>
              {interaction.clientName || interaction.clientId || 'Unknown client application'}
            </h2>
            {interaction.clientId && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                Client ID: {interaction.clientId}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#000000', marginBottom: '0.75rem' }}>
              Requested permissions
            </h3>

            {interaction.scopes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {interaction.scopes.map((scope) => (
                  <div
                    key={scope}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.875rem',
                      backgroundColor: '#f9fafb',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#000000', marginBottom: '0.25rem' }}>
                      {scope}
                    </div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                      {SCOPE_DESCRIPTIONS[scope] || 'Allows the application to request this approved permission through eTroy OIDC.'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
                This application is not requesting any additional permissions.
              </p>
            )}
          </div>

          <div className="oidc-consent-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleDecision('deny')}
              disabled={decisionLoading !== null}
              isLoading={decisionLoading === 'deny'}
            >
              Deny
            </Button>
            <Button
              type="button"
              onClick={() => void handleDecision('approve')}
              disabled={decisionLoading !== null}
              isLoading={decisionLoading === 'approve'}
            >
              Allow
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ConsentPage;
