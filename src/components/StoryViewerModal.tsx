import React from 'react';
import { X } from 'lucide-react';
import { Story } from '../types';

interface StoryViewerModalProps {
  activeStory: Story | null;
  setActiveStory: (story: Story | null) => void;
  stories: Story[];
  storyProgress: number;
}

export default function StoryViewerModal({
  activeStory,
  setActiveStory,
  stories,
  storyProgress,
}: StoryViewerModalProps) {
  if (!activeStory) return null;

  const activeUserStories = stories.filter(s => s.username === activeStory.username);
  const currentSlideIndex = activeUserStories.findIndex(s => s.id === activeStory.id);

  const handleNextStory = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentSlideIndex !== -1 && currentSlideIndex < activeUserStories.length - 1) {
      setActiveStory(activeUserStories[currentSlideIndex + 1]);
    } else {
      setActiveStory(null);
    }
  };

  const handlePrevStory = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentSlideIndex > 0) {
      setActiveStory(activeUserStories[currentSlideIndex - 1]);
    }
  };

  return (
    <div id="story-viewer-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-2 select-none">
      <div className="w-full max-w-sm aspect-[9/16] relative rounded-2xl overflow-hidden bg-black flex flex-col justify-between p-4 shadow-2xl">
        {/* Story loading simulator lines */}
        <div className="absolute top-2 left-4 right-4 flex gap-1.5 z-30">
          {activeUserStories.map((story, idx) => {
            let progressWidth = '0%';
            if (idx < currentSlideIndex) {
              progressWidth = '100%';
            } else if (idx === currentSlideIndex) {
              progressWidth = `${storyProgress}%`;
            }
            return (
              <div key={story.id} className="h-1 bg-zinc-800/80 flex-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-75 ease-linear"
                  style={{ width: progressWidth }}
                />
              </div>
            );
          })}
        </div>

        {/* Gesture-like tap areas for next/prev stories */}
        <div 
          className="absolute inset-y-16 left-0 w-1/4 z-20 cursor-w-resize" 
          onClick={handlePrevStory} 
          title="Histoire précédente"
        />
        <div 
          className="absolute inset-y-16 right-0 w-1/4 z-20 cursor-e-resize" 
          onClick={handleNextStory} 
          title="Histoire suivante"
        />

        {/* Background Story Content */}
        <img 
          referrerPolicy="no-referrer"
          src={activeStory.mediaUrl || "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80"} 
          alt="Story Media Content" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 z-10" 
        />

        {/* Gradient shadow overlay for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 z-20" />

        {/* Header info */}
        <div className="z-30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-9 h-9 flex items-center justify-center select-none" style={{ filter: 'drop-shadow(0px 0px 4px rgba(220, 38, 38, 0.45))' }}>
              {/* Rotating expiring timer ring */}
              <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 36 36">
                <circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  className="stroke-zinc-800/50" 
                  strokeWidth="2.5"
                />
                <circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  className="stroke-red-600 transition-all duration-75" 
                  strokeWidth="2.5"
                  strokeDasharray="100.53"
                  strokeDashoffset={(storyProgress / 100) * 100.53}
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner Avatar Image */}
              <img 
                src={activeStory.avatar} 
                alt="Avatar" 
                className="w-7 h-7 rounded-full object-cover relative z-10" 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-none">@{activeStory.username}</span>
              <span className="text-[8px] font-mono text-zinc-400 mt-0.5 uppercase tracking-wider">
                Expire dans {Math.ceil((6000 - (storyProgress / 100) * 6000) / 1000)}s
              </span>
            </div>
          </div>
          <button 
            onClick={() => setActiveStory(null)}
            className="p-1 px-2.5 bg-black/45 hover:bg-zinc-800 rounded-lg text-white cursor-pointer z-35"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom response interactive bar */}
        <div className="z-30 space-y-2 mt-auto">
          <div className="text-center font-mono text-[10px] text-white/50 tracking-wide bg-black/50 py-1.5 rounded-xl">
            👀 Vu par vous et 2,400 autres membres
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder={`Répondre à ${activeStory.username}...`} 
              className="flex-1 bg-black/60 border border-zinc-700/60 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-red-500"
            />
            <button 
              onClick={() => {
                setActiveStory(null);
              }}
              className="p-1.5 bg-red-600 hover:bg-red-700 rounded-xl text-white transition-all text-xs px-3 font-semibold cursor-pointer"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
