import React from 'react';
import { Link } from 'react-router-dom';

const policyItems = [
  'The platform collects account information such as name, email, login/session metadata, and connected application consent records.',
  'Data is used for authentication, authorization, account security, and connected application access.',
  'The platform does not expose passwords, secrets, tokens, or internal session data to connected applications.',
  'Connected applications receive only approved OIDC claims/scopes after user consent.',
  'Users may revoke connected application access where supported.',
  'Security logs may be retained for audit and abuse prevention.',
  'Continued use means acceptance of the policy.',
];

const DataPrivacyPolicyPage: React.FC = () => {
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
          Data Privacy Policy
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          This static policy explains the minimum data handling expectations for eTroy Platform identity flows.
        </p>

        <ul style={{ display: 'grid', gap: '0.875rem', margin: '0 0 1.75rem', paddingLeft: '1.25rem' }}>
          {policyItems.map((item) => (
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

export default DataPrivacyPolicyPage;
