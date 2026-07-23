import React from 'react';
import { Flame, MessageCircle, Share2 } from 'lucide-react';
import { Post } from '../types';
import { isVerifiedAccount, VerifiedBadge } from './VerifiedBadge';

interface PostCardProps {
  key?: any;
  post: Post;
  handleLike: (postId: string) => void;
  handleVote: (postId: string, optionId: number) => void;
  votedPolls: Record<string, number>;
  isDark: boolean;
  cardBg: string;
}

export default function PostCard({
  post,
  handleLike,
  handleVote,
  votedPolls,
  isDark,
  cardBg,
}: PostCardProps) {
  return (
    <article id={`post-card-${post.id}`} className={`p-4 sm:p-5 rounded-[22px] sm:rounded-3xl border ${cardBg} shadow-sm space-y-3 sm:space-y-4`}>
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <img 
            src={post.avatar} 
            alt={post.author} 
            className="w-10 h-10 rounded-full object-cover border border-red-500/20" 
          />
          <div>
            <h4 className="text-xs font-bold flex items-center gap-1.5">
              {post.author}
              {isVerifiedAccount(post.username) && <VerifiedBadge size={17} />}
            </h4>
            <p className="text-[10px] text-zinc-500">@{post.username} • {post.time}</p>
          </div>
        </div>
      </div>

      {/* Post body */}
      <p className="text-xs leading-relaxed text-zinc-350">{post.text}</p>

      {/* Display image if present */}
      {post.image && (
        <div className="rounded-2xl overflow-hidden border border-zinc-800/40 max-h-72 bg-zinc-950">
          <img 
            referrerPolicy="no-referrer"
            src={post.image} 
            alt="Post asset" 
            className="w-full object-cover max-h-72 hover:scale-102 transition-transform duration-500 cursor-pointer" 
          />
        </div>
      )}

      {/* Poll Container */}
      {post.hasPoll && post.pollData && (
        <div className="p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 space-y-3">
          <span className="text-[10px] font-bold text-red-500 tracking-wider">SONDAGE COMMUNAUTAIRE</span>
          <h5 className="text-xs font-semibold text-zinc-200">{post.pollData.question}</h5>
          
          <div className="space-y-2">
            {post.pollData.options.map(opt => {
              const voteId = votedPolls[post.id];
              const isVoted = voteId === opt.id;
              const pct = Math.round((opt.votes / (post.pollData?.totalVotes || 1)) * 100);

              return (
                <button
                  key={opt.id}
                  onClick={() => handleVote(post.id, opt.id)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all relative overflow-hidden flex items-center justify-between cursor-pointer ${
                    isVoted 
                      ? 'border-red-500 font-bold text-white' 
                      : 'border-zinc-800 hover:bg-zinc-800/40 text-zinc-400'
                  }`}
                >
                  {/* Vote percentage bar backdrop */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-red-600/10 transition-all duration-500" 
                    style={{ width: `${pct}%` }}
                  />
                  <span className="relative z-10">{opt.text}</span>
                  <span className="relative z-10 text-[10px] text-zinc-500 font-mono italic">
                    {pct}% ({opt.votes} v)
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactions bar */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/30 text-xs">
        <button 
          onClick={() => handleLike(post.id)}
          className={`flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-[#FF2D55]/5 transition-all cursor-pointer ${
            post.isLiked ? 'text-[#FF2D55] font-bold' : 'text-zinc-500'
          }`}
        >
          <Flame className={`w-4 h-4 ${post.isLiked ? 'fill-[#FF2D55] text-[#FF2D55] filter drop-shadow-[0_0_6px_rgba(255,45,85,0.4)]' : ''}`} />
          <span className="font-mono">{post.likes}</span>
        </button>

        <button className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-zinc-800/10 text-zinc-500 cursor-pointer">
          <MessageCircle className="w-4 h-4" />
          <span className="font-mono">{post.comments}</span>
        </button>

        <button className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-zinc-800/10 text-zinc-500 cursor-pointer">
          <Share2 className="w-4 h-4" />
          <span className="font-mono">{post.shares}</span>
        </button>
      </div>
    </article>
  );
}
