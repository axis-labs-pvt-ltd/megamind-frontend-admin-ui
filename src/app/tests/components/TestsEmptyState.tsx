// Client Component - Empty state for tests list
'use client';

import { useRouter } from 'next/navigation';

interface TestsEmptyStateProps {
  activeFiltersCount: number;
  onClearFilters: () => void;
}

export function TestsEmptyState({ activeFiltersCount, onClearFilters }: TestsEmptyStateProps) {
  const router = useRouter();

  return (
    <div style={{ textAlign: 'center', padding: '64px 24px' }}>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--bg-secondary)', border: '1.5px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>
        🔍
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>No tests found</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
        {activeFiltersCount > 0 ? 'Try adjusting your filters to see more results.' : 'No tests match your search criteria.'}
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            style={{ padding: '9px 20px', borderRadius: 10, border: '1.5px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        )}
        <button
          onClick={() => router.push('/tests/create')}
          style={{ padding: '9px 20px', borderRadius: 10, border: '1.5px solid var(--border-primary)', background: 'var(--accent-blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          Create a Test
        </button>
      </div>
    </div>
  );
}
