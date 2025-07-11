import React from 'react';

import './Step.css';

interface StepProps {
  number: number;
  title: string;
  active?: boolean;
  onClick?: () => void;
}

const Step: React.FC<StepProps> = ({ number, title, active = false, onClick }) => {
  return (
    <div 
      className={`step ${active ? 'active' : ''}`} 
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <span className="step-number">{number}</span>
      <span className="step-title">{title}</span>
    </div>
  );
};

export default Step;
