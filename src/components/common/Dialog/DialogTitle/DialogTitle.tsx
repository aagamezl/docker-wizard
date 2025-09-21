import React, { type ReactNode } from 'react';
import './DialogTitle.css';

export interface DialogTitleProps {
  children: ReactNode;
  className?: string;
  onClose?: () => void;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  className = '',
  onClose,
}) => {
  return (
    <div className={`dialog-title-container ${className}`}>
      <h2 className="dialog-title">{children}</h2>
      {onClose && (
        <button 
          className="dialog-close-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          &times;
        </button>
      )}
    </div>
  );
};
