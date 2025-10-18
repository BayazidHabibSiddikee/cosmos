import React from 'react';
import { CodeIcon } from './icons';

interface HeaderProps {
    onOpenCodeLibrary: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenCodeLibrary }) => (
  <header className="relative text-center p-4 text-white flex-shrink-0">
    <h1 className="text-5xl md:text-7xl font-bold tracking-wider text-shadow-red animate-pulse-slow">Cosmos</h1>
    <p className="text-red-500 text-lg md:text-xl mt-1">MTE, RUET</p>
    <p className="text-white/50 text-xs mt-2 tracking-widest">
      2208048 &bull; 2208049 &bull; 2208050 &bull; 2208051 &bull; 2208052 &bull; 2208053 &bull; 2208054
    </p>
    <button 
        onClick={onOpenCodeLibrary} 
        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        aria-label="Open Code Library"
    >
        <CodeIcon className="w-5 h-5" />
        <span className="hidden md:inline">Code Library</span>
    </button>
    <style>{`
      .text-shadow-red {
        text-shadow: 0 0 8px rgba(220, 38, 38, 0.7);
      }
      .animate-pulse-slow {
        animation: pulse-slow 5s infinite ease-in-out;
      }
      @keyframes pulse-slow {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.9;
            transform: scale(1.02);
        }
      }
    `}</style>
  </header>
);

export default Header;