// Client Component - Admin: manage videos for a module
'use client';

import { AdminOnlyGate } from '@/components/layout/AdminGuard';
import { VideoPlayerModal } from '@/components/ui/VideoPlayer';
import {
  useAllModuleVideos,
  useCreateModuleVideo,
  useDeleteModuleVideo,
  useUpdateModuleVideo,
} from '@/hooks/queries/useModuleVideos';
import { useSubjects } from '@/hooks/queries/useSubjects';
import { getPresignUrl } from '@/services/api/moduleVideos';
import { Film, Loader2, Plus, Trash2, Eye, EyeOff, Video } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';

function formatDuration(sec: number | null): string {
  if (!sec) return '—';
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function UploadForm({ moduleId, onDone }: { moduleId: string; onDone: () => void }) {
  const createVideo = useCreateModuleVideo(moduleId);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle]       = useState('');
  const [desc, setDesc]         = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [err, setErr]           = useState<string | null>(null);

  const uploadToS3 = async (file: File, uploadUrl: string, onProgress: (p: number) => void) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = e => { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)); };
      xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)));
      xhr.onerror = () => reject(new Error('Upload error'));
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoFile) { setErr('Title and video file are required'); return; }
    setErr(null); setUploading(true); setProgress(0);

    try {
      // 1. Upload video
      const { uploadUrl: videoUrl, key: videoKey } = await getPresignUrl(moduleId, videoFile.name, videoFile.type, 'video');
      await uploadToS3(videoFile, videoUrl, p => setProgress(Math.round(p * 0.9)));

      // 2. Upload thumbnail if provided
      let thumbKey: string | null = null;
      if (thumbFile) {
        const { uploadUrl: thumbUrl, key: tk } = await getPresignUrl(moduleId, thumbFile.name, thumbFile.type, 'thumbnail');
        await uploadToS3(thumbFile, thumbUrl, () => {});
        thumbKey = tk;
      }

      // 3. Get video duration client-side
      const duration = await new Promise<number | null>(resolve => {
        const v = document.createElement('video');
        v.preload = 'metadata';
        v.onloadedmetadata = () => resolve(Math.round(v.duration));
        v.onerror = () => resolve(null);
        v.src = URL.createObjectURL(videoFile);
      });

      // 4. Save metadata
      await createVideo.mutateAsync({
        moduleId, title: title.trim(), description: desc.trim(),
        s3Key: videoKey, thumbnailS3Key: thumbKey,
        durationSeconds: duration, sortOrder: 0, isActive: true,
      });
      setProgress(100);
      setTitle(''); setDesc(''); setVideoFile(null); setThumbFile(null);
      onDone();
    } catch (e: any) {
      setErr(e.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={labelStyle}>Video title *</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Lecture 01 — Introduction" style={inputStyle} required />
      </div>
      <div>
        <label style={labelStyle}>Description (optional)</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What this video covers…" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div>
        <label style={labelStyle}>Video file * (MP4, WebM — max 2 GB)</label>
        <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" onChange={e => setVideoFile(e.target.files?.[0] ?? null)} style={{ display: 'none' }} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button type="button" onClick={() => videoInputRef.current?.click()} style={filePickBtn}>
            <Video size={15} /> {videoFile ? videoFile.name : 'Choose video'}
          </button>
          {videoFile && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{(videoFile.size / 1024 / 1024).toFixed(1)} MB</span>}
        </div>
      </div>
      <div>
        <label style={labelStyle}>Thumbnail image (optional — JPG, PNG)</label>
        <input ref={thumbInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setThumbFile(e.target.files?.[0] ?? null)} style={{ display: 'none' }} />
        <button type="button" onClick={() => thumbInputRef.current?.click()} style={filePickBtn}>
          <Film size={15} /> {thumbFile ? thumbFile.name : 'Choose thumbnail'}
        </button>
      </div>

      {uploading && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
            <span>Uploading…</span><span>{progress}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'var(--border-color)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, borderRadius: 999, background: 'var(--accent-blue)', transition: 'width .2s' }} />
          </div>
        </div>
      )}

      {err && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#b91c1c' }}>{err}</div>}

      <button type="submit" disabled={uploading} style={{ padding: '11px 20px', border: 'none', borderRadius: 10, background: 'var(--accent-blue)', color: '#fff', fontFamily: 'var(--font-display,Nunito,sans-serif)', fontWeight: 700, fontSize: 14, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start' }}>
        {uploading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Uploading…</> : <><Plus size={16} />Add video</>}
      </button>
    </form>
  );
}

function ModuleVideosContent() {
  const { id: moduleId } = useParams<{ id: string }>();
  const { data: subjects = [] } = useSubjects();
  const { data: videos = [], isLoading } = useAllModuleVideos(moduleId);
  const updateVideo = useUpdateModuleVideo(moduleId);
  const deleteVideo = useDeleteModuleVideo(moduleId);

  const [showForm, setShowForm]         = useState(false);
  const [playingVideo, setPlayingVideo] = useState<{ s3Key: string; title: string } | null>(null);
  const [deletingId, setDeletingId]     = useState<string | null>(null);

  // Find module name from subjects cache
  const module = subjects.flatMap(s => s.modules).find(m => m.id === moduleId);
  const subject = subjects.find(s => s.modules.some(m => m.id === moduleId));

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video? The S3 file will remain (remove manually from AWS console).')) return;
    setDeletingId(id);
    try { await deleteVideo.mutateAsync(id); } finally { setDeletingId(null); }
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', gap: 6 }}>
          <Link href="/admin/subjects" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Subjects</Link>
          <span>/</span>
          <span>{subject?.name ?? '…'}</span>
          <span>/</span>
          <span>{module?.name ?? 'Module'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {module?.name ?? 'Module'} — Videos
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
              Upload lecture videos. Students stream from S3 — download is blocked.
            </p>
          </div>
          <button onClick={() => setShowForm(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', border: 'none', borderRadius: 10, background: 'var(--accent-blue)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            <Plus size={16} />{showForm ? 'Cancel' : 'Add video'}
          </button>
        </div>
      </div>

      {/* Upload form */}
      {showForm && (
        <div style={{ padding: 24, border: '1px solid var(--border-color)', borderRadius: 14, background: 'var(--bg-secondary)', marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 18 }}>Upload new video</h3>
          <UploadForm moduleId={moduleId} onDone={() => setShowForm(false)} />
        </div>
      )}

      {/* Videos list */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>Loading…</div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', border: '2px dashed var(--border-color)', borderRadius: 16 }}>
          <Film size={40} style={{ color: 'var(--text-secondary)', marginBottom: 12 }} />
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>No videos yet</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Add the first video above.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {videos.map((v, i) => (
            <div key={v.id} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '16px 18px', border: '1px solid var(--border-color)', borderRadius: 14, background: 'var(--bg-card)', opacity: v.isActive ? 1 : 0.55 }}>
              {/* Thumbnail / placeholder */}
              <div style={{ width: 80, height: 52, borderRadius: 8, background: 'var(--bg-secondary)', flexShrink: 0, display: 'grid', placeItems: 'center', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setPlayingVideo({ s3Key: v.s3Key, title: v.title })}>
                <Video size={24} style={{ color: 'var(--accent-blue)' }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 12 }}>
                  <span>#{i + 1}</span>
                  {v.durationSeconds && <span>⏱ {formatDuration(v.durationSeconds)}</span>}
                  {!v.isActive && <span style={{ color: 'var(--accent-yellow)' }}>Hidden</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button title="Preview" onClick={() => setPlayingVideo({ s3Key: v.s3Key, title: v.title })} style={iconBtn}>
                  <Eye size={15} />
                </button>
                <button title={v.isActive ? 'Hide' : 'Show'} onClick={() => updateVideo.mutate({ id: v.id, data: { isActive: !v.isActive } })} style={iconBtn}>
                  {v.isActive ? <EyeOff size={15} /> : <Eye size={15} style={{ color: 'var(--accent-green)' }} />}
                </button>
                <button title="Delete" onClick={() => handleDelete(v.id)} disabled={deletingId === v.id} style={{ ...iconBtn, color: 'var(--accent-red)' }}>
                  {deletingId === v.id ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video player modal */}
      {playingVideo && (
        <VideoPlayerModal
          isOpen
          s3Key={playingVideo.s3Key}
          title={playingVideo.title}
          onClose={() => setPlayingVideo(null)}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function AdminModuleVideosPage() {
  return <AdminOnlyGate><ModuleVideosContent /></AdminOnlyGate>;
}

const labelStyle: React.CSSProperties   = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 };
const inputStyle: React.CSSProperties   = { width: '100%', padding: '10px 13px', border: '1px solid var(--border-color)', borderRadius: 9, fontSize: 14, color: 'var(--text-primary)', background: 'var(--bg-primary)', outline: 'none', boxSizing: 'border-box' as const };
const filePickBtn: React.CSSProperties  = { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 14px', border: '1.5px solid var(--border-color)', borderRadius: 9, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' };
const iconBtn: React.CSSProperties      = { width: 32, height: 32, border: '1px solid var(--border-color)', borderRadius: 8, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'grid', placeItems: 'center' };
