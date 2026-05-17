import React from 'react';
import { Link } from 'react-router-dom';

const agreementItems = [
  'User agrees to provide accurate account information.',
  'User is responsible for protecting account credentials.',
  'User must not misuse the platform, attempt unauthorized access, or interfere with services.',
  'eTroy OIDC provides identity services for the eTroy Platform ecosystem.',
  'Access may be restricted or revoked if misuse is detected.',
  'Continued use means acceptance of the agreement.',
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
          This static agreement supports local testing for eTroy Platform account registration and identity access.
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
          Back to Register
        </Link>
      </section>
    </div>
  );
};

export default PlatformUserAgreementPage;
