import React, { type ReactNode } from 'react';
import './DialogContent.css';

export interface DialogContentProps {
  children: ReactNode;
  className?: string;
  dividers?: boolean;
}

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className = '',
  dividers = false,
}) => {
  return (
    <div className={`dialog-content ${dividers ? 'dividers' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default DialogContent;
