import React, { useEffect, useState } from 'react';

const Snowfall: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; duration: number; delay: number; size: number }>>([]);

  useEffect(() => {
    // Generate static configuration for snowflakes to avoid constant re-renders logic
    const flakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      duration: Math.random() * 10 + 10, // 10s to 20s
      delay: Math.random() * 10, // 0s to 10s
      size: Math.random() * 0.5 + 0.2, // scale
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-[-10px] bg-white rounded-full opacity-60 animate-snow"
          style={{
            left: `${flake.left}%`,
            width: '8px',
            height: '8px',
            animationDuration: `${flake.duration}s`,
            animationDelay: `-${flake.delay}s`,
            transform: `scale(${flake.size})`,
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;