import React, { useState, useEffect, useCallback } from 'react';
import { generateGamePool } from './utils/gameLogic';
import { GiftBoxState, ParticipantGroup } from './types';
import { TOTAL_BOXES } from './constants';
import GiftGrid from './components/GiftGrid';
import ParticleBackground from './components/ParticleBackground';
import ThreeParticleReveal from './components/ThreeParticleReveal';
import Modal from './components/Modal';
import { RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [initialized, setInitialized] = useState(false);
  const [groupPool, setGroupPool] = useState<ParticipantGroup[]>([]);
  const [boxes, setBoxes] = useState<GiftBoxState[]>([]);
  
  // Animation & Flow State
  const [isRevealing, setIsRevealing] = useState(false);
  const [pendingGroup, setPendingGroup] = useState<ParticipantGroup | null>(null);
  const [pendingBoxIndex, setPendingBoxIndex] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<ParticipantGroup | null>(null);

  // --- Logic ---

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const pool = generateGamePool();
    setGroupPool(pool);

    const initialBoxes: GiftBoxState[] = Array.from({ length: TOTAL_BOXES }, (_, i) => ({
      index: i,
      isOpened: false,
      assignedGroup: null
    }));
    setBoxes(initialBoxes);
    
    setInitialized(true);
    setIsModalOpen(false);
    setCurrentGroup(null);
    setIsRevealing(false);
  };

  const handleBoxClick = useCallback((index: number) => {
    if (!initialized || groupPool.length === 0 || isRevealing) return;

    // 1. Select the group logic
    const newPool = [...groupPool];
    const groupToReveal = newPool.pop();
    if (!groupToReveal) return;

    // 2. Lock interaction and start 3D Reveal
    setGroupPool(newPool);
    setPendingGroup(groupToReveal);
    setPendingBoxIndex(index);
    setIsRevealing(true);

  }, [groupPool, initialized, isRevealing]);

  const handleRevealComplete = useCallback(() => {
    if (pendingBoxIndex === null || !pendingGroup) return;

    // 3. Reveal the box content in state (so it shows opened behind modal)
    setBoxes(prev => prev.map(box => {
      if (box.index === pendingBoxIndex) {
        return {
          ...box,
          isOpened: true,
          assignedGroup: pendingGroup
        };
      }
      return box;
    }));

    // 4. Stop 3D animation and Open the result modal
    setIsRevealing(false);
    setCurrentGroup(pendingGroup);
    setIsModalOpen(true);
    
    // Cleanup pending
    setPendingGroup(null);
    setPendingBoxIndex(null);
  }, [pendingBoxIndex, pendingGroup]);

  // --- Render ---

  if (!initialized) return <div className="min-h-screen bg-black flex items-center justify-center text-christmas-gold font-display animate-pulse">Summoning Holiday Spirit...</div>;

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col font-sans selection:bg-christmas-gold selection:text-black bg-black">
      
      {/* Background Ambience */}
      <ParticleBackground />

      {/* 3D Particle Reveal Overlay - Only mounted when revealing */}
      {isRevealing && (
        <ThreeParticleReveal onAnimationComplete={handleRevealComplete} />
      )}

      {/* Header */}
      <header className="relative pt-12 pb-8 text-center z-10 px-4 pointer-events-none">
        <h1 className="text-4xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-r from-christmas-gold via-white to-christmas-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] tracking-widest mb-4">
          LUXE NOËL
        </h1>
        <div className="h-[1px] w-24 mx-auto bg-christmas-gold/50 mb-4"></div>
        <p className="text-christmas-gold/60 font-sans tracking-[0.3em] text-xs md:text-sm uppercase">
          Interactive Gift Exchange
        </p>
      </header>

      {/* Controls */}
      <div className="flex justify-center gap-8 mb-4 z-20">
        {groupPool.length === 0 ? (
          <button 
            onClick={initializeGame}
            className="flex items-center gap-2 px-6 py-2 rounded-full border border-christmas-gold/40 text-christmas-gold hover:bg-christmas-gold hover:text-black transition-all duration-300 uppercase tracking-widest text-xs"
          >
            <RefreshCw size={14} />
            <span>New Ritual</span>
          </button>
        ) : (
          <div className="text-christmas-gold/40 text-xs tracking-widest font-mono">
            {groupPool.length} MYSTERIES REMAIN
          </div>
        )}
      </div>

      {/* Main Grid */}
      <main className="flex-grow z-10 pb-20">
        <GiftGrid boxes={boxes} onBoxClick={handleBoxClick} />
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 z-10 opacity-30">
        <p className="text-christmas-gold text-[10px] font-mono tracking-widest">
          DESIGNED FOR THE HOLIDAYS
        </p>
      </footer>

      {/* Modal Overlay */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        group={currentGroup} 
      />
    </div>
  );
};

export default App;