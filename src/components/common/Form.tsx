import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ children, className, ...props }) => {
  const combinedClassName = `space-y-6 ${className || ''}`.trim();

  return (
    <form className={combinedClassName} {...props}>
      {children}
    </form>
  );
};

export default Form; 