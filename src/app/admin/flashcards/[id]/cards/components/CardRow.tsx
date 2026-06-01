// Client Component
'use client';

import { FlashCard, FlashCardType } from '@/types';

const TYPE_OPTIONS: { value: FlashCardType; label: string; icon: string }[] = [
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'image', label: 'Image', icon: '🖼' },
  { value: 'video', label: 'Video', icon: '🎬' },
];

interface DraftCard {
  id?: string;
  type: FlashCardType;
  front: string;
  back: string;
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
}

interface Props {
  card: DraftCard;
  index: number;
  onChange: (index: number, updated: Partial<DraftCard>) => void;
  onDelete: (index: number) => void;
}

export function CardRow({ card, index, onChange, onDelete }: Props) {
  return (
    <div className="grid gap-3 p-4 rounded-2xl border-2 border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-accent)] transition-colors"
      style={{ gridTemplateColumns: '36px 1fr 1fr 32px' }}>
      <div className="font-mono text-xs font-bold text-[var(--text-tertiary)] bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center border border-[var(--border-primary)] h-9 self-start mt-0.5">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="space-y-2">
        {/* Type selector */}
        <div className="flex gap-1 p-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] w-fit">
          {TYPE_OPTIONS.map(t => (
            <button key={t.value} type="button"
              onClick={() => onChange(index, { type: t.value })}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-colors ${card.type === t.value ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'text-[var(--text-secondary)]'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <textarea value={card.front} onChange={e => onChange(index, { front: e.target.value })}
          placeholder="Front · the prompt or term"
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-semibold resize-none focus:outline-none focus:border-[var(--border-accent)]" />
        {card.type === 'image' && (
          <input value={card.imageUrl ?? ''} onChange={e => onChange(index, { imageUrl: e.target.value })}
            placeholder="Image URL"
            className="w-full px-3 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--border-accent)]" />
        )}
        {card.type === 'video' && (
          <input value={card.videoUrl ?? ''} onChange={e => onChange(index, { videoUrl: e.target.value })}
            placeholder="Video URL (YouTube embed or direct)"
            className="w-full px-3 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--border-accent)]" />
        )}
      </div>

      <div className="space-y-1.5">
        <div className="text-xs font-mono text-[var(--text-tertiary)] font-semibold">📖 Back · theory</div>
        <textarea value={card.back} onChange={e => onChange(index, { back: e.target.value })}
          placeholder="Back · answer or theory snippet"
          rows={4}
          className="w-full px-3 py-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm resize-none focus:outline-none focus:border-[var(--border-accent)] leading-relaxed" />
      </div>

      <button type="button" onClick={() => onDelete(index)}
        className="h-9 w-8 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-300 transition-colors text-sm flex items-center justify-center self-start mt-0.5">
        🗑
      </button>
    </div>
  );
}

export type { DraftCard };
