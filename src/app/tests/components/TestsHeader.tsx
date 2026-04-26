// Client Component - Tests page header
'use client';

import { useRouter } from 'next/navigation';

interface TestsHeaderProps {
  totalTests: number;
  availableTestsCount: number;
  activeFiltersCount: number;
}

export function TestsHeader({ totalTests, availableTestsCount, activeFiltersCount }: TestsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--text-secondary)] mb-1">Management</p>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Tests</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {availableTestsCount} of {totalTests} test{totalTests !== 1 ? 's' : ''}
          {activeFiltersCount > 0 && (
            <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]">
              {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
            </span>
          )}
        </p>
      </div>
      <button
        onClick={() => router.push('/tests/create')}
        style={{
          padding: '10px 20px',
          border: '2px solid var(--border-primary)',
          borderRadius: 10,
          background: 'var(--accent-blue)',
          color: '#fff',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Create Test
      </button>
    </div>
  );
}
