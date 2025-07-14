import React, { useEffect, useRef } from 'react';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({ children, className = '' }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      // Start with invisible and slightly transformed
      wrapperRef.current.style.opacity = '0';
      wrapperRef.current.style.transform = 'translateY(20px) scale(0.98)';
      
      // Animate in
      const timer = setTimeout(() => {
        if (wrapperRef.current) {
          wrapperRef.current.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          wrapperRef.current.style.opacity = '1';
          wrapperRef.current.style.transform = 'translateY(0) scale(1)';
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
};
