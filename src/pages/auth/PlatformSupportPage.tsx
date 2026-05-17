import React from 'react';

const supportGroups = [
  {
    title: 'Account & Login Support',
    description:
      'Support for login issues, user account access, email verification status, and general account authentication problems.',
  },
  {
    title: 'Email Verification',
    description:
      'Support for missing verification emails, expired verification links, or issues completing account verification.',
  },
  {
    title: 'Password Reset',
    description:
      'Support for password reset requests, missing reset emails, and expired or invalid password reset tokens.',
  },
  {
    title: 'eTroy One Access Issues',
    description:
      'Support for application access errors across eTroy One after authentication through eTroy OIDC.',
  },
];

const PlatformSupportPage: React.FC = () => {
  return (
    <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', padding: '0.5rem 0 1.5rem' }}>
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(128, 0, 0, 0.1), rgba(128, 0, 0, 0.04))',
          border: '1px solid rgba(128, 0, 0, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#800000', marginBottom: '0.75rem' }}>
          eTroy Collaboration Support
        </h1>
        <p style={{ color: 'var(--color-text-main)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Need help with your eTroy OIDC account or access to eTroy One services? Contact eTroy Collaboration for
          support with account verification, password reset, sign-in issues, and connected application access.
        </p>
        <a
          href="mailto:troycourselab.hust@gmail.com"
          style={{
            display: 'inline-block',
            backgroundColor: '#800000',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.9rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
          }}
        >
          Contact Support
        </a>
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {supportGroups.map((group) => (
          <article
            key={group.title}
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              backgroundColor: '#ffffff',
            }}
          >
            <h2 style={{ fontSize: '1rem', color: '#800000', fontWeight: 700, marginBottom: '0.5rem' }}>{group.title}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-subtle)', lineHeight: 1.6 }}>{group.description}</p>
          </article>
        ))}
      </section>

      <section
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#ffffff',
          padding: '1.25rem',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', color: '#800000', fontWeight: 700, marginBottom: '0.5rem' }}>Developer Contact</h2>
        <p style={{ color: 'var(--color-text-subtle)', marginBottom: '0.75rem' }}>
          Official support contact for eTroy OIDC account and eTroy One access assistance:
        </p>
        <a
          href="mailto:troycourselab.hust@gmail.com"
          style={{ color: '#800000', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}
        >
          troycourselab.hust@gmail.com
        </a>
      </section>
    </div>
  );
};

export default PlatformSupportPage;
