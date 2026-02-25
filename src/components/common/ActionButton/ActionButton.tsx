// ActionButton.tsx
import React from 'react';
import styles from './ActionButton.module.css';

/**
 * Available variants for the ActionButton component
 * @enum {string}
 */
export const ActionButtonVariant = {
  NORMAL: 'NORMAL',
  INFO: 'INFO',
  DELETE: 'DELETE',
};

export type VariantType = typeof ActionButtonVariant[keyof typeof ActionButtonVariant];

/**
 * Props for the ActionButton component
 * @interface ActionButtonProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
export interface ActionButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'> {
  /** The variant style of the button */
  variant: VariantType;
  /** Additional CSS class name for custom styling */
  className?: string;
  /** Button content */
  children: React.ReactNode;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** ARIA label for accessibility (required if button has no visible text) */
  'aria-label'?: string;
}

/**
 * A customizable button component with multiple variants for different action types.
 * Designed to be accessible, responsive, and performant.
 *
 * @component
 * @example
 * ```tsx
 * <ActionButton variant={ActionButtonVariant.INFO} onClick={handleClick}>
 *   Save Changes
 * </ActionButton>
 * ```
 *
 * @param {ActionButtonProps} props - Component props
 * @returns {JSX.Element} Rendered ActionButton component
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = ActionButtonVariant.NORMAL,
  className = '',
  children,
  loading = false,
  disabled = false,
  'aria-label': ariaLabel,
  ...buttonProps
}) => {
  /**
   * Determines the appropriate CSS class based on the variant
   */
  const getVariantClass = (): string => {
    switch (variant) {
      case ActionButtonVariant.INFO:
        return styles.info;
      case ActionButtonVariant.DELETE:
        return styles.delete;
      case ActionButtonVariant.NORMAL:
      default:
        return styles.normal;
    }
  };

  /**
   * Combines base class with variant class and any additional classes
   */
  const buttonClasses = [
    styles.actionButton,
    getVariantClass(),
    loading ? styles.loading : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={buttonClasses}
      disabled={disabled || loading}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
      {...buttonProps}
    >
      {loading && (
        <span className={styles.loader} aria-hidden="true">
          {/* Loading indicator */}
          <span className={styles.loaderDot}></span>
        </span>
      )}
      <span className={loading ? styles.hiddenContent : ''}>
        {children}
      </span>
    </button>
  );
};
