// Client Component - Search bar and quick filter chips
'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { FilterDifficulty, FilterStatus, FilterType } from '../hooks/useTestFilters';

interface TestsSearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (value: boolean) => void;
  activeFiltersCount: number;
  clearAllFilters: () => void;
  selectedType: FilterType;
  setSelectedType: (value: FilterType) => void;
  selectedDifficulty: FilterDifficulty;
  setSelectedDifficulty: (value: FilterDifficulty) => void;
  selectedStatus: FilterStatus;
  setSelectedStatus: (value: FilterStatus) => void;
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 14px',
        borderRadius: 999,
        border: `1.5px solid ${active ? 'var(--accent-blue)' : 'var(--border-primary)'}`,
        background: active ? 'var(--accent-blue)' : 'var(--bg-secondary)',
        color: active ? '#fff' : 'var(--text-secondary)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all .15s',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {label}
    </button>
  );
}

export function TestsSearchAndFilter({
  searchTerm, setSearchTerm,
  showAdvancedFilters, setShowAdvancedFilters,
  activeFiltersCount, clearAllFilters,
  selectedType, setSelectedType,
  selectedDifficulty, setSelectedDifficulty,
  selectedStatus, setSelectedStatus,
}: TestsSearchAndFilterProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Search row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none', fontSize: 16 }}>
            🔍
          </span>
          <input
            type="search"
            placeholder="Search tests, descriptions, tags…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              border: '1.5px solid var(--border-primary)',
              borderRadius: 10,
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box' as const,
            }}
          />
        </div>
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 16px',
            borderRadius: 10,
            border: `1.5px solid ${showAdvancedFilters ? 'var(--accent-blue)' : 'var(--border-primary)'}`,
            background: showAdvancedFilters ? 'var(--accent-blue)' : 'var(--bg-secondary)',
            color: showAdvancedFilters ? '#fff' : 'var(--text-secondary)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const,
          }}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFiltersCount > 0 && (
            <span style={{ background: showAdvancedFilters ? 'rgba(255,255,255,0.3)' : 'var(--accent-blue)', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' as const }}>
              {activeFiltersCount}
            </span>
          )}
        </button>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Quick filter chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginRight: 4 }}>Type</span>
        {(['all', 'static', 'dynamic'] as FilterType[]).map(t => (
          <Chip key={t} label={t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)} active={selectedType === t} onClick={() => setSelectedType(t)} />
        ))}
        <span style={{ width: 1, height: 18, background: 'var(--border-primary)', margin: '0 6px' }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginRight: 4 }}>Level</span>
        {(['all', 'beginner', 'intermediate', 'advanced'] as FilterDifficulty[]).map(d => (
          <Chip key={d} label={d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)} active={selectedDifficulty === d} onClick={() => setSelectedDifficulty(d)} />
        ))}
        <span style={{ width: 1, height: 18, background: 'var(--border-primary)', margin: '0 6px' }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginRight: 4 }}>Status</span>
        {(['all', 'active', 'inactive'] as FilterStatus[]).map(s => (
          <Chip key={s} label={s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} active={selectedStatus === s} onClick={() => setSelectedStatus(s)} />
        ))}
      </div>

    </div>
  );
}
