import React from 'react';
import { GiftBoxState } from '../types';
import { Sparkles, Check } from 'lucide-react';

interface GiftGridProps {
  boxes: GiftBoxState[];
  onBoxClick: (index: number) => void;
}

const GiftGrid: React.FC<GiftGridProps> = ({ boxes, onBoxClick }) => {
  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto p-4 perspective-1000">
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-3 md:gap-4">
        {boxes.map((box) => (
          <button
            key={box.index}
            disabled={box.isOpened}
            onClick={() => onBoxClick(box.index)}
            className={`
              group relative aspect-square rounded-lg transition-all duration-500 transform-style-3d
              ${box.isOpened 
                ? 'cursor-default' 
                : 'cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]'
              }
            `}
          >
            <div className={`
              absolute inset-0 rounded-lg border border-christmas-gold/20 backdrop-blur-sm overflow-hidden
              ${box.isOpened 
                ? 'bg-black/80' 
                : 'bg-gradient-to-br from-christmas-red/20 to-transparent'
              }
            `}>
              
              {box.isOpened ? (
                <div className="h-full flex flex-col items-center justify-center animate-fade-in p-1">
                   <div className="text-christmas-gold/30 mb-1">
                    <Check size={12} />
                  </div>
                  <span className="font-sans text-[10px] md:text-xs text-christmas-gold/60 uppercase tracking-tighter">
                    From
                  </span>
                  <span className="font-sans text-xs md:text-sm text-white font-bold truncate w-full text-center">
                    {box.assignment?.provider}
                  </span>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center relative">
                  <Sparkles className="text-christmas-gold/40 group-hover:text-christmas-gold/80 transition-colors" size={20} />
                  <div className="absolute bottom-1 font-display text-[8px] text-christmas-gold/30 tracking-widest">
                    #{box.index + 1}
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GiftGrid;