import React, { type ReactNode } from 'react';

import './DialogActions.css';

export interface DialogActionsProps {
  children: ReactNode;
  className?: string;
  disableSpacing?: boolean;
  justify?: 'start' | 'end' | 'between';
}

export const DialogActions: React.FC<DialogActionsProps> = ({
  children,
  className = '',
  disableSpacing = false,
  justify = 'end',
}) => {
  const justifyClass = justify === 'between' ? 'justify-between' : 
                     justify === 'start' ? 'justify-start' : 'justify-end';
  
  return (
    <div className={`dialog-actions ${justifyClass} ${className} ${!disableSpacing ? 'spacing' : ''}`}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className="dialog-action-item">
          {child}
        </div>
      ))}
    </div>
  );
};

export default DialogActions;