import React, { useEffect, useState } from 'react';

interface SantaArrivalProps {
  onAnimationComplete: () => void;
}

const SantaArrival: React.FC<SantaArrivalProps> = ({ onAnimationComplete }) => {
  const [stage, setStage] = useState<'entry' | 'drop' | 'exit'>('entry');

  useEffect(() => {
    // Sequence timing
    const dropTimer = setTimeout(() => setStage('drop'), 1500); // Fly in time
    const completeTimer = setTimeout(() => {
      onAnimationComplete();
    }, 3000); // Total duration

    return () => {
      clearTimeout(dropTimer);
      clearTimeout(completeTimer);
    };
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Dark overlay to focus attention */}
      <div className="absolute inset-0 bg-black/60 animate-fade-in duration-500"></div>

      {/* Glowing Particle Santa Container */}
      <div className="relative w-full h-full">
        {/* The Santa Figure */}
        <div className="absolute top-1/3 w-[500px] h-[300px] animate-santa-fly">
           {/* Visual Representation of Particle Santa using CSS Filter & Blend Mode on an image that resembles the reference */}
           <img 
             src="https://img.freepik.com/premium-photo/golden-christmas-deer-black-background-magic-dust-generative-ai_170984-4786.jpg?w=1000" 
             alt="Golden Particle Santa"
             className="w-full h-full object-contain mix-blend-screen filter brightness-150 contrast-125 drop-shadow-[0_0_30px_rgba(212,175,55,0.8)]"
           />
           {/* Trailing Particles */}
           <div className="absolute top-1/2 left-0 w-full h-1 bg-transparent shadow-[0_0_50px_20px_rgba(212,175,55,0.4)]" />
        </div>

        {/* The Gift Drop */}
        {stage === 'drop' && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 animate-gift-drop">
             <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg rotate-12 shadow-[0_0_50px_rgba(255,215,0,0.8)] flex items-center justify-center">
                <div className="w-full h-4 bg-red-600 absolute top-1/2 -translate-y-1/2"></div>
                <div className="h-full w-4 bg-red-600 absolute left-1/2 -translate-x-1/2"></div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SantaArrival;