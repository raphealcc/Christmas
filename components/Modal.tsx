import React, { useEffect, useState } from 'react';
import { GiftAssignment } from '../types';
import { Sparkles, X, Gift } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: GiftAssignment | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, assignment }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-500" onClick={onClose} />

      <div className={`relative w-full max-w-xl transform transition-all duration-700 cubic-bezier(0.22, 1, 0.36, 1) ${showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        <div className="bg-[#080808] border border-christmas-gold/30 rounded-3xl p-8 md:p-12 text-center shadow-[0_0_80px_rgba(212,175,55,0.15)]">
          
          <button onClick={onClose} className="absolute top-6 right-6 text-christmas-gold/40 hover:text-white transition-colors">
            <X size={24} />
          </button>

          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Gift className="text-christmas-gold animate-bounce" size={48} />
              <div className="absolute inset-0 blur-xl bg-christmas-gold/20"></div>
            </div>
          </div>

          <p className="text-christmas-gold/60 font-sans tracking-[0.3em] text-xs uppercase mb-2">
            CONGRATULATIONS
          </p>
          <h2 className="text-2xl md:text-4xl font-display text-white mb-8 tracking-widest">
            {assignment.picker}
          </h2>

          <div className="h-[1px] w-12 mx-auto bg-christmas-gold/30 mb-8"></div>

          <p className="text-christmas-gold/60 font-sans tracking-[0.2em] text-xs uppercase mb-4">
            YOU RECEIVED A GIFT FROM
          </p>
          
          <div className="relative inline-block px-8 py-4 rounded-full bg-christmas-gold/5 border border-christmas-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
            <span className="text-3xl md:text-5xl font-sans font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              {assignment.provider}
            </span>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="text-christmas-gold animate-pulse" size={20} />
            </div>
          </div>

          <div className="mt-12 text-christmas-gold/30 text-[10px] tracking-widest font-mono uppercase">
            Merry Christmas & Happy Exchange
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;