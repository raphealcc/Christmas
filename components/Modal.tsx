import React, { useEffect, useState } from 'react';
import { ParticipantGroup } from '../types';
import { Sparkles, X, Star } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: ParticipantGroup | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, group }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop with dreamy blur */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Magical Card */}
      <div 
        className={`relative w-full max-w-2xl transform transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1)
          ${showContent ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-90'}
        `}
      >
        <div className="relative bg-[#050505] border border-christmas-gold/40 rounded-2xl shadow-[0_0_100px_rgba(212,175,55,0.2)] p-10 text-center overflow-hidden">
          
          {/* Moving sheen effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_2s_infinite]"></div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-christmas-gold/60 hover:text-white transition-colors z-20"
          >
            <X size={28} />
          </button>

          {/* Header */}
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
               <div className="relative">
                 <Sparkles className="text-christmas-gold animate-spin-slow" size={56} />
                 <div className="absolute inset-0 blur-lg bg-christmas-gold/40 rounded-full"></div>
               </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-display text-transparent bg-clip-text bg-gradient-to-b from-christmas-gold to-yellow-700 mb-4 tracking-widest uppercase drop-shadow-sm">
              Magic Revealed
            </h2>
          </div>

          {/* The Revealed Names */}
          <div className="flex flex-wrap justify-center gap-8 my-10 relative z-10">
            {group.members.map((memberName, idx) => (
              <div 
                key={idx} 
                className="relative group perspective-500"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Glowing Orb Container */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-christmas-gold/50 bg-gradient-to-b from-black to-[#1a1a1a] flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.3)] animate-float">
                  
                  {/* Particles around orb */}
                  <div className="absolute -inset-2 border border-christmas-gold/20 rounded-full animate-pulse-gold"></div>
                  
                  <span className="font-sans font-bold text-2xl md:text-3xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] px-2 text-center break-words">
                    {memberName}
                  </span>
                </div>
                
                {/* Decoration under name */}
                <div className="mt-4 flex justify-center text-christmas-gold/60">
                  <Star size={16} fill="currentColor" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="relative z-10 inline-flex items-center gap-2 px-6 py-2 rounded-full border border-christmas-gold/20 bg-christmas-gold/5 text-christmas-goldLight text-sm font-sans tracking-[0.2em] uppercase">
            {group.type === 'triplet' ? 'The Golden Trio' : 'Destined Pair'}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Modal;