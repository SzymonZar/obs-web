import React from 'react';
import { Volume2, VolumeX, Settings, Headphones, Monitor, Mic, Music } from 'lucide-react';
import { AudioDevice, AudioTrack } from '../../types';

interface AudioMixerProps {
  devices: AudioDevice[];
  audioTracks: AudioTrack[];
  onDeviceVolumeChange: (deviceId: string, volume: number) => void;
  onDeviceToggleMute: (deviceId: string) => void;
  onDeviceToggleMonitoring: (deviceId: string) => void;
  onDeviceSettings: (deviceId: string) => void;
  onTrackToggle: (trackId: number) => void;
}

export const AudioMixer: React.FC<AudioMixerProps> = ({
  devices,
  audioTracks,
  onDeviceVolumeChange,
  onDeviceToggleMute,
  onDeviceToggleMonitoring,
  onDeviceSettings,
  onTrackToggle
}) => {
  const getMonitoringIcon = (monitoring: string) => {
    switch (monitoring) {
      case 'monitor':
        return <Monitor size={14} className="text-yellow-400" />;
      case 'monitor_and_output':
        return <Headphones size={14} className="text-green-400" />;
      default:
        return <VolumeX size={14} className="text-gray-500" />;
    }
  };

  const getMonitoringTitle = (monitoring: string) => {
    switch (monitoring) {
      case 'monitor':
        return 'Monitor Only';
      case 'monitor_and_output':
        return 'Monitor and Output';
      default:
        return 'Monitor Off';
    }
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Audio Mixer</h3>
        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
          <Settings size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {devices.map((device) => (
          <div key={device.id} className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="text-lg">
                  {device.type === 'input' ? '🎤' : '🔊'}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {device.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {device.type === 'input' ? 'Input' : 'Output'}
                    {device.isDefault && ' (Default)'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => onDeviceToggleMute(device.id)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                  title="Mute/Unmute"
                >
                  <VolumeX size={14} />
                </button>
                <button
                  onClick={() => onDeviceToggleMonitoring(device.id)}
                  className="p-1.5 hover:bg-gray-600 rounded transition-colors"
                  title={getMonitoringTitle(device.monitoring)}
                >
                  {getMonitoringIcon(device.monitoring)}
                </button>
                <button
                  onClick={() => onDeviceSettings(device.id)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                  title="Settings"
                >
                  <Settings size={14} />
                </button>
              </div>
            </div>

            {/* Volume Slider */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Volume2 size={14} className="text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="75"
                  className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none slider"
                  onChange={(e) => onDeviceVolumeChange(device.id, parseInt(e.target.value))}
                />
                <span className="text-gray-400 text-xs w-8 text-right">75%</span>
              </div>

              {/* VU Meter */}
              <div className="h-2 bg-gray-600 rounded-lg overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg transition-all duration-75"
                  style={{ width: `${Math.random() * 60 + 20}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}

        {/* Master Volume */}
        <div className="bg-gray-700 rounded-lg p-3 border-2 border-blue-500">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="text-lg">🎛️</div>
              <div>
                <p className="text-white text-sm font-medium">Master</p>
                <p className="text-gray-400 text-xs">Output Mix</p>
              </div>
            </div>
            <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors">
              <Settings size={14} />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Volume2 size={14} className="text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="80"
                className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none slider"
              />
              <span className="text-gray-400 text-xs w-8 text-right">80%</span>
            </div>

            <div className="h-3 bg-gray-600 rounded-lg overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg transition-all duration-75"
                style={{ width: `${Math.random() * 70 + 10}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* VOD Audio Tracks Section */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold">Twitch VOD Audio Tracks</h4>
          <div className="text-xs text-gray-400">
            Track 1: Stream + VOD | Tracks 2-6: VOD Only
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {audioTracks.map((track) => (
            <div
              key={track.id}
              className={`p-3 rounded-lg border-2 transition-all ${
                track.enabled 
                  ? 'bg-blue-900 border-blue-500' 
                  : 'bg-gray-700 border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-sm">
                    Track {track.id}
                  </span>
                  {track.id === 1 && (
                    <span className="text-xs bg-red-600 text-white px-1 rounded">
                      LIVE
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <p className="text-gray-300 text-xs font-medium mb-1">{track.name}</p>
                <p className="text-gray-400 text-xs">
                  {track.sources.length} source{track.sources.length !== 1 ? 's' : ''}
                </p>
              </div>

              <button
                onClick={() => onTrackToggle(track.id)}
                className={`w-full flex items-center justify-center space-x-2 py-2 px-3 rounded text-xs font-medium transition-colors ${
                  track.enabled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                }`}
              >
                {track.enabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                <span>{track.enabled ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};