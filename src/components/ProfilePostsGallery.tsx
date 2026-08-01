import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { Post } from '../types';
import PostCard from './PostCard';

interface ProfilePostsGalleryProps {
  key?: React.Key;
  posts: Post[];
  isDark: boolean;
}

export default function ProfilePostsGallery({ posts: initialPosts, isDark }: ProfilePostsGalleryProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [votedPolls, setVotedPolls] = useState<Record<string, number>>({});
  const selectedPost = posts.find(post => post.id === selectedPostId);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('axora:post-interaction', {
      detail: { open: selectedPostId !== null }
    }));
    return () => {
      window.dispatchEvent(new CustomEvent('axora:post-interaction', {
        detail: { open: false }
      }));
    };
  }, [selectedPostId]);

  const handleLike = (postId: string) => setPosts(current => current.map(post => post.id === postId
    ? { ...post, isLiked: !post.isLiked, likes: post.likes + (post.isLiked ? -1 : 1) }
    : post
  ));
  const handleVote = (postId: string, optionId: number) => setVotedPolls(current => ({ ...current, [postId]: optionId }));

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => setSelectedPostId(post.id)}
            className="group relative aspect-square overflow-hidden bg-[var(--axo-surface)] text-left transition active:opacity-80"
          >
            {post.image ? (
              <img src={post.image} alt={post.text} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            ) : (
              <span className="flex h-full items-center justify-center p-3 text-center text-[10px] leading-relaxed text-[var(--axo-text)] sm:text-xs">{post.text}</span>
            )}
            <span className="absolute inset-0 flex items-center justify-center gap-4 bg-black/45 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="flex items-center gap-1 text-[10px] font-black"><Heart className="h-4 w-4 fill-current" />{post.likes}</span>
              <span className="flex items-center gap-1 text-[10px] font-black"><MessageCircle className="h-4 w-4 fill-current" />{post.comments}</span>
            </span>
          </button>
        ))}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-[75] flex h-[100dvh] flex-col overflow-hidden bg-[var(--axo-bg)] text-[var(--axo-text)]">
          <div className="relative z-20 flex shrink-0 items-center justify-between border-b border-[var(--axo-border)] bg-[var(--axo-bg)] px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4">
            <button type="button" onClick={() => setSelectedPostId(null)} className="flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-black hover:bg-[var(--axo-surface-muted)]"><ArrowLeft className="h-4 w-4" />Retour</button>
            <div className="text-right"><h3 className="text-sm font-black">Publication</h3><p className="text-[9px] text-[var(--axo-text-muted)]">Même interface que l’accueil</p></div>
          </div>
          <div className="mx-auto min-h-0 w-full max-w-2xl flex-1 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]">
            <PostCard post={selectedPost} handleLike={handleLike} handleVote={handleVote} votedPolls={votedPolls} isDark={isDark} cardBg="bg-transparent" interactionContextOpen />
          </div>
        </div>
      )}
    </>
  );
}
