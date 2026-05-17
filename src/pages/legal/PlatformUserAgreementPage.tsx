import React from 'react';
import { Link } from 'react-router-dom';

const agreementItems = [
  'Users must provide accurate account information.',
  'Users are responsible for keeping account credentials secure.',
  'Users must not misuse eTroy One services, attempt unauthorized access, or interfere with platform operations.',
  'eTroy OIDC provides identity, authentication, authorization, and connected application consent for eTroy One.',
  'Access may be restricted or revoked if misuse, abuse, or unauthorized activity is detected.',
  'Continued use of eTroy One services through eTroy OIDC means acceptance of this agreement.',
];

const PlatformUserAgreementPage: React.FC = () => {
  return (
    <div style={{ width: '100%', maxWidth: '760px', margin: '0 auto', padding: '0.5rem 0 1.5rem' }}>
      <section
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#ffffff',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <p style={{ color: 'var(--color-primary)', fontSize: '0.8125rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          eTroy OIDC
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#000000', marginBottom: '0.75rem' }}>
          Platform User Agreement
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          This Platform User Agreement explains the basic terms for using eTroy One services with an eTroy OIDC account.
        </p>

        <ul style={{ display: 'grid', gap: '0.875rem', margin: '0 0 1.75rem', paddingLeft: '1.25rem' }}>
          {agreementItems.map((item) => (
            <li key={item} style={{ color: 'var(--color-text-main)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {item}
            </li>
          ))}
        </ul>

        <Link
          to="/register"
          style={{
            display: 'inline-block',
            color: 'var(--color-primary)',
            fontSize: '0.9rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Back to register
        </Link>
      </section>
    </div>
  );
};

export default PlatformUserAgreementPage;
