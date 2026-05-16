import React from 'react';

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  title?: string;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type, message, title, className = '' }) => {
  const isError = type === 'error' || type === 'warning';
  const displayTitle = title || (isError ? 'Invalid information' : 'Success');

  return (
    <div className={`alert-banner alert-banner-${type === 'success' ? 'success' : 'error'} ${className}`}>
      <div className="alert-banner-icon">
        {type === 'success' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )}
      </div>
      <div className="alert-banner-content">
        <span className="alert-banner-title">{displayTitle}</span>
        <p className="alert-banner-message">{message}</p>
      </div>
    </div>
  );
};

export default Alert;
