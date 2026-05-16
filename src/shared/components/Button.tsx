import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyle: React.CSSProperties = {
    padding: '0.875rem 1.25rem',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
    fontSize: '1rem',
    transition: 'var(--transition-fast)',
    border: '1px solid transparent',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%'
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'white',
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: 'var(--color-border)',
      color: 'var(--color-text-main)',
    },
    danger: {
      backgroundColor: 'var(--color-error)',
      color: 'white',
    }
  };

  const currentVariant = variants[variant];
  const isButtonDisabled = disabled || isLoading;

  const { style, ...rest } = props;

  return (
    <button
      {...rest}
      disabled={isButtonDisabled}
      style={{
        ...baseStyle,
        ...currentVariant,
        ...style,
        opacity: isButtonDisabled ? 0.6 : 1,
        cursor: isButtonDisabled ? 'not-allowed' : 'pointer'
      }}
      className={`btn-${variant} ${className}`}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
