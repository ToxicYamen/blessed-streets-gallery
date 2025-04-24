
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | string;
  priority?: boolean;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  className,
  aspectRatio = 'square',
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const aspectRatioClass = 
    aspectRatio === 'square' ? 'aspect-square' :
    aspectRatio === 'video' ? 'aspect-video' :
    aspectRatio === 'portrait' ? 'aspect-[3/4]' :
    aspectRatio === 'wide' ? 'aspect-[16/9]' : aspectRatio;
  
  return (
    <div className={cn('overflow-hidden relative rounded-xl', aspectRatioClass, className)}>
      <img 
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-all duration-700 rounded-xl',
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110',
        )}
        onLoad={() => setIsLoaded(true)}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
};

export default AnimatedImage;
