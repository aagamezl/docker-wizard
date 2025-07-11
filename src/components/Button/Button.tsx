import React from 'react';

import './Button.css';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
  type = 'button'
}) => {
  const baseStyles = '';
  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    danger: 'bg-danger'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
