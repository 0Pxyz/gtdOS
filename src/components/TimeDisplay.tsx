// components/TimeDisplay.tsx
'use client';

import { useEffect, useState } from 'react';

export default function TimeDisplay({ currentTheme }: { currentTheme: any }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <time className={currentTheme.timeClass}>
      {currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </time>
  );
}