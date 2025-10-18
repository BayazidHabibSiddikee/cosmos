
import React from 'react';
import { MicIcon, MicOffIcon } from './icons';

interface VoiceControlProps {
  isListening: boolean;
  toggleListen: () => void;
  voiceCommand: string;
  isSupported: boolean;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ isListening, toggleListen, voiceCommand, isSupported }) => {
  return (
    <div className="mt-auto pt-4 border-t border-white/10">
      <h3 className="text-lg font-bold text-center text-white/90 mb-2">Voice Control</h3>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleListen}
          disabled={!isSupported}
          className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
            ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-white/10 text-white/70 hover:bg-white/20'}
            ${!isSupported ? 'cursor-not-allowed bg-gray-600' : ''}
          `}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? <MicIcon className="w-8 h-8" /> : <MicOffIcon className="w-8 h-8" />}
        </button>
        <div className="w-full p-3 bg-black/40 rounded-lg text-white/70 italic min-h-[56px] flex items-center">
            <p>{voiceCommand}</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceControl;
