import { useEffect, useRef, useState } from 'react';
import { Camera, Check, Circle, FlipHorizontal, Video, X } from 'lucide-react';

interface StoryCameraCaptureProps {
  open: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export default function StoryCameraCapture({ open, onClose, onCapture }: StoryCameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [recording, setRecording] = useState(false);
  const [facing, setFacing] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState('');

  const stopStream = () => {
    recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void navigator.mediaDevices?.getUserMedia({ video: { facingMode: { ideal: facing }, aspectRatio: { ideal: 9 / 16 } }, audio: true })
      .then(stream => {
        if (cancelled) { stream.getTracks().forEach(track => track.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; void videoRef.current.play(); }
      })
      .catch(() => setError('La caméra n’est pas disponible. Vérifiez son autorisation puis réessayez.'));
    return () => { cancelled = true; stopStream(); };
  }, [open, facing]);

  if (!open) return null;

  const close = () => { stopStream(); onClose(); };
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob(blob => { if (blob) { onCapture(new File([blob], `story-${Date.now()}.jpg`, { type: 'image/jpeg' })); close(); } }, 'image/jpeg', 0.92);
  };
  const toggleRecording = () => {
    if (recording) { recorderRef.current?.stop(); return; }
    const stream = streamRef.current;
    if (!stream || typeof MediaRecorder === 'undefined') return setError('L’enregistrement vidéo n’est pas pris en charge sur cet appareil.');
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream, MediaRecorder.isTypeSupported('video/webm') ? { mimeType: 'video/webm' } : undefined);
    recorderRef.current = recorder;
    recorder.ondataavailable = event => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = () => {
      setRecording(false);
      if (!chunksRef.current.length) return;
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'video/webm' });
      onCapture(new File([blob], `story-${Date.now()}.webm`, { type: blob.type }));
      close();
    };
    recorder.start(); setRecording(true);
  };

  return <div className="fixed inset-0 z-[140] bg-black text-white"><div className="relative mx-auto flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden bg-zinc-950"><video ref={videoRef} muted playsInline className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/75" /><header className="relative z-10 flex items-center justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))]"><button type="button" onClick={close} className="rounded-full bg-black/35 p-3" aria-label="Fermer la caméra"><X className="h-5 w-5" /></button><div className="rounded-full bg-black/35 px-4 py-2 text-[10px] font-black uppercase tracking-[.18em]">Caméra Axora</div><button type="button" onClick={() => setFacing(value => value === 'environment' ? 'user' : 'environment')} className="rounded-full bg-black/35 p-3" aria-label="Changer de caméra"><FlipHorizontal className="h-5 w-5" /></button></header>{error && <p className="relative z-10 mx-4 rounded-xl bg-red-500/90 p-3 text-xs">{error}</p>}<div className="relative z-10 mt-auto p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"><div className="mx-auto mb-6 flex w-fit rounded-full bg-black/45 p-1"><button type="button" onClick={() => setMode('photo')} className={`rounded-full px-4 py-2 text-[10px] font-black ${mode === 'photo' ? 'bg-white text-black' : 'text-white/70'}`}>PHOTO</button><button type="button" onClick={() => setMode('video')} className={`rounded-full px-4 py-2 text-[10px] font-black ${mode === 'video' ? 'bg-white text-black' : 'text-white/70'}`}>VIDÉO</button></div><div className="flex items-center justify-center"><button type="button" onClick={mode === 'photo' ? capturePhoto : toggleRecording} className={`flex h-20 w-20 items-center justify-center rounded-full border-4 border-white shadow-2xl ${recording ? 'bg-red-500' : 'bg-white/20'}`} aria-label={recording ? 'Arrêter l’enregistrement' : mode === 'photo' ? 'Prendre la photo' : 'Démarrer la vidéo'}>{recording ? <Check className="h-7 w-7" /> : mode === 'photo' ? <Camera className="h-7 w-7" /> : <Video className="h-7 w-7" />}</button></div><p className="mt-4 text-center text-[11px] font-semibold text-white/75">{recording ? 'Enregistrement en cours — touchez pour terminer' : mode === 'photo' ? 'Touchez pour prendre une photo' : 'Touchez pour filmer votre Story'}</p></div></div></div>;
}
