import React from 'react';

interface OpacityCardProps {
  className?: string;
  children?: React.ReactNode;
}

const OpacityCard: React.FC<OpacityCardProps> = ({ className = '', children }) => (
  <div className={`rounded-xl w-full p-2 border border-[var(--ion-color-primary)] backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

export default OpacityCard;