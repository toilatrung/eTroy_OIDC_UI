import React from 'react';
import Button from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant = 'primary',
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="presentation">
      <div
        className="confirmation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
      >
        <div className="confirmation-modal__body">
          <h2 id="confirmation-modal-title" className="confirmation-modal__title">
            {title}
          </h2>
          <p className="confirmation-modal__message">
            {body}
          </p>
        </div>
        <div className="confirmation-modal__actions">
          <Button
            className="confirmation-modal__button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            style={{ width: 'auto', minWidth: '8.75rem' }}
          >
            {cancelLabel}
          </Button>
          <Button 
            className="confirmation-modal__button"
            variant="primary"
            onClick={onConfirm} 
            isLoading={isLoading}
            style={{
              width: 'auto',
              minWidth: '11rem',
              backgroundColor: variant === 'danger' ? 'var(--color-primary)' : 'var(--color-secondary)',
              borderColor: variant === 'danger' ? 'var(--color-primary)' : 'var(--color-secondary)',
              color: '#ffffff'
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
