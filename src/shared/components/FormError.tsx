import React from 'react';
import Alert from './Alert';

interface FormErrorProps {
  error?: string | null;
}

const FormError: React.FC<FormErrorProps> = ({ error }) => {
  if (!error) return null;

  return <Alert type="error" message={error} />;
};

export default FormError;
