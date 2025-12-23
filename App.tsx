import React, { useState, useCallback, useMemo } from 'react';
import { generateGiftAssignments } from './utils/gameLogic';
import { GiftBoxState, GiftAssignment } from './types';
import { TOTAL_BOXES, PARTICIPANT_NAMES } from './constants';
import GiftGrid from './components/GiftGrid';
import ParticleBackground from './components/ParticleBackground';
import ThreeParticleReveal from './components/ThreeParticleReveal';
import Modal from './components/Modal';
import { RefreshCw, Play, User } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [hasStarted, setHasStarted] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // 核心分配逻辑：存储所有人对应的结果
  const [assignments, setAssignments] = useState<GiftAssignment[]>([]);
  const [boxes, setBoxes] = useState<GiftBoxState[]>([]);
  
  // 当前是谁在抽奖
  const [currentPickerIndex, setCurrentPickerIndex] = useState(0);

  // 动画与弹窗
  const [isRevealing, setIsRevealing] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState<GiftAssignment | null>(null);
  const [pendingBoxIndex, setPendingBoxIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Logic ---

  const handleStartApp = () => {
    setHasStarted(true);
    initializeGame();
  };

  const initializeGame = () => {
    // 1. 生成错位排列结果
    const results = generateGiftAssignments();
    setAssignments(results);

    // 2. 初始化盒子
    const initialBoxes: GiftBoxState[] = Array.from({ length: TOTAL_BOXES }, (_, i) => ({
      index: i,
      isOpened: false,
      assignment: null
    }));
    setBoxes(initialBoxes);
    
    // 3. 重置索引
    setCurrentPickerIndex(0);
    setInitialized(true);
    setIsModalOpen(false);
    setIsRevealing(false);
  };

  const handleBoxClick = useCallback((index: number) => {
    if (!initialized || isRevealing || currentPickerIndex >= PARTICIPANT_NAMES.length) return;

    // 当前抽奖人是谁
    // 注意：assignments 已经是打乱过的，我们只需要按顺序取出 assignment 即可
    const nextAssignment = assignments[currentPickerIndex];

    setPendingAssignment(nextAssignment);
    setPendingBoxIndex(index);
    setIsRevealing(true);
  }, [initialized, isRevealing, currentPickerIndex, assignments]);

  const handleRevealComplete = useCallback(() => {
    if (pendingBoxIndex === null || !pendingAssignment) return;

    // 记录结果并展示
    setBoxes(prev => prev.map(box => {
      if (box.index === pendingBoxIndex) {
        return { ...box, isOpened: true, assignment: pendingAssignment };
      }
      return box;
    }));

    setIsRevealing(false);
    setIsModalOpen(true);
    
    // 移动到下一个抽奖者
    setCurrentPickerIndex(prev => prev + 1);
  }, [pendingBoxIndex, pendingAssignment]);

  const currentPicker = useMemo(() => {
    // 根据原始名单顺序或者某种规则来确定谁在抽？
    // 为了公平，我们直接按 assignments 里的 picker 顺序来依次抽奖
    return assignments[currentPickerIndex]?.picker || "Finished";
  }, [assignments, currentPickerIndex]);

  // --- Render ---

  if (!hasStarted) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 text-center p-6 animate-fade-in-up">
          <h1 className="text-5xl md:text-8xl font-display text-transparent bg-clip-text bg-gradient-to-r from-christmas-gold via-white to-christmas-gold drop-shadow-[0_0_25px_rgba(212,175,55,0.6)] tracking-widest mb-8">
            LUXE NOËL
          </h1>
          <button 
            onClick={handleStartApp}
            className="group relative px-12 py-4 bg-transparent overflow-hidden rounded-full transition-all duration-500 border border-christmas-gold/50 hover:border-christmas-gold"
          >
            <div className="absolute inset-0 w-full h-full bg-christmas-gold/10 group-hover:bg-christmas-gold/20 transition-all duration-500"></div>
            <div className="relative flex items-center gap-3 text-christmas-gold font-display tracking-[0.3em] text-lg uppercase">
              <Play size={20} className="fill-current" />
              <span>Start Ritual</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col font-sans bg-black">
      <ParticleBackground />

      {isRevealing && <ThreeParticleReveal onAnimationComplete={handleRevealComplete} />}

      <header className="relative pt-10 pb-6 text-center z-10 px-4 animate-fade-in">
        <h1 className="text-3xl md:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-r from-christmas-gold via-white to-christmas-gold tracking-widest mb-2">
          LUXE NOËL
        </h1>
        <p className="text-christmas-gold/40 font-sans tracking-[0.4em] text-[10px] md:text-xs uppercase mb-6">
          Gift Exchange System v2.0
        </p>

        {/* Current Picker Info */}
        <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-christmas-gold/20 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <User size={16} className="text-christmas-gold" />
            <span className="text-christmas-gold/60 text-xs uppercase tracking-widest">Next Picker:</span>
          </div>
          <span className="text-xl md:text-2xl font-bold text-white tracking-wider">
            {currentPickerIndex < PARTICIPANT_NAMES.length ? currentPicker : "Exchange Complete!"}
          </span>
        </div>
      </header>

      <div className="flex justify-center gap-8 mb-4 z-20 items-center animate-fade-in">
        <div className="text-christmas-gold/30 text-[10px] tracking-[0.2em] font-mono">
          {PARTICIPANT_NAMES.length - currentPickerIndex} GIFTS REMAINING
        </div>
        <button onClick={initializeGame} className="text-christmas-gold/40 hover:text-christmas-gold transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>

      <main className="flex-grow z-10 pb-12">
        <GiftGrid boxes={boxes} onBoxClick={handleBoxClick} />
      </main>

      <footer className="w-full text-center py-4 z-10 opacity-20">
        <p className="text-christmas-gold text-[8px] font-mono tracking-widest uppercase">
          Safe Exchange Algorithm Enabled
        </p>
      </footer>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} assignment={pendingAssignment} />
    </div>
  );
};

export default App;