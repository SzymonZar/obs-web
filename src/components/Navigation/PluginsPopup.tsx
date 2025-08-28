import React, { useState } from 'react';
import { Puzzle, Plus, Settings, Power, Book, Code } from 'lucide-react';
import { PluginDocumentation } from '../Plugins/PluginDocumentation';

interface PluginsPopupProps {
  onClose: () => void;
}

export const PluginsPopup: React.FC<PluginsPopupProps> = ({ onClose }) => {
  const [showDocs, setShowDocs] = useState(false);
  
  const plugins = [
    { id: '1', name: 'TTS Reader', enabled: true, version: '1.2.0' },
    { id: '2', name: 'Chat Overlay', enabled: true, version: '2.1.5' },
    { id: '3', name: 'Stream Alerts', enabled: false, version: '1.0.3' },
    { id: '4', name: 'Audio Visualizer', enabled: true, version: '3.0.1' }
  ];

  if (showDocs) {
    return <PluginDocumentation onClose={() => setShowDocs(false)} />;
  }

  return (
    <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 w-80">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <Puzzle size={16} />
            <span>Wtyczki</span>
          </h3>
          <button
            onClick={() => setShowDocs(true)}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
            title="Dokumentacja"
          >
            <Book size={14} />
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
          {plugins.map((plugin) => (
            <div
              key={plugin.id}
              className="flex items-center justify-between p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${plugin.enabled ? 'bg-green-400' : 'bg-gray-500'}`} />
                <div>
                  <p className="text-white text-sm font-medium">{plugin.name}</p>
                  <p className="text-gray-400 text-xs">v{plugin.version}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  className={`p-1 rounded transition-colors ${
                    plugin.enabled 
                      ? 'text-green-400 hover:text-green-300' 
                      : 'text-gray-500 hover:text-gray-400'
                  }`}
                  title={plugin.enabled ? 'Wyłącz' : 'Włącz'}
                >
                  <Power size={12} />
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
            <span>Dodaj wtyczkę</span>
          </button>
          <button 
            onClick={() => setShowDocs(true)}
            className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition-colors flex items-center justify-center space-x-2"
          >
            <Code size={14} />
            <span>Dokumentacja API</span>
          </button>
        </div>
      </div>
    </div>
  );
};