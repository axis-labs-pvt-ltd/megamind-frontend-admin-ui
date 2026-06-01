// Client Component
'use client';

import { useCollectionById, useUpdateCollection } from '@/hooks/queries/useFlashcardCollections';
import Link from 'next/link';
import { use } from 'react';
import { CollectionForm, CollectionFormValues } from '../../components/CollectionForm';

export default function EditFlashcardCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: col, isLoading } = useCollectionById(id);
  const update = useUpdateCollection();

  const handleSubmit = async (values: CollectionFormValues) => {
    await update.mutateAsync({
      id,
      input: {
        title: values.title,
        description: values.description,
        subjectName: values.subjectName || undefined,
        level: values.level,
        coverEmoji: values.coverEmoji,
        coverColor: values.coverColor,
        tutorName: values.tutorName,
        price: values.price,
        visibility: values.visibility,
        tags: values.tags,
        isActive: values.isActive,
      },
    });
  };

  if (isLoading) return <div className="py-16 text-center text-[var(--text-secondary)] text-sm">Loading…</div>;
  if (!col) return <div className="py-16 text-center text-red-500 text-sm">Collection not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono text-[var(--text-tertiary)] tracking-widest mb-1">CREATOR STUDIO · EDIT DETAILS</div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit collection</h1>
        </div>
        <Link href={`/admin/flashcards/${id}/cards`}
          className="px-4 py-2 rounded-xl border-2 border-[var(--border-accent)] bg-[var(--accent-blue)] text-white font-semibold text-sm hover:opacity-90">
          Edit cards →
        </Link>
      </div>

      {update.error && (
        <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">
          {(update.error as Error).message}
        </div>
      )}
      {update.isSuccess && (
        <div className="px-4 py-3 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm">
          Changes saved.
        </div>
      )}

      <CollectionForm
        initial={col}
        collectionId={id}
        onSubmit={handleSubmit}
        isSubmitting={update.isPending}
      />
    </div>
  );
}
