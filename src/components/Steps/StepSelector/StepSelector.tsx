import React from 'react';

import './StepSelector.css';

interface StepProps {
  number: number;
  title: string;
  active?: boolean;
  onClick?: () => void;
}

export const StepSelector: React.FC<StepProps> = ({ number, title, active = false, onClick }) => {
  return (
    <div 
      className={`step ${active ? 'active' : ''}`} 
      onClick={onClick}
      role="button"
      tabIndex={number}
    >
      <span className="step-number">{number}</span>
      <span className="step-title">{title}</span>
    </div>
  );
};
