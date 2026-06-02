// Client Component
'use client';

import { useCollectionById } from '@/hooks/queries/useFlashcardCollections';
import { useFlashcardsByCollection } from '@/hooks/queries/useFlashcards';
import { useBulkUpsertCards } from '@/hooks/queries/useFlashcards';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { CardRow, DraftCard } from './components/CardRow';

export default function CardEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: col } = useCollectionById(id);
  const { data: savedCards = [], isLoading } = useFlashcardsByCollection(id);
  const bulkUpsert = useBulkUpsertCards();

  const [cards, setCards] = useState<DraftCard[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (savedCards.length > 0) {
      setCards(savedCards.map(c => ({ id: c.id, type: c.type, front: c.front, back: c.back, imageUrl: c.imageUrl, videoUrl: c.videoUrl, tags: c.tags })));
    }
  }, [savedCards]);

  const addCard = () => setCards(c => [...c, { type: 'text', front: '', back: '', tags: [] }]);

  const changeCard = (index: number, updated: Partial<DraftCard>) =>
    setCards(c => c.map((card, i) => i === index ? { ...card, ...updated } : card));

  const deleteCard = (index: number) => setCards(c => c.filter((_, i) => i !== index));

  const handleSave = async (publish: boolean) => {
    await bulkUpsert.mutateAsync({ collectionId: id, cards: cards.map((c, i) => ({ ...c, order: i })) });
    if (publish) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-mono text-[var(--text-tertiary)] tracking-widest mb-1">CREATOR STUDIO · STEP 2 OF 2</div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Add the cards</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Front = prompt. Back = answer / theory snippet.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => handleSave(false)} disabled={bulkUpsert.isPending}
            className="px-4 py-2 rounded-xl border border-[var(--border-primary)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]">
            Save draft
          </button>
          <button onClick={() => handleSave(true)} disabled={bulkUpsert.isPending || cards.length === 0}
            className="px-4 py-2 rounded-xl border-2 border-[var(--border-accent)] bg-[var(--accent-blue)] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50">
            {bulkUpsert.isPending ? 'Saving…' : 'Publish →'}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-3 max-w-xs">
        <div className="flex-1">
          <div className="h-1 rounded-full bg-green-500" />
          <div className="text-xs text-green-600 mt-1.5 font-mono">✓ Details</div>
        </div>
        <div className="flex-1">
          <div className="h-1 rounded-full bg-[var(--accent-blue)]" />
          <div className="text-xs text-[var(--text-secondary)] mt-1.5 font-mono">2. Add cards</div>
        </div>
      </div>

      {saved && <div className="px-4 py-3 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm">🎉 Published successfully!</div>}
      {bulkUpsert.error && <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">{(bulkUpsert.error as Error).message}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 28, alignItems: 'start' }} className="card-edit-layout">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[var(--text-primary)]">{cards.length} cards</h2>
            <button type="button" onClick={addCard}
              className="px-3 py-1.5 rounded-lg border-2 border-[var(--border-accent)] bg-[var(--accent-blue)] text-white text-sm font-semibold hover:opacity-90">
              + Add card
            </button>
          </div>

          {isLoading ? (
            <div className="py-10 text-center text-sm text-[var(--text-secondary)]">Loading…</div>
          ) : (
            <>
              {cards.map((card, i) => (
                <CardRow key={i} card={card} index={i} onChange={changeCard} onDelete={deleteCard} />
              ))}
              <button type="button" onClick={addCard}
                className="w-full py-5 rounded-2xl border-2 border-dashed border-[var(--border-primary)] text-[var(--text-tertiary)] font-semibold text-sm hover:border-[var(--border-accent)] hover:text-[var(--accent-blue)] transition-colors">
                + Add another card
              </button>
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="sticky top-24 space-y-4">
          <div className="p-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)]">
            <div className="text-xs font-mono text-[var(--text-tertiary)] mb-2 tracking-widest">EDITING</div>
            <div className="font-bold text-[var(--text-primary)] text-sm mb-2">{col?.title ?? '…'}</div>
            <div className="flex gap-1.5 flex-wrap mb-3">
              {col?.subjectName && <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)]">{col.subjectName}</span>}
              <span className={`text-xs px-2 py-0.5 rounded-full border ${col?.visibility === 'public_free' ? 'bg-green-50 border-green-200 text-green-700' : col?.visibility === 'paid' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-[var(--bg-secondary)] border-[var(--border-primary)]'}`}>
                {col?.visibility === 'public_free' ? 'Public · Free' : col?.visibility === 'paid' ? `Paid · Rs. ${col.price}` : 'Private'}
              </span>
            </div>
            <Link href={`/admin/flashcards/${id}/edit`}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline">
              ⚙ Edit collection details
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--text-primary)] text-[var(--bg-primary)] space-y-2">
            <div className="text-xs font-mono text-[var(--accent-yellow)] tracking-widest">CHECKLIST</div>
            {[
              { done: !!col?.title, label: 'Title & description' },
              { done: !!col?.coverEmoji, label: 'Cover style set' },
              { done: cards.length >= 20, label: `At least 20 cards (${cards.length}/20)` },
              { done: cards.every(c => c.front && c.back), label: 'All cards have front & back' },
            ].map(item => (
              <div key={item.label} className="flex gap-2 items-center text-sm opacity-90">
                <span>{item.done ? '✓' : '○'}</span>{item.label}
              </div>
            ))}
          </div>
        </aside>
      </div>

      <style>{`@media (max-width: 900px) { .card-edit-layout { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
