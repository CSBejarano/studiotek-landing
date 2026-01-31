'use client';

import { useAIChatPanel } from './AIChatPanelContext';
import { useEffect, useState } from 'react';

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const { isPanelOpen } = useAIChatPanel();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <div
      className="transition-[margin-right] duration-300 ease-in-out"
      style={{
        marginRight: isPanelOpen && isDesktop ? '440px' : '0px',
      }}
    >
      {children}
    </div>
  );
}
