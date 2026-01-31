'use client';

import { useState, useEffect } from 'react';

/**
 * Returns responsive particle count based on viewport width.
 * Mobile (<768): 30, Tablet (768-1023): 50, Desktop (1024+): 80
 *
 * SSR-safe: defaults to desktop value (80) since window is unavailable on server.
 */
export function useResponsiveParticles(): number {
  const [quantity, setQuantity] = useState(80);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setQuantity(30);
      else if (w < 1024) setQuantity(50);
      else setQuantity(80);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return quantity;
}
