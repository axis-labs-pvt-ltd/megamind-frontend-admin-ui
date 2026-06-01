// Client Component
'use client';

import { FlashCardCollection, FlashCardVisibility } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const COVER_OPTIONS = [
  { emoji: '🧪', color: '#FFE4E4', label: 'Chemistry' },
  { emoji: '⚛️', color: '#E4F0FF', label: 'Physics' },
  { emoji: '💻', color: '#E4FFE9', label: 'ICT' },
  { emoji: '📐', color: '#FFF8E4', label: 'Maths' },
  { emoji: '📚', color: '#F0E4FF', label: 'English' },
  { emoji: '🌿', color: '#E4FFF0', label: 'Biology' },
];

const LEVEL_OPTIONS = ['O/L · Grade 6–11', 'A/L · Grade 12–13', 'University entrance', 'All levels'];

export interface CollectionFormValues {
  title: string;
  description: string;
  subjectName: string;
  level: string;
  coverEmoji: string;
  coverColor: string;
  tutorName: string;
  price: number;
  visibility: FlashCardVisibility;
  tags: string[];
  isActive: boolean;
}

interface Props {
  initial?: Partial<CollectionFormValues>;
  collectionId?: string;
  onSubmit: (values: CollectionFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function CollectionForm({ initial, collectionId, onSubmit, isSubmitting }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CollectionFormValues>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    subjectName: initial?.subjectName ?? '',
    level: initial?.level ?? LEVEL_OPTIONS[1],
    coverEmoji: initial?.coverEmoji ?? '📚',
    coverColor: initial?.coverColor ?? '#F0E4FF',
    tutorName: initial?.tutorName ?? '',
    price: initial?.price ?? 500,
    visibility: initial?.visibility ?? 'public_free',
    tags: initial?.tags ?? [],
    isActive: initial?.isActive ?? true,
  });
  const [tagInput, setTagInput] = useState('');

  const set = (key: keyof CollectionFormValues, val: any) => setForm(f => ({ ...f, [key]: val }));

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) set('tags', [...form.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    if (collectionId) router.push(`/admin/flashcards/${collectionId}/cards`);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40 }} className="fc-admin-grid">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basics */}
        <div className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] space-y-4">
          <h2 className="font-bold text-[var(--text-primary)] text-lg">Basics</h2>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Collection title</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} required
              placeholder="e.g. A/L Chemistry — Periodic Table"
              className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Short description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
              placeholder="One sentence — what will students learn?"
              className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Subject</label>
              <input value={form.subjectName} onChange={e => set('subjectName', e.target.value)}
                placeholder="e.g. Chemistry"
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Level</label>
              <select value={form.level} onChange={e => set('level', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] text-sm">
                {LEVEL_OPTIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Tutor / Author name</label>
            <input value={form.tutorName} onChange={e => set('tutorName', e.target.value)} required
              placeholder="e.g. Mr. Bandara"
              className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-2 p-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
              {form.tags.map(t => (
                <span key={t} onClick={() => set('tags', form.tags.filter(x => x !== t))}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-[var(--bg-tertiary)] border border-[var(--border-primary)] cursor-pointer hover:border-red-300 hover:text-red-500">
                  {t} ✕
                </span>
              ))}
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                placeholder="Type tag + Enter"
                className="flex-1 min-w-24 bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]" />
            </div>
          </div>
        </div>

        {/* Cover */}
        <div className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] space-y-4">
          <h2 className="font-bold text-[var(--text-primary)] text-lg">Cover & Visibility</h2>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Cover style</label>
            <div className="grid grid-cols-6 gap-2">
              {COVER_OPTIONS.map(o => (
                <button key={o.emoji} type="button"
                  onClick={() => { set('coverEmoji', o.emoji); set('coverColor', o.color); }}
                  className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all border-2 ${form.coverEmoji === o.emoji ? 'border-[var(--accent-blue)] scale-105' : 'border-[var(--border-primary)]'}`}
                  style={{ background: o.color }}>
                  {o.emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Visibility</label>
            {(['public_free', 'paid', 'private'] as FlashCardVisibility[]).map(v => (
              <label key={v} className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${form.visibility === v ? 'border-[var(--border-accent)] bg-[var(--bg-secondary)]' : 'border-[var(--border-primary)]'}`}>
                <input type="radio" name="vis" value={v} checked={form.visibility === v} onChange={() => set('visibility', v)} className="mt-0.5 accent-[var(--accent-blue)]" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {v === 'public_free' ? 'Public · Free' : v === 'paid' ? 'Paid · One-time' : 'Private'}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {v === 'public_free' ? 'Anyone can study for free.' : v === 'paid' ? 'Set a price students pay once.' : 'Only you can see this.'}
                  </div>
                  {v === 'paid' && form.visibility === 'paid' && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[var(--text-secondary)]">Rs.</span>
                      <input type="number" min={100} value={form.price} onChange={e => set('price', Number(e.target.value))}
                        className="w-24 px-2 py-1 text-sm rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)]" />
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="rounded accent-[var(--accent-blue)]" />
            <span className="text-sm text-[var(--text-primary)]">Publish immediately</span>
          </label>
        </div>

        <div className="flex justify-between">
          <button type="button" onClick={() => router.push('/admin/flashcards')}
            className="px-4 py-2.5 rounded-xl border border-[var(--border-primary)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border-2 border-[var(--border-accent)] bg-[var(--accent-blue)] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60">
            {isSubmitting ? 'Saving…' : 'Save & add cards →'}
          </button>
        </div>
      </form>

      {/* Live preview */}
      <aside className="sticky top-24 self-start space-y-4">
        <div className="text-xs font-mono font-bold text-[var(--text-tertiary)] mb-2 tracking-widest">LIVE PREVIEW</div>
        <div className="rounded-2xl border-2 border-[var(--border-primary)] overflow-hidden shadow-md">
          <div className="p-8 flex items-center justify-center border-b-2 border-[var(--border-primary)]" style={{ background: form.coverColor, aspectRatio: '4/3' }}>
            <span style={{ fontSize: 64 }}>{form.coverEmoji}</span>
          </div>
          <div className="p-5 bg-[var(--bg-card)]">
            <div className="flex gap-2 mb-3">
              {form.subjectName && <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)]">{form.subjectName}</span>}
              <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)]">{form.level.split(' ')[0]}</span>
            </div>
            <h3 className="font-bold text-[var(--text-primary)] text-base leading-snug mb-1">{form.title || 'Untitled collection'}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{form.description || 'Description preview…'}</p>
            <div className="mt-4 pt-3 border-t border-dashed border-[var(--border-primary)] flex justify-between text-xs text-[var(--text-tertiary)] font-mono">
              <span>0 cards</span>
              <span>by {form.tutorName || 'you'}</span>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--accent-yellow-light)]">
          <div className="text-sm">💡 <strong>Tip:</strong> Collections with 20–50 cards perform best.</div>
        </div>
      </aside>

      <style>{`.fc-admin-grid { @media (max-width: 900px) { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
