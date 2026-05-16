import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: string;
}

const Card: React.FC<CardProps> = ({ children, title, subtitle, className = '', padding = 'var(--spacing-xl)' }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    width: '100%',
    padding: padding,
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)'
  };

  return (
    <div style={cardStyle} className={className}>
      {(title || subtitle) && (
        <div style={{ marginBottom: title && !subtitle ? '0' : 'var(--spacing-lg)' }}>
          {title && <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000000', marginBottom: subtitle ? 'var(--spacing-sm)' : '0', letterSpacing: '-0.02em' }}>{title}</h1>}
          {subtitle && <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
