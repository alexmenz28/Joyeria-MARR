import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  const combinedClassName = `bg-white rounded-lg shadow-md p-6 ${className || ''}`.trim();

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
};

export default Card; 