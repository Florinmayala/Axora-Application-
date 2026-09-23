import type { ChatMessage } from '../../types';

export function forwardCopy(message: ChatMessage, now = Date.now()): ChatMessage {
  return {
    id: `forward-${crypto.randomUUID()}`, text: message.text, senderId: 'me',
    timestamp: new Date(now).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    sentAt: now, receiptStatus: 'sent', forwarded: true,
    isMedia: message.isMedia, mediaType: message.mediaType, isVoice: message.isVoice,
    mediaId: message.mediaId, mediaUrl: message.mediaId ? undefined : message.mediaUrl,
    attachment: message.attachment ? { ...message.attachment } : undefined,
  };
}

export function messagePreview(messages: ChatMessage[]) {
  const last = messages.at(-1);
  return { lastMessage: last?.text || 'Aucun message', timestamp: last?.timestamp || '' };
}
