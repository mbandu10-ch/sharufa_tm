import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  iconOnly = false, 
  variant = 'light' 
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={cn("flex items-center justify-start", className)}>
      <div className={cn(
        "relative transition-all duration-300 flex items-center justify-start",
        iconOnly ? "w-10 h-10 md:w-16 md:h-16" : "h-12 md:h-40 w-[140px] md:w-[320px]"
      )}>
        <div 
          className="w-full h-full relative"
          style={{
            filter: isDark ? 'brightness(0) invert(1)' : 'none',
            opacity: isDark ? 0.9 : 1
          }}
        >
          {iconOnly ? (
            <Image
              src="/images/logo-s.png"
              alt="Sharufa Monogram"
              fill
              sizes="(max-width: 768px) 40px, 64px"
              className="object-contain object-left object-center"
              priority
            />
          ) : (
            <Image
              src="/images/logo-sharufa.png"
              alt="Sharufa Logo"
              fill
              sizes="(max-width: 768px) 140px, 320px"
              className="object-contain object-left object-center"
              priority
            />
          )}
        </div>
      </div>
    </div>
  );
};
