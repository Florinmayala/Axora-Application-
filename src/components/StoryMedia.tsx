import React, { useEffect, useState } from 'react';
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

export default function StoryMedia({ story, preview = false, onProgress, onEnded, onSource }: {
  story: Pick<Story, 'mediaUrl' | 'mediaType' | 'mediaId'>;
  preview?: boolean;
  onProgress?: (value: number) => void;
  onEnded?: () => void;
  onSource?: (source: string) => void;
}) {
  const [source, setSource] = useState('');
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | undefined;
    setSource(''); setError(false);
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
  if (error) return <p role="alert" className="p-4 text-center text-sm text-white">Ce média n’est pas disponible sur cet appareil.</p>;
  if (!src) return <p role="status" className="text-sm text-white/70">Chargement…</p>;
  return story.mediaType === 'video'
    ? <video key={src} src={src} playsInline controls={!preview} autoPlay muted={preview} loop={preview} preload="metadata" onError={() => setError(true)} onEnded={onEnded} onTimeUpdate={event => { const video = event.currentTarget; if (Number.isFinite(video.duration) && video.duration > 0) onProgress?.(video.currentTime / video.duration * 100); }} className="block h-full w-full object-contain" />
    : <img src={src} alt="Story" onError={() => setError(true)} className="block h-full w-full object-contain" />;
}
