// Client Component
'use client';

import { useCreateCollection } from '@/hooks/queries/useFlashcardCollections';
import { useAuth } from '@/contexts/authcontext';
import { useRouter } from 'next/navigation';
import { CollectionForm, CollectionFormValues } from '../components/CollectionForm';

export default function NewFlashcardCollectionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const create = useCreateCollection();

  const handleSubmit = async (values: CollectionFormValues) => {
    const col = await create.mutateAsync({
      title: values.title,
      description: values.description,
      subjectName: values.subjectName || undefined,
      level: values.level,
      coverEmoji: values.coverEmoji,
      coverColor: values.coverColor,
      tutorId: user?.id ?? '',
      tutorName: values.tutorName,
      price: values.price,
      visibility: values.visibility,
      tags: values.tags,
      isBestseller: false,
      isNew: true,
      isActive: values.isActive,
    });
    router.push(`/admin/flashcards/${col.id}/cards`);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-mono text-[var(--text-tertiary)] tracking-widest mb-1">CREATOR STUDIO · STEP 1 OF 2</div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">New collection</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Set up the basics. You'll add cards on the next step.</p>
      </div>

      {/* Progress */}
      <div className="flex gap-3 max-w-xs">
        <div className="flex-1">
          <div className="h-1 rounded-full bg-[var(--accent-blue)]" />
          <div className="text-xs text-[var(--text-secondary)] mt-1.5 font-mono">1. Details</div>
        </div>
        <div className="flex-1">
          <div className="h-1 rounded-full bg-[var(--border-primary)]" />
          <div className="text-xs text-[var(--text-tertiary)] mt-1.5 font-mono">2. Add cards</div>
        </div>
      </div>

      {create.error && (
        <div className="px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">
          {(create.error as Error).message}
        </div>
      )}

      <CollectionForm
        onSubmit={handleSubmit}
        isSubmitting={create.isPending}
      />
    </div>
  );
}
