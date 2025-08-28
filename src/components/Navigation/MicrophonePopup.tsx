import React from 'react';
import { Mic, Plus, Settings, Volume2, VolumeX } from 'lucide-react';

interface MicrophonePopupProps {
  onClose: () => void;
}

export const MicrophonePopup: React.FC<MicrophonePopupProps> = ({ onClose }) => {
  const microphones = [
    { id: '1', name: 'Lokalny mikrofon', device: 'Built-in Microphone', active: true, muted: false },
    { id: '2', name: 'PC-Gaming (192.168.1.100)', device: 'Remote Audio', active: true, muted: true },
    { id: '3', name: 'PC-Streaming (192.168.1.101)', device: 'Remote Audio', active: false, muted: false },
    { id: '4', name: 'USB Mikrofon', device: 'USB Audio Device', active: true, muted: false }
  ];

  return (
    <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 w-80">
      <div className="p-4">
        <h3 className="text-white font-semibold flex items-center space-x-2 mb-3">
          <Mic size={16} />
          <span>Mikrofony</span>
        </h3>

        <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
          {microphones.map((mic) => (
            <div
              key={mic.id}
              className="flex items-center justify-between p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full ${mic.active ? 'bg-green-400' : 'bg-gray-500'}`} />
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{mic.name}</p>
                  <p className="text-gray-400 text-xs truncate">{mic.device}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  className={`p-1 rounded transition-colors ${
                    mic.muted 
                      ? 'text-red-400 hover:text-red-300' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={mic.muted ? 'Wyłącz wyciszenie' : 'Wycisz'}
                >
                  {mic.muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
                <button
                  className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                  title="Ustawienia"
                >
                  <Settings size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors flex items-center justify-center space-x-2">
            <Plus size={14} />
            <span>Dodaj zdalny mikrofon</span>
          </button>
          <div className="text-xs text-gray-400 text-center">
            Dodaj mikrofony z innych komputerów w sieci
          </div>
        </div>
      </div>
    </div>
  );
};