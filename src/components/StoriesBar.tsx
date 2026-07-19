import React from 'react';
import { Plus } from 'lucide-react';
import { Story } from '../types';

interface StoriesBarProps {
  groupedStories: Array<{
    username: string;
    avatar: string;
    items: Story[];
  }>;
  setActiveStory: (story: Story) => void;
  setShowCreateStoryModal: (open: boolean) => void;
  setStoryStep: (step: number) => void;
  isDark: boolean;
}

export default function StoriesBar({
  groupedStories,
  setActiveStory,
  setShowCreateStoryModal,
  setStoryStep,
  isDark,
}: StoriesBarProps) {
  return (
    <div className={`px-4 pt-4 pb-2 border-b ${isDark ? 'border-zinc-900' : 'border-zinc-100'}`}>
      <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {groupedStories.map(group => {
          const hasMyColGroup = group.username === 'Vous';
          const hasStories = group.items.length > 0;
          
          return (
            <div 
              key={group.username} 
              id={`story-bubble-${group.username}`}
              onClick={() => {
                if (hasStories) {
                  setActiveStory(group.items[0]);
                } else if (hasMyColGroup) {
                  setShowCreateStoryModal(true); 
                  setStoryStep(1);
                }
              }}
              className="flex flex-col items-center flex-shrink-0 space-y-1 group select-none cursor-pointer"
            >
              <div className={`w-13 h-13 rounded-full p-0.5 relative transition-transform duration-200 group-hover:scale-105 active:scale-95 ${
                hasStories 
                  ? 'bg-gradient-to-tr from-[#FF2D55] via-red-500 to-amber-500 border-2 border-transparent' 
                  : 'border-2 border-zinc-700'
              }`}>
                <img 
                  referrerPolicy="no-referrer"
                  src={group.avatar} 
                  alt={group.username} 
                  className="w-full h-full object-cover rounded-full bg-zinc-900" 
                />
                {hasMyColGroup && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents playing
                      setShowCreateStoryModal(true); 
                      setStoryStep(1);
                    }}
                    className="absolute bottom-0 right-0 bg-[#FF2D55] rounded-full border border-black p-0.5 hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                    title="Ajouter une story"
                  >
                     <Plus className="w-3.5 h-3.5 text-white font-black" />
                  </div>
                )}
              </div>
              <span className="text-[10px] tracking-tight text-zinc-400 font-sans">
                {hasMyColGroup ? 'Ma Story' : group.username}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
