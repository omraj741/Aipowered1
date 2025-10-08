import React from 'react';
import { motion } from 'framer-motion';
import { cardHoverAnimation } from '../../utils/animations';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
  delay?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  animate = true,
  delay = 0,
}) => {
  return (
    <motion.div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        delay: delay * 0.1,
      }}
      whileHover={onClick ? cardHoverAnimation.hover : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default Card;