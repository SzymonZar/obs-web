import React, { useState } from 'react';
import { Wifi, Plus, Settings, Power, Trash2, WifiOff } from 'lucide-react';
import { WebSocketConnection } from '../../types';

interface WebSocketPopupProps {
  connections: WebSocketConnection[];
  onClose: () => void;
}

export const WebSocketPopup: React.FC<WebSocketPopupProps> = ({ connections, onClose }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConnection, setNewConnection] = useState({ name: '', url: '' });

  const handleAddConnection = () => {
    if (newConnection.name && newConnection.url) {
      // Add connection logic here
      setNewConnection({ name: '', url: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 w-96">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <Wifi size={16} />
            <span>Połączenia WebSocket</span>
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
            title="Dodaj połączenie"
          >
            <Plus size={14} />
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4 p-3 bg-gray-600 rounded-lg">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nazwa połączenia"
                value={newConnection.name}
                onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
              />
              <input
                type="text"
                placeholder="ws://localhost:4455"
                value={newConnection.url}
                onChange={(e) => setNewConnection({ ...newConnection, url: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddConnection}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                >
                  Dodaj
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="flex items-center justify-between p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full ${connection.connected ? 'bg-green-400' : 'bg-red-400'}`} />
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{connection.name}</p>
                  <p className="text-gray-400 text-xs truncate">{connection.url}</p>
                  {connection.lastPing && (
                    <p className="text-gray-500 text-xs">
                      Ping: {connection.lastPing.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  className={`p-1 rounded transition-colors ${
                    connection.connected 
                      ? 'text-green-400 hover:text-green-300' 
                      : 'text-gray-500 hover:text-gray-400'
                  }`}
                  title={connection.connected ? 'Rozłącz' : 'Połącz'}
                >
                  {connection.connected ? <WifiOff size={12} /> : <Wifi size={12} />}
                </button>
                <button
                  className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                  title="Ustawienia"
                >
                  <Settings size={12} />
                </button>
                <button
                  className="p-1 text-gray-400 hover:text-red-400 rounded transition-colors"
                  title="Usuń"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {connections.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            <Wifi size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Brak połączeń WebSocket</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-2 text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Dodaj pierwsze połączenie
            </button>
          </div>
        )}
      </div>
    </div>
  );
};