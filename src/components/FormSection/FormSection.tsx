import React from 'react';

import './FormSection.css';

interface FormSectionProps {
  title: string;
  active?: boolean;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, active = false, children }) => {
  return (
    <div className={`form-section ${active ? 'active' : ''}`} data-step={title.toLowerCase().replace(/\s+/g, '-')}> 
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default FormSection;
