import { useEffect, useMemo, useRef, useState, type FormEvent, type RefObject } from 'react';
import { ArrowLeft, ChevronRight, Flag, Heart, ImagePlus, Lock, MessageCircle, Plus, Send, ShieldCheck, X } from 'lucide-react';
import RoomCreatorDialog, { type RoomDraft } from './RoomCreatorDialog';

export type RoomId = string;
export type RoomAuthor = { name: string; username: string; avatar: string; isPrivate?: boolean; bio: string };
type Room = { id: RoomId; emoji: string; name: string; subtitle: string; members: string; color: string; dailyQuestion: string; isPrivate?: boolean };
type Comment = { id: string; text: string; author: RoomAuthor; replies: Comment[] };
type RoomPost = { id: string; roomId: RoomId; text: string; topic: string; author: RoomAuthor; likes: number; liked?: boolean; comments: Comment[]; image?: string; reported?: boolean };
type RoomStore = { joined: RoomId[]; requested: RoomId[]; rooms: Room[]; posts: RoomPost[] };

export const AXORA_ROOMS: Room[] = [
  { id: 'createurs', emoji: '🎨', name: 'Créateurs Kinshasa', subtitle: 'Design, photo & projets', members: '2,4 k membres', color: 'from-[#FF2D55]/15 to-[#FF2D55]/[0.03]', dailyQuestion: 'Quelle création raconte le mieux ta journée ?' },
  { id: 'food', emoji: '🍲', name: 'Food & sorties', subtitle: 'Bonnes adresses et idées', members: '1,8 k membres', color: 'from-amber-500/15 to-amber-500/[0.03]', dailyQuestion: 'Quelle adresse mérite vraiment d’être découverte ?' },
  { id: 'business', emoji: '💼', name: 'Business Kinshasa', subtitle: 'Idées, opportunités & réseau', members: '3,1 k membres', color: 'from-cyan-500/15 to-cyan-500/[0.03]', dailyQuestion: 'Quelle idée veux-tu faire avancer aujourd’hui ?', isPrivate: true },
  { id: 'music', emoji: '🎵', name: 'Musique & danse', subtitle: 'Sons, artistes & talents', members: '4,7 k membres', color: 'from-violet-500/15 to-violet-500/[0.03]', dailyQuestion: 'Quel son résume ton humeur du jour ?' },
  { id: 'sport', emoji: '⚽', name: 'Sport & mouvements', subtitle: 'Matchs, équipes & défis', members: '2,9 k membres', color: 'from-emerald-500/15 to-emerald-500/[0.03]', dailyQuestion: 'Quel défi sportif te motive cette semaine ?' },
];

