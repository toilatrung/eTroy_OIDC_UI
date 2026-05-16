import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Alert from '../../shared/components/Alert';

const AccountErrorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const message = searchParams.get('message');

  return (
    <Card title="Account Error" subtitle="There was a problem with your account request">
      <Alert 
        type="error" 
        message={message || 'An unknown error occurred during the authentication process.'} 
      />
      
      {code && (
        <p style={{ 
          fontSize: '0.75rem', 
          color: 'var(--color-text-muted)', 
          textAlign: 'center',
          marginBottom: 'var(--spacing-md)' 
        }}>
          Error Code: {code}
        </p>
      )}

      <div style={{ textAlign: 'center' }}>
        <Link to="/login" style={{ fontSize: '0.875rem' }}>
          Back to Sign In
        </Link>
      </div>
    </Card>
  );
};

export default AccountErrorPage;
