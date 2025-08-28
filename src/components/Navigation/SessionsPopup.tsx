import React from 'react';
import { Users, Monitor, Smartphone, Tablet, X } from 'lucide-react';
import { SessionInfo } from '../../types';

interface SessionsPopupProps {
  sessions: SessionInfo[];
  onClose: () => void;
}

export const SessionsPopup: React.FC<SessionsPopupProps> = ({ sessions, onClose }) => {
  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile')) return <Smartphone size={14} />;
    if (userAgent.includes('Tablet')) return <Tablet size={14} />;
    return <Monitor size={14} />;
  };

  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Teraz';
    if (minutes < 60) return `${minutes}min temu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h temu`;
    return date.toLocaleDateString();
  };

  return (
    <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 w-96">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <Users size={16} />
            <span>Aktywne sesje ({sessions.length})</span>
          </h3>
          <div className="text-xs text-gray-400">
            Max. 1 sesja na panel
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="text-blue-400">
                  {getDeviceIcon(session.userAgent)}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium">
                    {session.ipAddress}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {session.userAgent.split(' ')[0]} • {formatLastActivity(session.lastActivity)}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Połączono: {session.connectedAt.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex flex-wrap gap-1">
                  {session.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-1.5 py-0.5 bg-blue-900 text-blue-300 text-xs rounded"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
                <button
                  className="p-1 text-gray-400 hover:text-red-400 rounded transition-colors"
                  title="Rozłącz sesję"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            <Users size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Brak aktywnych sesji</p>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-600">
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Każdy panel może mieć maksymalnie 1 aktywną sesję</p>
            <p>• Nowe połączenie rozłączy poprzednie</p>
            <p>• Sesje wygasają po 30 min nieaktywności</p>
          </div>
        </div>
      </div>
    </div>
  );
};