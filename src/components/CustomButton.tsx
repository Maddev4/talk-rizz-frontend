import React from 'react';
import { motion } from 'framer-motion';
import { useLongPress } from 'use-long-press';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  onLongPress?: () => void;
  onLongFinish?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  onLongPress,
  onLongFinish
}) => {
  const baseClasses = 'text-[var(--ion-text-primary)] w-full bg-gradient-to-b from-[#00DC83] to-[#079F61] rounded-full py-3';
  const combinedClasses = `${baseClasses} ${className}`.trim();

  const bind = useLongPress(onLongPress ? onLongPress : null, {
    onFinish: onLongFinish,
    cancelOnMovement: false,
    cancelOutsideElement: true,
  })

  return (
    <motion.button
      {...bind()}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
      whileTap={{ scale: 0.95, opacity: 0.8 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};

export default CustomButton;
