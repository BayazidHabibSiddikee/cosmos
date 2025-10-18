import React from 'react';
import { ConnectionType, BoardType, DriverType, ConnectionStatus } from '../types';
import { WifiIcon, BluetoothIcon } from './icons';

interface ConnectionPanelProps {
  connectionStatus: ConnectionStatus;
  connectionType: ConnectionType;
  setConnectionType: (type: ConnectionType) => void;
  boardType: BoardType;
  setBoardType: (type: BoardType) => void;
  driverType: DriverType;
  setDriverType: (type: DriverType) => void;
  onConnect: () => void;
  wifiAddress: string;
  setWifiAddress: (address: string) => void;
}

const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  connectionStatus,
  connectionType,
  setConnectionType,
  boardType,
  setBoardType,
  driverType,
  setDriverType,
  onConnect,
  wifiAddress,
  setWifiAddress,
}) => {
  const statusStyles: { [key in ConnectionStatus]: { text: string, bg: string, ring: string, dot: string } } = {
    [ConnectionStatus.CONNECTED]: { text: 'text-green-400', bg: 'bg-green-500/10', ring: 'ring-green-500/30', dot: 'bg-green-500' },
    [ConnectionStatus.DISCONNECTED]: { text: 'text-gray-400', bg: 'bg-gray-500/10', ring: 'ring-gray-500/30', dot: 'bg-gray-500' },
    [ConnectionStatus.CONNECTING]: { text: 'text-blue-400', bg: 'bg-blue-500/10', ring: 'ring-blue-500/30', dot: 'bg-blue-500 animate-pulse' },
    [ConnectionStatus.FAILED]: { text: 'text-red-400', bg: 'bg-red-500/10', ring: 'ring-red-500/30', dot: 'bg-red-500' },
  };
  
  const currentStatusStyle = statusStyles[connectionStatus];

  return (
    <>
      <div className={`flex items-center justify-between p-3 rounded-lg ${currentStatusStyle.bg} ring-1 ring-inset ${currentStatusStyle.ring}`}>
        <p className={`font-medium ${currentStatusStyle.text} text-sm`}>
          Status: {connectionStatus}
          {connectionStatus === ConnectionStatus.CONNECTED && ` via ${connectionType}`}
          {connectionStatus === ConnectionStatus.CONNECTED && connectionType === ConnectionType.BLUETOOTH && ` to "ESP32_BT_Motor"`}
        </p>
        <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className={`absolute inline-flex h-full w-full rounded-full ${currentStatusStyle.dot} opacity-75 ${connectionStatus === ConnectionStatus.CONNECTING ? 'animate-ping' : ''}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${currentStatusStyle.dot}`}></span>
            </span>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-white/80">Connection Mode</label>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setConnectionType(ConnectionType.WIFI)} className={`flex items-center justify-center gap-2 p-3 rounded-md transition-all duration-200 ${connectionType === ConnectionType.WIFI ? 'bg-red-600 ring-2 ring-red-400' : 'bg-white/5 hover:bg-white/10'}`}>
            <WifiIcon className="w-5 h-5" /> Wi-Fi
          </button>
          <button onClick={() => setConnectionType(ConnectionType.BLUETOOTH)} className={`flex items-center justify-center gap-2 p-3 rounded-md transition-all duration-200 ${connectionType === ConnectionType.BLUETOOTH ? 'bg-red-600 ring-2 ring-red-400' : 'bg-white/5 hover:bg-white/10'}`}>
            <BluetoothIcon className="w-5 h-5" /> Bluetooth
          </button>
        </div>
      </div>

      {connectionType === ConnectionType.WIFI && (
        <div className="space-y-2">
          <label htmlFor="wifi-address" className="block text-sm font-medium text-white/80">
            Board IP Address
          </label>
          <input
            type="text"
            id="wifi-address"
            value={wifiAddress}
            onChange={(e) => setWifiAddress(e.target.value)}
            className="w-full bg-black/50 border border-white/20 rounded-md p-2 focus:ring-red-500 focus:border-red-500 transition"
            placeholder="e.g., 192.168.1.100"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="board-select" className="block text-sm font-medium text-white/80">
          Board Type
        </label>
        <select
          id="board-select"
          value={boardType}
          onChange={(e) => setBoardType(e.target.value as BoardType)}
          className="w-full bg-black/50 border border-white/20 rounded-md p-2 focus:ring-red-500 focus:border-red-500 transition"
        >
          <option>{BoardType.ESP32}</option>
          <option>{BoardType.UNO}</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="driver-select" className="block text-sm font-medium text-white/80">
          Motor Driver
        </label>
        <select
          id="driver-select"
          value={driverType}
          onChange={(e) => setDriverType(e.target.value as DriverType)}
          className="w-full bg-black/50 border border-white/20 rounded-md p-2 focus:ring-red-500 focus:border-red-500 transition"
        >
          <option>{DriverType.L298N}</option>
          <option>{DriverType.CUSTOM}</option>
        </select>
      </div>

      <button
        onClick={onConnect}
        disabled={connectionStatus === ConnectionStatus.CONNECTING}
        className="w-full py-3 text-lg font-bold bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed disabled:text-white/50 transition-colors duration-300 transform hover:scale-105"
      >
        {connectionStatus === ConnectionStatus.CONNECTED ? 'Disconnect' : (connectionStatus === ConnectionStatus.CONNECTING ? 'Connecting...' : 'Connect')}
      </button>
    </>
  );
};

export default ConnectionPanel;