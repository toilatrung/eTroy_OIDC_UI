import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 'var(--spacing-xl)',
      color: 'var(--color-text-muted)'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid var(--color-bg-subtle)',
        borderTop: '4px solid var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: 'var(--spacing-md)'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingState;
