'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BlurImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function BlurImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority = false
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      priority={priority}
      className={cn(
        "object-cover transition-all duration-500",
        isLoaded ? "blur-0 scale-100" : "blur-md scale-105",
        className
      )}
      onLoad={() => setIsLoaded(true)}
    />
  );
}
