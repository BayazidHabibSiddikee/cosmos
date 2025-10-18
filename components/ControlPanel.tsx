
import React from 'react';
import { MotorDirection } from '../types';
import { ArrowUpIcon, ArrowDownIcon, StopIcon } from './icons';

interface ControlPanelProps {
  motorSpeed: number;
  setMotorSpeed: (speed: number) => void;
  motorDirection: MotorDirection;
  setMotorDirection: (direction: MotorDirection) => void;
  onEmergencyStop: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  motorSpeed,
  setMotorSpeed,
  motorDirection,
  setMotorDirection,
  onEmergencyStop,
}) => {
  const speedPercentage = Math.round((motorSpeed / 255) * 100);

  return (
    <>
        <h3 className="text-xl font-bold text-center text-white/90">Motor Control Panel</h3>
        <div className="flex justify-center items-center gap-4">
            <button
                onClick={() => setMotorDirection(MotorDirection.FORWARD)}
                className={`p-4 rounded-full transition-all duration-200 ${motorDirection === MotorDirection.FORWARD ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                aria-label="Move Forward"
            >
                <ArrowUpIcon className="w-8 h-8"/>
            </button>
            <button
                onClick={() => setMotorDirection(MotorDirection.STOP)}
                className={`p-4 rounded-full transition-all duration-200 ${motorDirection === MotorDirection.STOP ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                aria-label="Stop"
            >
                <StopIcon className="w-8 h-8"/>
            </button>
            <button
                onClick={() => setMotorDirection(MotorDirection.BACKWARD)}
                className={`p-4 rounded-full transition-all duration-200 ${motorDirection === MotorDirection.BACKWARD ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                aria-label="Move Backward"
            >
                <ArrowDownIcon className="w-8 h-8"/>
            </button>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                 <label htmlFor="speed-slider" className="text-sm font-medium text-white/80">Speed</label>
                 <span className="text-2xl font-bold text-red-400">{speedPercentage}%</span>
            </div>
            <input
                id="speed-slider"
                type="range"
                min="0"
                max="255"
                value={motorSpeed}
                onChange={(e) => setMotorSpeed(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
        </div>
        
        <div className="pt-2 flex-grow flex items-center justify-center">
            <button onClick={onEmergencyStop} className="group relative w-32 h-32 rounded-full bg-red-800/50 border-4 border-red-600 text-red-300 font-bold uppercase tracking-widest transition-all duration-300 hover:bg-red-600 hover:text-white hover:border-red-400 hover:scale-110">
                <span className="absolute inset-0 rounded-full border-2 border-red-700 animate-ping group-hover:animate-none"></span>
                E-Stop
            </button>
        </div>
        <p className="text-center text-xs text-white/30">ID: 2208053</p>
    </>
  );
};

export default ControlPanel;
