import React, { useCallback, useState } from 'react';

interface TouchableOpacityProps {
  children: React.ReactNode;
  onPress?: () => void;
  activeOpacity?: number;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

const TouchableOpacity: React.FC<TouchableOpacityProps> = ({
  children,
  onPress,
  activeOpacity = 0.2,
  style,
  className,
  disabled,
}) => {
  const [opacity, setOpacity] = useState(1);

  const handlePressIn = useCallback(() => {
    if (!disabled)
      setOpacity(activeOpacity);
  }, [activeOpacity]);

  const handlePressOut = useCallback(() => {
    if (!disabled)
      setOpacity(1);
  }, []);

  const handleClick = () => {
    if (!disabled && onPress)
      onPress();
  }

  const opacityStyle: React.CSSProperties = {
    opacity,
    transition: 'opacity 0.1s ease-out',
    cursor: 'pointer',
    userSelect: 'none',
    ...style,
  };

  return (
    <div
      className={className}
      style={opacityStyle}
      onClick={handleClick}
      onMouseDown={handlePressIn}
      onMouseUp={handlePressOut}
      onMouseLeave={handlePressOut}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onTouchCancel={handlePressOut}
    >
      {children}
    </div>
  );
};

export default TouchableOpacity;