const TOPICS = ['Question du jour', 'Discussion', 'Conseil', 'Photo'];
const ME: RoomAuthor = { name: 'Auteur Invité', username: 'alex_axora', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&q=80', bio: 'Membre Axora.' };
const MAYA: RoomAuthor = { name: 'Maya K.', username: 'maya_k', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80', bio: 'Curieuse de culture et des rencontres qui font vivre Kinshasa.' };
const LINA: RoomAuthor = { name: 'Lina N.', username: 'lina_notes', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80', bio: 'Photographe et membre de la communauté.', isPrivate: true };
const NICO: RoomAuthor = { name: 'Nico M.', username: 'nico_m', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80', bio: 'Modérateur de la Room.' };
const MEMBERS = [MAYA, LINA, NICO];
const INITIAL_POSTS: RoomPost[] = [
  { id: 'maya-food', roomId: 'food', topic: 'Question du jour', author: MAYA, text: 'Le petit restaurant près du marché reste ma découverte de la semaine. Ambiance simple et accueil chaleureux.', likes: 18, comments: [{ id: 'lina-reply', author: LINA, text: 'Je veux bien l’adresse dans une prochaine publication !', replies: [] }] },
  { id: 'nico-createurs', roomId: 'createurs', topic: 'Discussion', author: NICO, text: 'Partageons aujourd’hui les projets que nous voulons terminer avant vendredi.', likes: 7, comments: [] },
];
const INITIAL_STORE: RoomStore = { joined: ['food'], requested: [], rooms: AXORA_ROOMS, posts: INITIAL_POSTS };
const emitNotification = (title: string, description: string) => window.dispatchEvent(new CustomEvent('axora:room-notification', { detail: { title, description } }));

function loadRoomStore(): RoomStore {
  try {
    const saved = JSON.parse(localStorage.getItem('axo_rooms_v3') || 'null') as Partial<RoomStore> | null;
    if (!saved) return INITIAL_STORE;
    return { joined: saved.joined ?? INITIAL_STORE.joined, requested: saved.requested ?? [], rooms: saved.rooms?.length ? saved.rooms : AXORA_ROOMS, posts: saved.posts?.filter(post => post.roomId) ?? INITIAL_POSTS };
  } catch {
    return INITIAL_STORE;
  }
}

export function RoomsShelf({ onOpen }: { onOpen: (id: RoomId) => void }) {
  return <section aria-labelledby="rooms-heading" className="mx-auto max-w-5xl px-3 sm:px-4"><div className="mb-3 flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FF2D55]">Communautés quotidiennes</p><h2 id="rooms-heading" className="mt-1 text-lg font-black">Trouve ta Room</h2></div><button type="button" onClick={() => onOpen('createurs')} className="inline-flex items-center gap-1 text-xs font-black text-[#FF2D55]">Tout voir <ChevronRight className="h-4 w-4" /></button></div><div className="-mx-3 flex gap-3 overflow-x-auto px-3 pb-1 no-scrollbar sm:-mx-4 sm:px-4">{AXORA_ROOMS.map(room => <button key={room.id} type="button" onClick={() => onOpen(room.id)} className={`w-40 shrink-0 rounded-2xl border border-[var(--axo-border)] bg-gradient-to-br ${room.color} p-3 text-left shadow-sm`}><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF2D55]/10 text-xl">{room.emoji}</span><strong className="mt-3 block truncate text-xs">{room.name}</strong><span className="mt-1 block truncate text-[10px] text-[var(--axo-text-muted)]">{room.members}</span></button>)}</div></section>;
}

export default function AxoraRooms({ selectedId, onBack, onViewProfile }: { selectedId: RoomId; onBack: () => void; onViewProfile: (author: RoomAuthor) => void }) {
  const [roomId, setRoomId] = useState<RoomId>(selectedId);
  const [tab, setTab] = useState<'daily' | 'members' | 'rules'>('daily');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [filter, setFilter] = useState('Tout');
  const [draft, setDraft] = useState('');
  const [photo, setPhoto] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [memberQuery, setMemberQuery] = useState('');
  const [replyTo, setReplyTo] = useState<{ postId: string; commentId?: string } | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [store, setStore] = useState<RoomStore>(loadRoomStore);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const room = useMemo(() => store.rooms.find(item => item.id === roomId) ?? store.rooms[0], [roomId, store.rooms]);
  const isMember = store.joined.includes(room.id);
  const isRequested = store.requested.includes(room.id);
  const visiblePosts = store.posts.filter(post => post.roomId === room.id && (filter === 'Tout' || post.topic === filter));
  const visibleMembers = MEMBERS.filter(member => `${member.name} ${member.username}`.toLowerCase().includes(memberQuery.toLowerCase()));

  useEffect(() => { localStorage.setItem('axo_rooms_v3', JSON.stringify(store)); }, [store]);
  const choose = (id: RoomId) => { setRoomId(id); setTab('daily'); setFilter('Tout'); setReplyTo(null); };
  const joinRoom = () => {
    if (isMember) { setStore(current => ({ ...current, joined: current.joined.filter(id => id !== room.id) })); return; }
    if (room.isPrivate) { setStore(current => ({ ...current, requested: [...new Set([...current.requested, room.id])] })); emitNotification('Demande envoyée', `Votre demande pour ${room.name} attend une approbation.`); return; }
    setStore(current => ({ ...current, joined: [...new Set([...current.joined, room.id])] }));
    emitNotification('Bienvenue dans la Room', `Vous avez rejoint ${room.name}.`);
  };
  const createRoom = (draftRoom: RoomDraft) => {
    const id = `room-${Date.now()}`;
    const created: Room = { id, emoji: '✨', name: draftRoom.name, subtitle: draftRoom.subtitle, members: '1 membre', color: 'from-[#FF2D55]/15 to-violet-500/[0.04]', dailyQuestion: draftRoom.dailyQuestion, isPrivate: draftRoom.isPrivate };
    setStore(current => ({ ...current, rooms: [created, ...current.rooms], joined: [...current.joined, id] }));
    setRoomId(id); setTab('daily'); setCreatorOpen(false);
    emitNotification('Room créée', `${created.name} est prête à accueillir ses premières réponses.`);
  };
  const selectPhoto = (file?: File) => {
    setPhotoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) { setPhotoError('Choisissez un fichier image.'); return; }
    if (file.size > 3 * 1024 * 1024) { setPhotoError('La photo ne doit pas dépasser 3 Mo.'); return; }
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result ?? ''));
    reader.readAsDataURL(file);
  };
  const publish = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim() && !photo) return;
    const post: RoomPost = { id: `room-post-${Date.now()}`, roomId: room.id, text: draft.trim(), topic: photo && topic === 'Discussion' ? 'Photo' : topic, author: ME, likes: 0, comments: [], image: photo || undefined };
    setStore(current => ({ ...current, posts: [post, ...current.posts] }));
    setDraft(''); setPhoto(''); setTopic('Discussion');
  };
  const toggleLike = (id: string) => setStore(current => ({ ...current, posts: current.posts.map(post => post.id === id ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) } : post) }));
  const report = (id: string) => { setStore(current => ({ ...current, posts: current.posts.map(post => post.id === id ? { ...post, reported: true } : post) })); emitNotification('Signalement reçu', 'La modération examinera ce contenu.'); };
  const addComment = (event: FormEvent) => {
    event.preventDefault();
    if (!replyTo || !replyDraft.trim()) return;
    const comment: Comment = { id: `comment-${Date.now()}`, text: replyDraft.trim(), author: ME, replies: [] };
    setStore(current => ({ ...current, posts: current.posts.map(post => {
      if (post.id !== replyTo.postId) return post;
      if (!replyTo.commentId) return { ...post, comments: [...post.comments, comment] };
      return { ...post, comments: post.comments.map(item => item.id === replyTo.commentId ? { ...item, replies: [...item.replies, comment] } : item) };
    }) }));
    setReplyDraft(''); setReplyTo(null);
  };

  return <section className="min-h-full bg-[var(--axo-bg)] text-[var(--axo-text)]">
    <header className="sticky top-0 z-20 border-b border-[var(--axo-border)] bg-[var(--axo-bg)]/95 px-4 py-3 backdrop-blur-md"><div className="mx-auto flex max-w-7xl items-center gap-3"><button type="button" onClick={onBack} className="rounded-xl p-2" aria-label="Retour"><ArrowLeft className="h-5 w-5" /></button><div className="min-w-0 flex-1"><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FF2D55]">Axora Rooms</p><h1 className="truncate text-sm font-black">Communautés du quotidien</h1></div><button type="button" onClick={() => setCreatorOpen(true)} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[#FF2D55] px-3 text-[10px] font-black text-white"><Plus className="h-4 w-4" />Créer</button></div></header>
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 pb-28">
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">{store.rooms.map(item => <button key={item.id} type="button" onClick={() => choose(item.id)} className={`shrink-0 rounded-full px-3 py-2 text-[11px] font-bold ${room.id === item.id ? 'bg-[#FF2D55] text-white' : 'border border-[var(--axo-border)] bg-[var(--axo-surface)]'}`}>{item.emoji} {item.name}</button>)}</div>
      <section className={`rounded-3xl border border-[var(--axo-border)] bg-gradient-to-br ${room.color} p-5`}><div className="flex items-start justify-between gap-3"><span className="text-4xl">{room.emoji}</span><button type="button" onClick={joinRoom} disabled={isRequested} className="rounded-xl border border-[var(--axo-border)] bg-[var(--axo-surface)] px-4 py-2.5 text-xs font-black disabled:opacity-60">{isMember ? 'Membre' : isRequested ? 'Demande envoyée' : room.isPrivate ? 'Demander à rejoindre' : 'Rejoindre'}</button></div><h2 className="mt-4 text-2xl font-black">{room.name}</h2><p className="mt-1 text-sm text-[var(--axo-text-muted)]">{room.subtitle} · {room.members}{room.isPrivate ? ' · privée' : ''}</p><div className="mt-5 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)]/80 p-4"><p className="text-[9px] font-black uppercase tracking-widest text-[#FF2D55]">Question du jour</p><p className="mt-1 text-sm font-bold">{room.dailyQuestion}</p><button type="button" onClick={() => { setTab('daily'); setTopic('Question du jour'); window.setTimeout(() => document.getElementById('room-composer')?.focus(), 0); }} className="mt-3 rounded-xl bg-[#FF2D55]/10 px-3 py-2 text-[10px] font-black text-[#FF2D55]">Répondre aujourd’hui</button></div></section>
      <div className="grid grid-cols-3 rounded-2xl bg-[var(--axo-surface-muted)] p-1" role="tablist" aria-label="Sections de la Room">{([['daily', 'Quotidien'], ['members', 'Membres'], ['rules', 'Règles']] as const).map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`rounded-xl px-2 py-2.5 text-[9px] font-black sm:text-[10px] ${tab === id ? 'bg-[var(--axo-surface)] text-[#FF2D55] shadow-sm' : 'text-[var(--axo-text-muted)]'}`}>{label}</button>)}</div>
      {tab === 'daily' && <DailyRoom room={room} topic={topic} setTopic={setTopic} filter={filter} setFilter={setFilter} draft={draft} setDraft={setDraft} photo={photo} setPhoto={setPhoto} photoError={photoError} fileInputRef={fileInputRef} selectPhoto={selectPhoto} publish={publish} posts={visiblePosts} toggleLike={toggleLike} report={report} replyTo={replyTo} setReplyTo={setReplyTo} replyDraft={replyDraft} setReplyDraft={setReplyDraft} addComment={addComment} onViewProfile={onViewProfile} />}
      {tab === 'members' && <section className="space-y-3 rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-4"><div><h3 className="text-sm font-black">Membres de la Room</h3><p className="mt-1 text-[10px] text-[var(--axo-text-muted)]">Vous pouvez consulter un profil, mais pas écrire à un membre depuis une Room.</p></div><div className="flex gap-2 rounded-xl bg-[#FF2D55]/8 p-3 text-[10px] leading-relaxed text-[var(--axo-text-muted)]"><Lock className="h-4 w-4 shrink-0 text-[#FF2D55]" /><p><strong className="text-[var(--axo-text)]">Messagerie privée désactivée.</strong> Les échanges restent publics dans les publications et leurs réponses.</p></div><input value={memberQuery} onChange={event => setMemberQuery(event.target.value)} placeholder="Rechercher un membre…" className="w-full rounded-xl border border-[var(--axo-border)] bg-transparent px-3 py-2.5 text-xs outline-none" />{visibleMembers.map((member, index) => <button key={member.username} type="button" onClick={() => onViewProfile(member)} className="flex w-full items-center gap-3 rounded-xl border border-[var(--axo-border)] p-3 text-left"><img src={member.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /><span className="min-w-0 flex-1"><span className="block truncate text-xs font-black">{member.name} {member.isPrivate && <Lock className="inline h-3 w-3" />}</span><span className="text-[10px] text-[var(--axo-text-muted)]">@{member.username} · {index === 2 ? 'Administrateur' : 'Membre'}</span></span>{index === 2 && <ShieldCheck className="h-4 w-4 text-[#FF2D55]" />}</button>)}</section>}
      {tab === 'rules' && <section className="rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-4"><div className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-[#FF2D55]" /><div><h3 className="text-sm font-black">Règles de la Room</h3><p className="mt-1 text-xs text-[var(--axo-text-muted)]">Un espace quotidien, séparé des rencontres relationnelles.</p></div></div><ol className="mt-4 list-decimal space-y-2 pl-5 text-xs"><li>Répondre avec respect aux questions et publications.</li><li>Les photos doivent respecter la confidentialité des personnes.</li><li>Aucun message privé ne peut être initié depuis une Room.</li><li>Les sessions relationnelles de 30 minutes sont gérées séparément et automatiquement.</li></ol></section>}
    </main>
    <RoomCreatorDialog open={creatorOpen} onClose={() => setCreatorOpen(false)} onCreate={createRoom} />
  </section>;
}

type DailyRoomProps = {
  room: Room; topic: string; setTopic: (value: string) => void; filter: string; setFilter: (value: string) => void; draft: string; setDraft: (value: string) => void; photo: string; setPhoto: (value: string) => void; photoError: string; fileInputRef: RefObject<HTMLInputElement | null>; selectPhoto: (file?: File) => void; publish: (event: FormEvent) => void; posts: RoomPost[]; toggleLike: (id: string) => void; report: (id: string) => void; replyTo: { postId: string; commentId?: string } | null; setReplyTo: (value: { postId: string; commentId?: string } | null) => void; replyDraft: string; setReplyDraft: (value: string) => void; addComment: (event: FormEvent) => void; onViewProfile: (author: RoomAuthor) => void;
};

function DailyRoom(props: DailyRoomProps) {
  const { room, topic, setTopic, filter, setFilter, draft, setDraft, photo, setPhoto, photoError, fileInputRef, selectPhoto, publish, posts, toggleLike, report, replyTo, setReplyTo, replyDraft, setReplyDraft, addComment, onViewProfile } = props;
  return <>
    <form onSubmit={publish} className="rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-3"><div className="mb-3 flex gap-2 overflow-x-auto no-scrollbar">{TOPICS.map(item => <button key={item} type="button" onClick={() => setTopic(item)} className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black ${topic === item ? 'bg-[#FF2D55] text-white' : 'bg-[var(--axo-surface-muted)] text-[var(--axo-text-muted)]'}`}>{item}</button>)}</div><textarea id="room-composer" value={draft} onChange={event => setDraft(event.target.value)} rows={3} maxLength={500} placeholder={topic === 'Question du jour' ? room.dailyQuestion : `Partage quelque chose avec ${room.name}…`} className="w-full resize-none bg-transparent text-sm outline-none" />{photo && <div className="relative mt-2 overflow-hidden rounded-2xl"><img src={photo} alt="Aperçu de la photo à publier" className="max-h-72 w-full object-cover" /><button type="button" onClick={() => setPhoto('')} aria-label="Retirer la photo" className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white"><X className="h-4 w-4" /></button></div>}{photoError && <p role="alert" className="mt-2 text-[10px] font-bold text-red-500">{photoError}</p>}<div className="mt-3 flex items-center justify-between border-t border-[var(--axo-border)] pt-3"><div><input ref={fileInputRef} type="file" accept="image/*" onChange={event => selectPhoto(event.target.files?.[0])} className="sr-only" /><button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-[10px] font-black text-[var(--axo-text-muted)] hover:bg-[var(--axo-surface-muted)]"><ImagePlus className="h-4 w-4 text-[#FF2D55]" />Photo</button></div><button type="submit" disabled={!draft.trim() && !photo} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[#FF2D55] px-4 text-[10px] font-black text-white disabled:opacity-40"><Send className="h-3.5 w-3.5" />Publier</button></div></form>
    <div className="flex gap-2 overflow-x-auto no-scrollbar">{['Tout', ...TOPICS].map(item => <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold ${filter === item ? 'bg-[#FF2D55]/10 text-[#FF2D55]' : 'text-[var(--axo-text-muted)]'}`}>{item}</button>)}</div>
    {posts.length === 0 && <div className="rounded-2xl border border-dashed border-[var(--axo-border)] p-8 text-center"><MessageCircle className="mx-auto h-6 w-6 text-[#FF2D55]" /><p className="mt-2 text-xs font-black">Aucune publication pour le moment</p><p className="mt-1 text-[10px] text-[var(--axo-text-muted)]">Soyez la première personne à répondre à la question du jour.</p></div>}
    {posts.map(post => <article key={post.id} className="rounded-2xl border border-[var(--axo-border)] bg-[var(--axo-surface)] p-4"><div className="flex items-start justify-between gap-3"><button type="button" onClick={() => onViewProfile(post.author)} className="text-left"><p className="text-xs font-black text-[#FF2D55]">{post.author.name}{post.author.isPrivate && <Lock className="ml-1 inline h-3 w-3" />}</p><p className="text-[10px] text-[var(--axo-text-muted)]">@{post.author.username} · {post.topic}</p></button><button type="button" onClick={() => report(post.id)} disabled={post.reported} className="text-[var(--axo-text-muted)] disabled:text-[#FF2D55]" aria-label={post.reported ? 'Publication signalée' : 'Signaler la publication'}><Flag className="h-4 w-4" /></button></div>{post.text && <p className="mt-3 text-sm leading-relaxed">{post.text}</p>}{post.image && <img src={post.image} alt="Photo publiée dans la Room" className="mt-3 max-h-[32rem] w-full rounded-2xl object-cover" />}<div className="mt-3 flex gap-4 text-xs font-bold"><button type="button" onClick={() => toggleLike(post.id)} className={post.liked ? 'text-[#FF2D55]' : 'text-[var(--axo-text-muted)]'}><Heart className="mr-1 inline h-4 w-4" fill={post.liked ? 'currentColor' : 'none'} />{post.likes}</button><button type="button" onClick={() => setReplyTo({ postId: post.id })}><MessageCircle className="mr-1 inline h-4 w-4 text-[#FF2D55]" />{post.comments.length} réponses</button></div>{post.comments.map(comment => <div key={comment.id} className="mt-3 border-l-2 border-[#FF2D55]/20 pl-3 text-xs"><button type="button" onClick={() => onViewProfile(comment.author)} className="font-black text-[#FF2D55]">{comment.author.name}</button><p className="mt-1">{comment.text}</p><button type="button" onClick={() => setReplyTo({ postId: post.id, commentId: comment.id })} className="mt-1 text-[10px] font-bold text-[var(--axo-text-muted)]">Répondre dans la Room</button>{comment.replies.map(reply => <div key={reply.id} className="mt-2 pl-3"><span className="font-black text-[#FF2D55]">{reply.author.name}</span><p>{reply.text}</p></div>)}</div>)}{replyTo?.postId === post.id && <form onSubmit={addComment} className="mt-3 flex gap-2"><input autoFocus value={replyDraft} onChange={event => setReplyDraft(event.target.value)} placeholder="Répondre publiquement dans la Room…" className="min-w-0 flex-1 rounded-xl border border-[var(--axo-border)] bg-transparent px-3 py-2 text-xs outline-none" /><button type="submit" className="rounded-xl bg-[#FF2D55] px-3 text-xs font-black text-white">Envoyer</button></form>}</article>)}
  </>;
}
