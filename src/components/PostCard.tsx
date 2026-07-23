import React, { useState } from 'react';
import { Check, Copy, Flame, Heart, MessageCircle, Search, Send, Share2, Smile, X } from 'lucide-react';
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
  const [activePanel, setActivePanel] = useState<'comments' | 'share' | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [friendQuery, setFriendQuery] = useState('');
  const [sentToFriends, setSentToFriends] = useState<string[]>([]);
  const [shareFeedback, setShareFeedback] = useState('');
  const [comments, setComments] = useState([
    {
      id: `${post.id}-comment-1`,
      author: 'Maya K.',
      username: 'maya.creates',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
      text: 'Cette idée mérite vraiment une discussion plus longue 🔥',
      likes: 24,
      liked: false,
      time: '12 min'
    },
    {
      id: `${post.id}-comment-2`,
      author: 'Noah Digital',
      username: 'noah_digital',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
      text: 'La direction visuelle est très forte. Beau travail !',
      likes: 11,
      liked: false,
      time: '5 min'
    }
  ]);

  const stickers = ['🔥', '✨', '💯', '👏', '❤️‍🔥', '🚀', '🎨', '🫶'];
  const friends = [
    { id: 'lena', name: 'Lena X', username: 'Lena_X', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80' },
    { id: 'kaelen', name: 'Kaelen AfriTech', username: 'kaelen_afri_tech', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80' },
    { id: 'sarah', name: 'Sarah Jenkins', username: 'sara_jenk', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80' },
    { id: 'axora', name: 'Axora Social', username: 'axora_social', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&q=80' }
  ];
  const socialNetworks = [
    { name: 'WhatsApp', mark: 'W', color: '#22C55E' },
    { name: 'Facebook', mark: 'f', color: '#1877F2' },
    { name: 'X', mark: '𝕏', color: '#18181B' },
    { name: 'Telegram', mark: 'T', color: '#229ED9' }
  ];
  const totalCommentCount = post.comments + Math.max(0, comments.length - 2);

  const submitComment = () => {
    const value = commentText.trim();
    if (!value) return;
    setComments(prev => [
      ...prev,
      {
        id: `${post.id}-comment-${Date.now()}`,
        author: 'Vous',
        username: 'alex_axora',
        avatar: localStorage.getItem('axo_profileAvatar') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80',
        text: value,
        likes: 0,
        liked: false,
        time: 'maintenant'
      }
    ]);
    setCommentText('');
    setShowStickers(false);
  };

  const toggleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(comment => comment.id === commentId
      ? { ...comment, liked: !comment.liked, likes: comment.likes + (comment.liked ? -1 : 1) }
      : comment
    ));
  };

  const shareExternally = async (network: string) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#post-${post.id}`;
    if (network === 'Copier') {
      try {
        await navigator.clipboard?.writeText(shareUrl);
        setShareFeedback('Lien copié');
      } catch {
        setShareFeedback('Lien prêt à être copié');
      }
    } else {
      setShareFeedback(`Prêt à partager sur ${network}`);
    }
    window.setTimeout(() => setShareFeedback(''), 2200);
  };

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

        <button
          onClick={() => setActivePanel('comments')}
          className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-zinc-800/10 text-zinc-500 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-mono">{totalCommentCount}</span>
        </button>

        <button
          onClick={() => setActivePanel('share')}
          className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-zinc-800/10 text-zinc-500 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span className="font-mono">{post.shares}</span>
        </button>
      </div>

      {activePanel && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:p-5">
          <button
            type="button"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setActivePanel(null)}
            aria-label="Fermer"
          />

          <section className={`relative z-10 w-full sm:max-w-xl max-h-[92dvh] sm:max-h-[88dvh] flex flex-col overflow-hidden rounded-t-[26px] sm:rounded-[30px] border shadow-2xl animate-in slide-in-from-bottom-5 duration-300 ${
            isDark ? 'bg-[#111113] border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <header className={`px-5 py-4 flex items-center justify-between border-b ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
              <div>
                <h3 className="text-sm font-black">
                  {activePanel === 'comments' ? 'Conversation' : 'Partager la publication'}
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {activePanel === 'comments'
                    ? `${totalCommentCount} commentaires · échangez avec respect`
                    : 'Envoyez-la dans Axora ou ailleurs'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePanel(null)}
                className={`w-9 h-9 rounded-full flex items-center justify-center ${isDark ? 'bg-white/5 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            {activePanel === 'comments' ? (
              <>
                <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-1">
                  {comments.map(comment => (
                    <div key={comment.id} className={`flex gap-3 py-3 border-b last:border-0 ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                      <img src={comment.avatar} alt={comment.author} className="w-9 h-9 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[11px] font-black">{comment.author}</span>
                          <span className="text-[9px] text-zinc-500">@{comment.username} · {comment.time}</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed mt-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                          {comment.text}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleCommentLike(comment.id)}
                        className={`min-w-8 flex flex-col items-center gap-1 pt-1 ${comment.liked ? 'text-[#FF2D55]' : 'text-zinc-500'}`}
                        aria-label="Aimer ce commentaire"
                      >
                        <Heart className={`w-3.5 h-3.5 ${comment.liked ? 'fill-current' : ''}`} />
                        <span className="text-[8px] font-mono">{comment.likes}</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className={`relative p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4 border-t ${isDark ? 'border-white/5 bg-black/20' : 'border-zinc-200 bg-zinc-50'}`}>
                  {showStickers && (
                    <div className={`absolute left-3 bottom-full mb-2 p-2 grid grid-cols-4 gap-1 rounded-2xl border shadow-xl ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}>
                      {stickers.map(sticker => (
                        <button
                          key={sticker}
                          type="button"
                          onClick={() => {
                            setCommentText(prev => `${prev}${sticker}`);
                            setShowStickers(false);
                          }}
                          className="w-10 h-10 rounded-xl text-lg hover:bg-zinc-500/10 hover:scale-110 transition-all"
                        >
                          {sticker}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className={`flex items-center gap-2 rounded-full border p-1.5 pl-2 ${isDark ? 'bg-zinc-950 border-white/10' : 'bg-white border-zinc-200'}`}>
                    <button
                      type="button"
                      onClick={() => setShowStickers(prev => !prev)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-amber-500 hover:bg-amber-500/10"
                      aria-label="Envoyer un sticker"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    <input
                      value={commentText}
                      onChange={(event) => setCommentText(event.target.value)}
                      onKeyDown={(event) => event.key === 'Enter' && submitComment()}
                      placeholder="Écrire votre commentaire…"
                      className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={submitComment}
                      disabled={!commentText.trim()}
                      className="w-9 h-9 rounded-full bg-[#FF2D55] text-white flex items-center justify-center disabled:opacity-30"
                      aria-label="Publier le commentaire"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500 mb-3">Amis sur Axora</h4>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl border mb-3 ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
                    <Search className="w-4 h-4 text-zinc-500" />
                    <input
                      value={friendQuery}
                      onChange={(event) => setFriendQuery(event.target.value)}
                      placeholder="Rechercher un ami…"
                      className="flex-1 bg-transparent outline-none text-[11px]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {friends
                      .filter(friend => `${friend.name} ${friend.username}`.toLowerCase().includes(friendQuery.toLowerCase()))
                      .map(friend => {
                        const isSent = sentToFriends.includes(friend.id);
                        return (
                          <button
                            key={friend.id}
                            type="button"
                            onClick={() => setSentToFriends(prev => isSent ? prev : [...prev, friend.id])}
                            className={`flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-all ${
                              isSent
                                ? 'border-emerald-500/30 bg-emerald-500/10'
                                : isDark ? 'border-white/5 hover:bg-white/5' : 'border-zinc-200 hover:bg-zinc-50'
                            }`}
                          >
                            <img src={friend.avatar} alt={friend.name} className="w-9 h-9 rounded-full object-cover" />
                            <span className="flex-1 min-w-0">
                              <span className="block text-[11px] font-bold truncate">{friend.name}</span>
                              <span className="block text-[9px] text-zinc-500 truncate">@{friend.username}</span>
                            </span>
                            {isSent
                              ? <Check className="w-4 h-4 text-emerald-500" />
                              : <Send className="w-3.5 h-3.5 text-[#FF2D55]" />}
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div className={`border-t pt-4 ${isDark ? 'border-white/5' : 'border-zinc-200'}`}>
                  <h4 className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500 mb-3">Autres plateformes</h4>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {socialNetworks.map(network => (
                      <button
                        key={network.name}
                        type="button"
                        onClick={() => shareExternally(network.name)}
                        className="flex flex-col items-center gap-2 shrink-0"
                      >
                        <span
                          className="w-12 h-12 rounded-2xl text-white flex items-center justify-center font-black text-lg shadow-lg"
                          style={{ backgroundColor: network.color }}
                        >
                          {network.mark}
                        </span>
                        <span className="text-[9px] font-semibold">{network.name}</span>
                      </button>
                    ))}
                    <button type="button" onClick={() => shareExternally('Copier')} className="flex flex-col items-center gap-2 shrink-0">
                      <span className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-zinc-100 text-zinc-700'}`}>
                        <Copy className="w-5 h-5" />
                      </span>
                      <span className="text-[9px] font-semibold">Copier</span>
                    </button>
                  </div>
                  {shareFeedback && (
                    <p className="mt-3 text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {shareFeedback}
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </article>
  );
}
