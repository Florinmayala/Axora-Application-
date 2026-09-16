import React, { useEffect, useRef, useState } from 'react';
import type { Story } from '../types';

function openMediaDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('axora-story-media', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('files');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveStoryMedia(id: string, file: File): Promise<void> {
  const database = await openMediaDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction('files', 'readwrite');
      transaction.objectStore('files').put(file, id);
      transaction.oncomplete = () => resolve();
      transaction.onabort = transaction.onerror = () => reject(transaction.error);
    });
  } finally { database.close(); }
}

export default function StoryMedia({ story, preview = false, paused = false, onProgress, onEnded, onSource }: {
  story: Pick<Story, 'mediaUrl' | 'mediaType' | 'mediaId' | 'mediaScale' | 'mediaOffsetY' | 'filter' | 'background'>;
  preview?: boolean;
  paused?: boolean;
  onProgress?: (value: number) => void;
  onEnded?: () => void;
  onSource?: (source: string) => void;
}) {
  const [source, setSource] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | undefined;
    setSource(''); setError(false); setLoading(true);
    if (!story.mediaId) return;
    void (async () => {
      const database = await openMediaDatabase();
      try {
        const blob = await new Promise<Blob>((resolve, reject) => {
          const request = database.transaction('files').objectStore('files').get(story.mediaId!);
          request.onsuccess = () => request.result instanceof Blob ? resolve(request.result) : reject(new Error('missing media'));
          request.onerror = () => reject(request.error);
        });
        if (!cancelled) { objectUrl = URL.createObjectURL(blob); setSource(objectUrl); }
      } finally { database.close(); }
    })().catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [story.mediaId]);
  const src = story.mediaId ? source : story.mediaUrl;
  useEffect(() => { onSource?.(src); }, [src, onSource]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || preview) return;
    if (paused) video.pause();
    else void video.play().catch(() => undefined);
  }, [paused, preview, src]);
  if (error) return <p role="alert" className="p-4 text-center text-sm text-white">Ce média n’est pas disponible sur cet appareil.</p>;
  if (!src && story.background) return <div className="h-full w-full" style={{ background: story.background }} aria-label="Story texte" />;
  if (!src) return <div role="status" className="flex h-full w-full animate-pulse items-center justify-center bg-zinc-900 text-xs text-white/70">Chargement de la Story…</div>;
  const filter = story.filter === 'warm' ? 'sepia(.22) saturate(1.2)' : story.filter === 'noir' ? 'grayscale(1) contrast(1.15)' : story.filter === 'vivid' ? 'saturate(1.45) contrast(1.06)' : 'none';
  const framing = { transform: `translateY(${story.mediaOffsetY ?? 0}%) scale(${story.mediaScale ?? 1})`, filter };
  return story.mediaType === 'video'
    ? <div className="relative h-full w-full">{loading && <div className="absolute inset-0 z-10 animate-pulse bg-zinc-800" />}<video ref={videoRef} key={src} src={src} playsInline controls={!preview} autoPlay muted={preview} loop={preview} preload="metadata" onLoadedData={() => setLoading(false)} onError={() => setError(true)} onEnded={onEnded} onTimeUpdate={event => { const video = event.currentTarget; if (Number.isFinite(video.duration) && video.duration > 0) onProgress?.(video.currentTime / video.duration * 100); }} className="block h-full w-full object-cover" style={framing} /></div>
    : <div className="relative h-full w-full">{loading && <div className="absolute inset-0 z-10 animate-pulse bg-zinc-800" />}<img src={src} alt="Image de la Story" onLoad={() => setLoading(false)} onError={() => setError(true)} className="block h-full w-full object-cover" style={framing} /></div>;
}
