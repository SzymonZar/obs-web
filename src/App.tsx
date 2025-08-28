import React, { useState, useEffect } from 'react';
import { NavigationBar } from './components/Navigation/NavigationBar';
import { Header } from './components/Header/Header';
import { ScenesPanel } from './components/Scenes/ScenesPanel';
import { SourcesPanel } from './components/Sources/SourcesPanel';
import { PreviewArea } from './components/Preview/PreviewArea';
import { AudioMixer } from './components/Mixer/AudioMixer';
import { RecordingsPanel } from './components/Files/RecordingsPanel';
import { SettingsModal } from './components/Settings/SettingsModal';
import { useWebSocket } from './hooks/useWebSocket';
import { Scene, Source, SourceType, StreamStatus, AudioDevice, Recording, AudioTrack, DockPanel, Profile, SceneCollection, WebSocketConnection, SessionInfo } from './types';

function App() {
  // State management
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: '1',
      name: 'Main Scene',
      isActive: true,
      sources: []
    }
  ]);

  const [sources, setSources] = useState<Source[]>([]);
  const [activeSceneId, setActiveSceneId] = useState('1');
  const [previewMode, setPreviewMode] = useState<'program' | 'preview' | 'multiview' | 'studio'>('studio');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [studioModeEnabled, setStudioModeEnabled] = useState(true);

  const [dockPanels, setDockPanels] = useState<DockPanel[]>([
    { id: 'scenes', name: 'Sceny', visible: true, position: 'left', size: { width: 320, height: 400 }, minimized: false, floating: false },
    { id: 'sources', name: 'Źródła', visible: true, position: 'right', size: { width: 320, height: 400 }, minimized: false, floating: false },
    { id: 'mixer', name: 'Mikser Audio', visible: true, position: 'bottom', size: { width: 800, height: 200 }, minimized: false, floating: false },
    { id: 'recordings', name: 'Nagrania', visible: true, position: 'bottom', size: { width: 400, height: 200 }, minimized: false, floating: false }
  ]);

  const [profiles] = useState<Profile[]>([
    {
      id: '1',
      name: 'Streaming Profile',
      settings: {
        output: { bitrate: 3500, encoder: 'x264' },
        video: { resolution: '1920x1080', fps: 30 },
        audio: { sampleRate: 48000, channels: 'stereo' },
        stream: { service: 'Twitch', key: '' }
      },
      isActive: true,
      created: new Date('2024-01-01'),
      modified: new Date()
    },
    {
      id: '2',
      name: 'Recording Profile',
      settings: {
        output: { bitrate: 8000, encoder: 'hardware' },
        video: { resolution: '1920x1080', fps: 60 },
        audio: { sampleRate: 48000, channels: 'stereo' },
        stream: { service: 'Custom', key: '' }
      },
      isActive: false,
      created: new Date('2024-01-02'),
      modified: new Date()
    }
  ]);

  const [sceneCollections] = useState<SceneCollection[]>([
    {
      id: '1',
      name: 'Gaming Setup',
      scenes: scenes,
      isActive: true,
      created: new Date('2024-01-01'),
      modified: new Date()
    },
    {
      id: '2',
      name: 'Just Chatting',
      scenes: [
        { id: 'chat1', name: 'Webcam Only', isActive: false, sources: [] },
        { id: 'chat2', name: 'Webcam + Chat', isActive: false, sources: [] }
      ],
      isActive: false,
      created: new Date('2024-01-03'),
      modified: new Date()
    }
  ]);

  const [webSocketConnections] = useState<WebSocketConnection[]>([
    {
      id: '1',
      name: 'Local OBS',
      url: 'ws://localhost:4455',
      connected: false,
      lastPing: null,
      autoReconnect: true
    },
    {
      id: '2',
      name: 'Remote OBS',
      url: 'ws://192.168.1.100:4455',
      connected: false,
      lastPing: null,
      autoReconnect: false
    }
  ]);

  const [activeSessions] = useState<SessionInfo[]>([
    {
      id: '1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ipAddress: '192.168.1.50',
      connectedAt: new Date(Date.now() - 300000), // 5 minutes ago
      lastActivity: new Date(Date.now() - 30000), // 30 seconds ago
      permissions: ['view', 'control']
    }
  ]);

  const [streamStatus, setStreamStatus] = useState<StreamStatus>({
    isRecording: false,
    isStreaming: false,
    recordingTime: 0,
    streamingTime: 0,
    bitrate: 0,
    droppedFrames: 0,
    fps: 30
  });

  const [audioDevices] = useState<AudioDevice[]>([
    {
      id: '1',
      name: 'USB HDMI Audio',
      type: 'input',
      isDefault: true,
      monitoring: 'monitor_and_output'
    },
    {
      id: '2',
      name: 'Built-in Microphone',
      type: 'input',
      isDefault: false,
      monitoring: 'none'
    },
    {
      id: '3',
      name: 'HDMI Output',
      type: 'output',
      isDefault: true,
      monitoring: 'none'
    }
  ]);

  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: '1',
      filename: 'Stream_2024-01-15_20-30-45.mp4',
      duration: 3665,
      size: 1024 * 1024 * 850,
      date: new Date('2024-01-15T20:30:45'),
      format: 'MP4'
    },
    {
      id: '2',
      filename: 'Gameplay_2024-01-14_18-15-22.mp4',
      duration: 2140,
      size: 1024 * 1024 * 520,
      date: new Date('2024-01-14T18:15:22'),
      format: 'MP4'
    }
  ]);

  const [audioTracks] = useState<AudioTrack[]>([
    {
      id: 1,
      name: 'Stream Mix',
      enabled: true,
      sources: ['mic', 'desktop', 'game']
    },
    {
      id: 2,
      name: 'Microphone Only',
      enabled: true,
      sources: ['mic']
    },
    {
      id: 3,
      name: 'Desktop Audio',
      enabled: false,
      sources: ['desktop']
    },
    {
      id: 4,
      name: 'Game Audio',
      enabled: true,
      sources: ['game']
    },
    {
      id: 5,
      name: 'Music Only',
      enabled: false,
      sources: ['music']
    },
    {
      id: 6,
      name: 'Commentary',
      enabled: false,
      sources: ['mic', 'music']
    }
  ]);

  // WebSocket connection (for future OBS WebSocket integration)
  const { isConnected, sendMessage } = useWebSocket('ws://localhost:4455', false);

  // Timer for recording/streaming
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (streamStatus.isRecording || streamStatus.isStreaming) {
      interval = setInterval(() => {
        setStreamStatus(prev => ({
          ...prev,
          recordingTime: prev.isRecording ? prev.recordingTime + 1 : prev.recordingTime,
          streamingTime: prev.isStreaming ? prev.streamingTime + 1 : prev.streamingTime,
          bitrate: Math.floor(Math.random() * 1000) + 2500,
          fps: 30 + Math.floor(Math.random() * 5)
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [streamStatus.isRecording, streamStatus.isStreaming]);

  // Scene management
  const handleSceneSelect = (sceneId: string) => {
    setActiveSceneId(sceneId);
    setScenes(prev => prev.map(scene => ({
      ...scene,
      isActive: scene.id === sceneId
    })));
    
    // Update sources based on active scene
    const activeScene = scenes.find(s => s.id === sceneId);
    if (activeScene) {
      setSources(activeScene.sources);
    }

    sendMessage({
      type: 'SetCurrentScene',
      data: { sceneName: scenes.find(s => s.id === sceneId)?.name }
    });
  };

  const handleSceneAdd = () => {
    const newScene: Scene = {
      id: Date.now().toString(),
      name: `Scene ${scenes.length + 1}`,
      isActive: false,
      sources: []
    };
    setScenes(prev => [...prev, newScene]);
  };

  const handleSceneDelete = (sceneId: string) => {
    if (scenes.length <= 1) return;
    setScenes(prev => prev.filter(s => s.id !== sceneId));
    if (activeSceneId === sceneId) {
      const remainingScenes = scenes.filter(s => s.id !== sceneId);
      handleSceneSelect(remainingScenes[0].id);
    }
  };

  const handleSceneDuplicate = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;
    
    const newScene: Scene = {
      ...scene,
      id: Date.now().toString(),
      name: `${scene.name} Copy`,
      isActive: false
    };
    setScenes(prev => [...prev, newScene]);
  };

  const handleSceneRename = (sceneId: string, name: string) => {
    setScenes(prev => prev.map(scene =>
      scene.id === sceneId ? { ...scene, name } : scene
    ));
  };

  // Source management
  const handleSourceAdd = (type: SourceType, name: string) => {
    const newSource: Source = {
      id: Date.now().toString(),
      name,
      type,
      visible: true,
      locked: false,
      volume: 75,
      muted: false,
      properties: {}
    };
    
    setSources(prev => [...prev, newSource]);
    
    // Update the active scene's sources
    setScenes(prev => prev.map(scene =>
      scene.id === activeSceneId
        ? { ...scene, sources: [...scene.sources, newSource] }
        : scene
    ));
  };

  const handleSourceDelete = (sourceId: string) => {
    setSources(prev => prev.filter(s => s.id !== sourceId));
    setScenes(prev => prev.map(scene =>
      scene.id === activeSceneId
        ? { ...scene, sources: scene.sources.filter(s => s.id !== sourceId) }
        : scene
    ));
  };

  const handleSourceToggleVisibility = (sourceId: string) => {
    setSources(prev => prev.map(source =>
      source.id === sourceId ? { ...source, visible: !source.visible } : source
    ));
    
    sendMessage({
      type: 'SetSceneItemEnabled',
      data: { sceneItemId: sourceId, sceneItemEnabled: !sources.find(s => s.id === sourceId)?.visible }
    });
  };

  const handleSourceToggleMute = (sourceId: string) => {
    setSources(prev => prev.map(source =>
      source.id === sourceId ? { ...source, muted: !source.muted } : source
    ));
  };

  const handleSourceToggleLock = (sourceId: string) => {
    setSources(prev => prev.map(source =>
      source.id === sourceId ? { ...source, locked: !source.locked } : source
    ));
  };

  const handleSourceVolumeChange = (sourceId: string, volume: number) => {
    setSources(prev => prev.map(source =>
      source.id === sourceId ? { ...source, volume } : source
    ));
  };

  const handleDeviceToggleMonitoring = (deviceId: string) => {
    // Cycle through monitoring modes: none -> monitor -> monitor_and_output -> none
    // This would be implemented with actual audio device API
    console.log('Toggle monitoring for device:', deviceId);
  };

  // Recording management
  const handleRecordingDownload = (recordingId: string) => {
    const recording = recordings.find(r => r.id === recordingId);
    if (recording) {
      // Create a download link
      const link = document.createElement('a');
      link.href = '#'; // In real implementation, this would be the file URL
      link.download = recording.filename;
      link.click();
    }
  };

  const handleRecordingDelete = (recordingId: string) => {
    setRecordings(prev => prev.filter(r => r.id !== recordingId));
  };

  const handleRecordingPlay = (recordingId: string) => {
    const recording = recordings.find(r => r.id === recordingId);
    if (recording) {
      // Open in video player or preview
      console.log('Playing recording:', recording.filename);
    }
  };

  // Audio track management
  const handleTrackToggle = (trackId: number) => {
    // Toggle audio track enable/disable
    console.log('Toggle track:', trackId);
  };

  const handleToggleDock = (dockId: string) => {
    setDockPanels(prev => prev.map(dock =>
      dock.id === dockId ? { ...dock, visible: !dock.visible } : dock
    ));
  };

  const handleProfileChange = (profileId: string) => {
    console.log('Changing profile to:', profileId);
    // Profile change logic here
  };

  const handleSceneCollectionChange = (collectionId: string) => {
    console.log('Changing scene collection to:', collectionId);
    // Scene collection change logic here
  };

  // Studio mode transition
  const handleTransition = () => {
    // Perform transition from preview to program
    console.log('Performing transition');
  };

  // Recording/Streaming controls
  const handleStartRecording = () => {
    // Generate new recording entry
    const newRecording: Recording = {
      id: Date.now().toString(),
      filename: `Recording_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}.mp4`,
      duration: 0,
      size: 0,
      date: new Date(),
      format: 'MP4'
    };
    setRecordings(prev => [newRecording, ...prev]);
    
    setStreamStatus(prev => ({
      ...prev,
      isRecording: true,
      recordingTime: 0
    }));
    sendMessage({ type: 'StartRecord' });
  };

  const handleStopRecording = () => {
    setStreamStatus(prev => ({ ...prev, isRecording: false }));
    sendMessage({ type: 'StopRecord' });
  };

  const handleStartStreaming = () => {
    setStreamStatus(prev => ({
      ...prev,
      isStreaming: true,
      streamingTime: 0
    }));
    sendMessage({ type: 'StartStream' });
  };

  const handleStopStreaming = () => {
    setStreamStatus(prev => ({ ...prev, isStreaming: false }));
    sendMessage({ type: 'StopStream' });
  };

  const handleToggleStudioMode = () => {
    setStudioModeEnabled(!studioModeEnabled);
    if (!studioModeEnabled) {
      setPreviewMode('studio');
    } else {
      setPreviewMode('program');
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden vertical-layout">
      <NavigationBar
        onToggleDock={handleToggleDock}
        dockPanels={dockPanels}
        onOpenSettings={() => setIsSettingsOpen(true)}
        profiles={profiles}
        sceneCollections={sceneCollections}
        webSocketConnections={webSocketConnections}
        activeSessions={activeSessions}
        onProfileChange={handleProfileChange}
        onSceneCollectionChange={handleSceneCollectionChange}
      />
      
      <Header
        streamStatus={streamStatus}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onStartStreaming={handleStartStreaming}
        onStopStreaming={handleStopStreaming}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
      />

      <div className="flex flex-1 min-h-0 portrait-stack">
        {dockPanels.find(d => d.id === 'scenes')?.visible && (
          <div className="vertical-sidebar">
            <ScenesPanel
              scenes={scenes}
              activeSceneId={activeSceneId}
              onSceneSelect={handleSceneSelect}
              onScenePreview={() => {}}
              onSceneAdd={handleSceneAdd}
              onSceneDelete={handleSceneDelete}
              onSceneDuplicate={handleSceneDuplicate}
              onSceneRename={handleSceneRename}
            />
          </div>
        )}

        <div className="vertical-preview">
          <PreviewArea
            isRecording={streamStatus.isRecording}
            isStreaming={streamStatus.isStreaming}
            previewMode={previewMode}
            onPreviewModeChange={setPreviewMode}
            onResetTransform={() => {}}
            onTransition={handleTransition}
            studioModeEnabled={studioModeEnabled}
            onToggleStudioMode={handleToggleStudioMode}
          />
        </div>

        {dockPanels.find(d => d.id === 'sources')?.visible && (
          <div className="vertical-sidebar">
            <SourcesPanel
              sources={sources}
              onSourceAdd={handleSourceAdd}
              onSourceDelete={handleSourceDelete}
              onSourceToggleVisibility={handleSourceToggleVisibility}
              onSourceToggleMute={handleSourceToggleMute}
              onSourceToggleLock={handleSourceToggleLock}
              onSourceVolumeChange={handleSourceVolumeChange}
              onSourceSettings={() => {}}
              onSourceReorder={() => {}}
            />
          </div>
        )}
      </div>

      {dockPanels.find(d => d.id === 'mixer')?.visible && (
        <div className="vertical-mixer">
          <AudioMixer
            devices={audioDevices}
            audioTracks={audioTracks}
            onDeviceVolumeChange={() => {}}
            onDeviceToggleMute={() => {}}
            onDeviceToggleMonitoring={handleDeviceToggleMonitoring}
            onDeviceSettings={() => {}}
            onTrackToggle={handleTrackToggle}
          />
        </div>
      )}

      {dockPanels.find(d => d.id === 'recordings')?.visible && (
        <RecordingsPanel
          recordings={recordings}
          onDownload={handleRecordingDownload}
          onDelete={handleRecordingDelete}
          onPlay={handleRecordingPlay}
        />
      )}


      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Connection Status */}
      <div className="fixed bottom-4 left-4">
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
          isConnected 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-300' : 'bg-red-300'
          }`}></div>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
    </div>
  );
}

export default App;