import React from 'react';
import clsx from 'clsx';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  return (
    <button
      className={clsx('btn', `btn-${variant}`, `btn-${size}`, className)}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={18} className="btn-icon mr-2" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={18} className="btn-icon ml-2" />}
    </button>
  );
};
