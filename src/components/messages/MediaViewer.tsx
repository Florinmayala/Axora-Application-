import { useState } from 'react';
import type { ChatMessage } from '../../types';
import MessageDialog from './MessageDialog';

export default function MediaViewer({ messages, initialId, urls, onClose }: {
  messages: ChatMessage[]; initialId: string; urls: Record<string, string>; onClose: () => void;
}) {
  const [index, setIndex] = useState(Math.max(0, messages.findIndex(message => message.id === initialId)));
  const [zoom, setZoom] = useState(false);
  const message = messages[index];
  if (!message) return null;
  const url = urls[message.id] || (!message.mediaId ? message.mediaUrl : undefined);
  return <MessageDialog title={`Médias · ${index + 1} / ${messages.length}`} onClose={onClose} wide>
    <div className="max-h-[65dvh] overflow-auto rounded-2xl bg-black/90">
      {!url ? <p role="status" className="p-12 text-center text-white">Média indisponible sur cet appareil.</p> : message.mediaType === 'video'
        ? <video key={message.id} controls playsInline src={url} className="max-h-[65dvh] w-full" />
        : <button type="button" aria-label={zoom ? 'Réduire la photo' : 'Agrandir la photo'} onClick={() => setZoom(!zoom)} className="block w-full"><img src={url} alt={message.attachment?.name || 'Photo partagée'} className={zoom ? 'max-w-none w-[180%]' : 'max-h-[65dvh] w-full object-contain'} /></button>}
    </div>
    <p className="my-3 break-words text-sm text-[var(--axo-text-muted)]">{message.text}</p>
    <div className="flex justify-between gap-3"><button className="message-secondary" disabled={index === 0} onClick={() => { setIndex(index - 1); setZoom(false); }}>Précédent</button><button className="message-secondary" disabled={index === messages.length - 1} onClick={() => { setIndex(index + 1); setZoom(false); }}>Suivant</button></div>
  </MessageDialog>;
}
