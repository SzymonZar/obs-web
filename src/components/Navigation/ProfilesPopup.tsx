import React, { useState } from 'react';
import { User, Plus, Settings, Check, Database, Folder } from 'lucide-react';
import { Profile, SceneCollection } from '../../types';

interface ProfilesPopupProps {
  profiles: Profile[];
  sceneCollections: SceneCollection[];
  onProfileChange: (profileId: string) => void;
  onSceneCollectionChange: (collectionId: string) => void;
  onClose: () => void;
}

export const ProfilesPopup: React.FC<ProfilesPopupProps> = ({
  profiles,
  sceneCollections,
  onProfileChange,
  onSceneCollectionChange,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'collections'>('profiles');

  const activeProfile = profiles.find(p => p.isActive);
  const activeCollection = sceneCollections.find(c => c.isActive);

  return (
    <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 w-80">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex bg-gray-600 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'profiles' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('collections')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                activeTab === 'collections' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Kolekcje
            </button>
          </div>
          <button
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
            title="Dodaj nowy"
          >
            <Plus size={14} />
          </button>
        </div>

        {activeTab === 'profiles' ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <div className="mb-2 p-2 bg-blue-900 border border-blue-700 rounded">
              <div className="flex items-center space-x-2">
                <User size={14} className="text-blue-300" />
                <span className="text-blue-300 text-sm font-medium">
                  Aktywny: {activeProfile?.name || 'Brak'}
                </span>
              </div>
            </div>
            
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => onProfileChange(profile.id)}
                className="w-full flex items-center justify-between p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors text-left"
              >
                <div className="flex items-center space-x-2">
                  <User size={14} className="text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">{profile.name}</p>
                    <p className="text-gray-400 text-xs">
                      Utworzony: {profile.created.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {profile.isActive && <Check size={14} className="text-green-400" />}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <div className="mb-2 p-2 bg-purple-900 border border-purple-700 rounded">
              <div className="flex items-center space-x-2">
                <Database size={14} className="text-purple-300" />
                <span className="text-purple-300 text-sm font-medium">
                  Aktywna: {activeCollection?.name || 'Brak'}
                </span>
              </div>
            </div>
            
            {sceneCollections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => onSceneCollectionChange(collection.id)}
                className="w-full flex items-center justify-between p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors text-left"
              >
                <div className="flex items-center space-x-2">
                  <Folder size={14} className="text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">{collection.name}</p>
                    <p className="text-gray-400 text-xs">
                      {collection.scenes.length} scen • {collection.modified.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {collection.isActive && <Check size={14} className="text-green-400" />}
              </button>
            ))}
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-600 space-y-2">
          <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
            {activeTab === 'profiles' ? 'Nowy profil' : 'Nowa kolekcja'}
          </button>
          <button className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded transition-colors">
            {activeTab === 'profiles' ? 'Importuj profil' : 'Importuj kolekcję'}
          </button>
        </div>
      </div>
    </div>
  );
};