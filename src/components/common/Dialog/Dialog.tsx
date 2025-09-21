import React, { type ReactNode } from 'react';

// import './styles.css';
import './Dialog.css';

export interface DialogProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  title?: string | ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  actions?: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  maxWidth = 'md',
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={`dialog-overlay ${className}`} onClick={onClose}>
      <div
        className={`dialog-container ${maxWidth}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* <div className="dialog-content"> */}
          {children}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Dialog;
