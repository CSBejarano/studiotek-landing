'use client';

import { useState, useEffect } from 'react';

interface UseRotatingPlaceholderOptions {
  placeholders: string[];
  intervalMs?: number;
  paused?: boolean;
}

/**
 * Hook that rotates through a list of placeholder strings at a fixed interval.
 * Returns the current index into the placeholders array.
 */
export function useRotatingPlaceholder({
  placeholders,
  intervalMs = 3000,
  paused = false,
}: UseRotatingPlaceholderOptions): number {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % placeholders.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [paused, placeholders.length, intervalMs]);

  return currentIndex;
}
