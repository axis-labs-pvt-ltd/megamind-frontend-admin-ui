// Client Component
'use client';

import { useAllCollections, useDeleteCollection } from '@/hooks/queries/useFlashcardCollections';
import { FlashCardCollection } from '@/types';
import Link from 'next/link';

const COVER_COLORS: Record<string, string> = {
  'var(--p-card-a)': '#E8F4F8',
  'var(--p-card-b)': '#FFF2DD',
  'var(--p-card-c)': '#F0F4FF',
  'var(--p-card-d)': '#FFF0F0',
  'var(--p-card-e)': '#F0FFF4',
};

function CollectionRow({ col }: { col: FlashCardCollection }) {
  const del = useDeleteCollection();
  const visLabel: Record<string, string> = { public_free: 'Public · Free', paid: `Paid · Rs. ${col.price}`, private: 'Private' };
  const visBg: Record<string, string> = { public_free: 'var(--accent-green-light)', paid: 'var(--accent-yellow-light)', private: 'var(--bg-tertiary)' };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-accent)] transition-colors">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border border-[var(--border-primary)]"
        style={{ background: col.coverColor }}>
        {col.coverEmoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[var(--text-primary)] truncate">{col.title}</div>
        <div className="text-xs text-[var(--text-secondary)] mt-0.5">{col.subjectName ?? col.level} · {col.cardCount} cards · by {col.tutorName}</div>
      </div>
      <span className="hidden sm:inline-flex text-xs px-2.5 py-1 rounded-full border border-[var(--border-primary)]"
        style={{ background: visBg[col.visibility] }}>
        {visLabel[col.visibility]}
      </span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${col.isActive ? 'bg-[var(--accent-green-light)] text-green-700' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>
        {col.isActive ? 'Active' : 'Draft'}
      </span>
      <div className="flex gap-2 flex-shrink-0">
        <Link href={`/admin/flashcards/${col.id}/cards`}
          className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-primary)]">
          Edit cards
        </Link>
        <Link href={`/admin/flashcards/${col.id}/edit`}
          className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-primary)]">
          Details
        </Link>
        <button onClick={() => { if (confirm('Delete this collection?')) del.mutate(col.id); }}
          className="px-3 py-1.5 text-xs rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors text-red-600">
          Delete
        </button>
      </div>
    </div>
  );
}

export default function AdminFlashcardsPage() {
  const { data: collections = [], isLoading } = useAllCollections();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Flashcard Collections</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{collections.length} collections total</p>
        </div>
        <Link href="/admin/flashcards/new"
          className="px-4 py-2 rounded-xl border-2 border-[var(--border-accent)] bg-[var(--accent-blue)] text-white font-semibold text-sm hover:opacity-90 transition-opacity">
          + New collection
        </Link>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-[var(--text-secondary)] text-sm">Loading collections…</div>
      ) : collections.length === 0 ? (
        <div className="py-16 text-center">
          <div className="text-4xl mb-4">🃏</div>
          <div className="font-semibold text-[var(--text-primary)] mb-2">No collections yet</div>
          <div className="text-sm text-[var(--text-secondary)] mb-6">Create your first flashcard collection to get started.</div>
          <Link href="/admin/flashcards/new"
            className="px-5 py-2.5 rounded-xl border-2 border-[var(--border-accent)] bg-[var(--accent-blue)] text-white font-semibold text-sm hover:opacity-90 transition-opacity">
            Create collection →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {collections.map(col => <CollectionRow key={col.id} col={col} />)}
        </div>
      )}
    </div>
  );
}
