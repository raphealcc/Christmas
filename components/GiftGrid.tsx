import React from 'react';
import { GiftBoxState } from '../types';
import { Sparkles, Check } from 'lucide-react';

interface GiftGridProps {
  boxes: GiftBoxState[];
  onBoxClick: (index: number) => void;
}

const GiftGrid: React.FC<GiftGridProps> = ({ boxes, onBoxClick }) => {
  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto p-6 perspective-1000">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 md:gap-8">
        {boxes.map((box) => (
          <button
            key={box.index}
            disabled={box.isOpened}
            onClick={() => onBoxClick(box.index)}
            className={`
              group relative aspect-square rounded-xl transition-all duration-700 transform-style-3d
              ${box.isOpened 
                ? 'cursor-default opacity-80' 
                : 'cursor-pointer hover:scale-105 hover:rotate-y-12'
              }
            `}
          >
            {/* Box visual container */}
            <div className={`
              absolute inset-0 rounded-xl border border-christmas-gold/30 backdrop-blur-sm shadow-2xl overflow-hidden
              ${box.isOpened 
                ? 'bg-black/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]' 
                : 'bg-gradient-to-br from-christmas-red/40 via-christmas-red/10 to-transparent shadow-[0_0_30px_rgba(114,14,30,0.3)] group-hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]'
              }
            `}>
              
              {box.isOpened ? (
                // OPENED STATE: Simple elegant text
                <div className="h-full flex flex-col items-center justify-center animate-fade-in-up px-1">
                  <div className="text-christmas-gold/50 mb-1">
                    <Check size={16} />
                  </div>
                   <div className="flex flex-col items-center gap-1 w-full">
                     {box.assignedGroup?.members.map((m, idx) => (
                       <span key={idx} className="font-sans text-sm md:text-base text-christmas-goldLight font-bold drop-shadow-md truncate w-full text-center">
                         {m}
                       </span>
                     ))}
                   </div>
                </div>
              ) : (
                // CLOSED STATE: Magical Artifact Look
                <div className="h-full flex flex-col items-center justify-center relative">
                  {/* Internal Glow */}
                  <div className="absolute inset-0 bg-christmas-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Floating Particles inside box */}
                  <div className="absolute w-1 h-1 bg-white rounded-full top-1/4 left-1/4 animate-pulse"></div>
                  <div className="absolute w-1 h-1 bg-gold rounded-full bottom-1/4 right-1/4 animate-pulse delay-75"></div>

                  <Sparkles className="text-christmas-gold/70 group-hover:text-white transition-colors duration-300 animate-pulse-gold" size={32} />
                  
                  {/* Number Badge */}
                  <div className="absolute bottom-2 font-display text-xs text-christmas-gold/40 tracking-[0.2em]">
                    BOX {box.index + 1}
                  </div>
                </div>
              )}

              {/* Borders */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-christmas-gold/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-christmas-gold/50 to-transparent"></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GiftGrid;