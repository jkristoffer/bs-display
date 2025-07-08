interface Props {
  variant?: 'primary' | 'ghost' | 'glass' | 'gradient' | 'success' | 'warning' | 'faint';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  class?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  id?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

const {
  variant = 'primary',
  size = 'md',
  href,
  class: className = '',
  type = 'button',
  disabled = false,
  loading = false,
  id,
  icon,
  iconPosition = 'left'
} = Astro.props;

// Determine the CSS class based on variant
const variantClass = `button-${variant}`;

// Determine size class
const sizeClass = size !== 'md' ? `button-${size}` : '';

// Determine state classes
const stateClasses = [];
if (disabled) stateClasses.push('button-disabled');
if (loading) stateClasses.push('button-loading');

// Combine all classes
const classes = [variantClass, sizeClass, ...stateClasses, className].filter(Boolean).join(' ');