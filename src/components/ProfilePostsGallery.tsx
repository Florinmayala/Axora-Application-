import React, { useState } from 'react';
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

  const handleLike = (postId: string) => setPosts(current => current.map(post => post.id === postId
    ? { ...post, isLiked: !post.isLiked, likes: post.likes + (post.isLiked ? -1 : 1) }
    : post
  ));
  const handleVote = (postId: string, optionId: number) => setVotedPolls(current => ({ ...current, [postId]: optionId }));

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {posts.map((post, index) => (
          <button
            key={post.id}
            type="button"
            onClick={() => setSelectedPostId(post.id)}
            className={`group relative overflow-hidden rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] text-left transition duration-300 hover:-translate-y-0.5 active:scale-[0.985] ${index === 0 ? 'col-span-2 aspect-[16/10] sm:col-span-2' : 'aspect-square'}`}
          >
            {post.image ? (
              <img src={post.image} alt={post.text} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            ) : (
              <span className="flex h-full items-end p-4 text-xs leading-relaxed text-[var(--axo-text)]">{post.text}</span>
            )}
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[var(--axo-media-overlay)] to-transparent p-3 pt-10 text-[var(--axo-media-text)]">
              <span className="line-clamp-2 max-w-[70%] text-[10px] font-bold leading-relaxed">{post.text}</span>
              <span className="flex gap-2 text-[9px] font-black"><span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 fill-current" />{post.likes}</span><span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{post.comments}</span></span>
            </span>
          </button>
        ))}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-[75] overflow-y-auto bg-[var(--axo-bg)] text-[var(--axo-text)]">
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--axo-border)] bg-[var(--axo-bg)] px-4 py-3">
            <button type="button" onClick={() => setSelectedPostId(null)} className="flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-black hover:bg-[var(--axo-surface-muted)]"><ArrowLeft className="h-4 w-4" />Retour</button>
            <div className="text-right"><h3 className="text-sm font-black">Publication</h3><p className="text-[9px] text-[var(--axo-text-muted)]">Même interface que l’accueil</p></div>
          </div>
          <div className="mx-auto w-full max-w-2xl">
            <PostCard post={selectedPost} handleLike={handleLike} handleVote={handleVote} votedPolls={votedPolls} isDark={isDark} cardBg="bg-transparent" />
          </div>
        </div>
      )}
    </>
  );
}
