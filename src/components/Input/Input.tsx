import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={`form-group ${className}`}>
        {label && <label htmlFor={props.id || props.name}>{label}</label>}
        <input
          ref={ref}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          {...props}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
