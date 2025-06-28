'use client';

import Link from 'next/link';

import { motion, useAnimation, type Variants } from 'framer-motion';

import { cn } from '@/lib/utils/cn';

const ease = [0.16, 1, 0.3, 1] as const;

interface HeroBadgeProps {
  href?: string;
  text: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const badgeVariants: Record<string, string> = {
  default:
    'bg-gray-100/80 hover:bg-gray-200/80 border-gray-200/50 text-gray-800 backdrop-blur-sm dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 dark:text-white',
  outline:
    'border-2 border-gray-300/60 hover:bg-gray-100/50 text-gray-700 dark:border-white/30 dark:hover:bg-white/10 dark:text-white',
  ghost: 'hover:bg-gray-100/60 text-gray-700 dark:hover:bg-white/10 dark:text-white',
};

const sizeVariants: Record<string, string> = {
  sm: 'px-3 py-1 text-xs gap-1.5',
  md: 'px-4 py-1.5 text-sm gap-2',
  lg: 'px-5 py-2 text-base gap-2.5',
};

const iconAnimationVariants: Variants = {
  initial: { rotate: 0 },
  hover: { rotate: -10 },
};

export default function HeroBadge({
  href,
  text,
  icon,
  endIcon,
  variant = 'default',
  size = 'md',
  className,
  onClick,
}: HeroBadgeProps) {
  const controls = useAnimation();

  const BadgeWrapper: React.ElementType = href ? Link : motion.button;
  const wrapperProps = href ? { href } : { onClick };

  const baseClassName = cn(
    'inline-flex items-center rounded-full border transition-colors font-medium',
    badgeVariants[variant],
    sizeVariants[size],
    className
  );

  return (
    <BadgeWrapper {...wrapperProps} className={cn('group', href && 'cursor-pointer')}>
      <motion.div
        className={baseClassName}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        onHoverStart={() => controls.start('hover')}
        onHoverEnd={() => controls.start('initial')}
      >
        {icon && (
          <motion.div
            className="text-gray-600 transition-colors group-hover:text-gray-800 dark:text-white/80 dark:group-hover:text-white"
            variants={iconAnimationVariants}
            initial="initial"
            animate={controls}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            {icon}
          </motion.div>
        )}
        <span className="text-gray-800 font-medium dark:text-white">{text}</span>
        {endIcon && <motion.div className="text-gray-600 dark:text-white/80">{endIcon}</motion.div>}
      </motion.div>
    </BadgeWrapper>
  );
}
