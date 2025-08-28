import React, { useState } from 'react';
import { HelpCircle, Book, Keyboard, Info, ExternalLink, MessageCircle } from 'lucide-react';

interface HelpPopupProps {
  onClose: () => void;
}

export const HelpPopup: React.FC<HelpPopupProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState('shortcuts');

  const shortcuts = [
    { key: 'Ctrl + R', action: 'Rozpocznij/zatrzymaj nagrywanie' },
    { key: 'Ctrl + S', action: 'Rozpocznij/zatrzymaj stream' },
    { key: 'Ctrl + T', action: 'Przełącz tryb studio' },
    { key: 'Ctrl + F', action: 'Pełny ekran podglądu' },
    { key: 'Ctrl + M', action: 'Wycisz/wyłącz wyciszenie' },
    { key: 'Ctrl + 1-9', action: 'Przełącz scenę (1-9)' },
    { key: 'Space', action: 'Wykonaj przejście (tryb studio)' },
    { key: 'Ctrl + D', action: 'Duplikuj zaznaczoną scenę' },
    { key: 'Delete', action: 'Usuń zaznaczony element' },
    { key: 'Ctrl + Z', action: 'Cofnij' },
    { key: 'Ctrl + Y', action: 'Ponów' }
  ];

  return (
    <div className="absolute top-full right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 w-96">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <HelpCircle size={16} />
            <span>Pomoc i wsparcie</span>
          </h3>
        </div>

        <div className="flex bg-gray-600 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveSection('shortcuts')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              activeSection === 'shortcuts' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Skróty
          </button>
          <button
            onClick={() => setActiveSection('about')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              activeSection === 'about' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            O programie
          </button>
        </div>

        {activeSection === 'shortcuts' ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <div className="flex items-center space-x-2 mb-2">
              <Keyboard size={14} className="text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Skróty klawiszowe</span>
            </div>
            
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-600 rounded"
              >
                <span className="text-gray-300 text-sm">{shortcut.action}</span>
                <kbd className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded font-mono">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <Info size={14} className="text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">OBS Web Studio</span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Wersja:</strong> 2.0.0</p>
              <p><strong>Platform:</strong> Orange Pi 5+ ARM64</p>
              <p><strong>System:</strong> Ubuntu Server 22.04+</p>
              <p><strong>Node.js:</strong> 20.x</p>
              <p><strong>OBS Studio:</strong> 30.0.2</p>
            </div>

            <div className="pt-3 border-t border-gray-600 space-y-2">
              <button className="w-full flex items-center justify-between p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors text-left">
                <div className="flex items-center space-x-2">
                  <Book size={14} className="text-green-400" />
                  <span className="text-white text-sm">Dokumentacja</span>
                </div>
                <ExternalLink size={12} className="text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors text-left">
                <div className="flex items-center space-x-2">
                  <MessageCircle size={14} className="text-blue-400" />
                  <span className="text-white text-sm">GitHub Issues</span>
                </div>
                <ExternalLink size={12} className="text-gray-400" />
              </button>
            </div>

            <div className="pt-3 border-t border-gray-600">
              <p className="text-xs text-gray-400 text-center">
                © 2024 OBS Web Studio<br />
                Stworzony dla Orange Pi 5+
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};