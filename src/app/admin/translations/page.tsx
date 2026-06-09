// Client Component - Admin: edit Sinhala translations
'use client';

import { useTranslations, useSaveTranslations } from '@/hooks/queries/useTranslations';
import { TranslationRow } from '@/services/api/translations';
import { useMemo, useState } from 'react';

const SECTION_LABELS: Record<string, string> = {
  nav: 'Navigation', how: 'How It Works', pricing: 'Pricing',
  faq: 'FAQ', subjects: 'Subjects', footer: 'Footer',
  flashcards: 'Flashcards', tests: 'Tests', quiz: 'Quiz',
};
const SECTIONS = Object.keys(SECTION_LABELS);

export default function TranslationsPage() {
  const { data: rows = [], isLoading, error } = useTranslations();
  const save = useSaveTranslations();

  const [activeSection, setActiveSection] = useState('nav');
  // pending edits: key → new SI value
  const [edits, setEdits] = useState<Record<string, string>>({});

  const sectionRows = useMemo(
    () => rows.filter(r => r.section === activeSection),
    [rows, activeSection]
  );

  const changedCount = Object.keys(edits).length;

  const handleChange = (key: string, val: string) => setEdits(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    const changes = Object.entries(edits).map(([key, si]) => ({ key, si }));
    save.mutate(changes, { onSuccess: () => setEdits({}) });
  };

  const handleDiscard = () => setEdits({});

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'var(--text-primary)', marginBottom:4 }}>Translations</h1>
          <p style={{ fontSize:14, color:'var(--text-secondary)' }}>Edit Sinhala (සිංහල) translations. English is read-only — changes to English must be made in code.</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {changedCount > 0 && (
            <button onClick={handleDiscard} style={ghostBtn}>Discard ({changedCount})</button>
          )}
          <button onClick={handleSave} disabled={changedCount === 0 || save.isPending} style={{ ...primaryBtn, opacity: changedCount === 0 ? 0.5 : 1 }}>
            {save.isPending ? 'Saving…' : `Save ${changedCount > 0 ? `(${changedCount})` : 'changes'}`}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding:16, borderRadius:10, background:'#FFF4F2', border:'1px solid #F6D4CD', color:'#C0392B', fontSize:14, marginBottom:20 }}>
          <b>Could not load translations.</b> Run migration 008 in Supabase to create the <code>translations</code> table.
        </div>
      )}

      {/* Save success */}
      {save.isSuccess && changedCount === 0 && (
        <div style={{ padding:12, borderRadius:10, background:'#E4F4EC', border:'1px solid #B7E0CB', color:'#1F8A5B', fontSize:14, marginBottom:20, fontWeight:600 }}>
          ✓ Changes saved — live on the landing page.
        </div>
      )}

      {/* Section tabs */}
      <div style={{ display:'flex', gap:4, borderBottom:'1px solid var(--border-primary)', marginBottom:24, flexWrap:'wrap' }}>
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setActiveSection(s)} style={{ padding:'10px 18px', border:'none', borderBottom: activeSection === s ? '3px solid var(--accent-orange)' : '3px solid transparent', background:'transparent', fontFamily:'var(--font-display,sans-serif)', fontWeight:700, fontSize:14, cursor:'pointer', color: activeSection === s ? 'var(--accent-orange)' : 'var(--text-secondary)', marginBottom:-1, whiteSpace:'nowrap' }}>
            {SECTION_LABELS[s]}
            {rows.filter(r => r.section === s && edits[r.key] !== undefined).length > 0 && (
              <span style={{ marginLeft:6, width:7, height:7, borderRadius:999, background:'var(--accent-orange)', display:'inline-block', verticalAlign:'middle' }} />
            )}
          </button>
        ))}
      </div>

      {isLoading && <div style={{ padding:'60px 0', textAlign:'center', color:'var(--text-muted)', fontSize:14 }}>Loading…</div>}

      {/* Translation rows */}
      {!isLoading && (
        <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
          {/* Column header */}
          <div style={{ display:'grid', gridTemplateColumns:'200px 1fr 1fr', gap:0, padding:'8px 16px', background:'var(--bg-primary)', borderRadius:'10px 10px 0 0', border:'1px solid var(--border-primary)' }}>
            <div style={colHdr}>Key</div>
            <div style={{ ...colHdr, borderLeft:'1px solid var(--border-primary)', paddingLeft:14 }}>English (read-only)</div>
            <div style={{ ...colHdr, borderLeft:'1px solid var(--border-primary)', paddingLeft:14 }}>සිංහල — Sinhala</div>
          </div>

          {sectionRows.map((row, i) => (
            <TranslationRowEl
              key={row.key}
              row={row}
              pendingValue={edits[row.key]}
              onChange={handleChange}
              isLast={i === sectionRows.length - 1}
            />
          ))}

          {sectionRows.length === 0 && !isLoading && !error && (
            <div style={{ padding:'40px 0', textAlign:'center', color:'var(--text-muted)', fontSize:14, border:'1px solid var(--border-primary)', borderTop:'none', borderRadius:'0 0 10px 10px' }}>
              No translations in this section yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TranslationRowEl({ row, pendingValue, onChange, isLast }: {
  row: TranslationRow;
  pendingValue: string | undefined;
  onChange: (key: string, val: string) => void;
  isLast: boolean;
}) {
  const currentSi = pendingValue ?? row.si;
  const isDirty   = pendingValue !== undefined && pendingValue !== row.si;
  const isMulti   = row.en.includes('\n') || row.en.length > 120;
  const radius    = isLast ? '0 0 10px 10px' : '0';

  return (
    <div style={{ display:'grid', gridTemplateColumns:'200px 1fr 1fr', gap:0, border:'1px solid var(--border-primary)', borderTop:'none', borderRadius:radius, background: isDirty ? 'rgba(255,106,44,0.04)' : 'var(--bg-card)' }}>
      {/* Key */}
      <div style={{ padding:'14px 16px', borderRight:'1px solid var(--border-primary)', display:'flex', flexDirection:'column', justifyContent:'flex-start', gap:4 }}>
        <code style={{ fontSize:11, color:'var(--text-muted)', wordBreak:'break-all', lineHeight:1.4 }}>{row.key}</code>
        {isDirty && <span style={{ fontSize:10, fontWeight:700, color:'var(--accent-orange)', textTransform:'uppercase', letterSpacing:'0.04em' }}>edited</span>}
      </div>
      {/* English */}
      <div style={{ padding:'14px 16px', borderRight:'1px solid var(--border-primary)', fontSize:13.5, color:'var(--text-secondary)', lineHeight:1.5, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
        {row.en}
      </div>
      {/* Sinhala editable */}
      <div style={{ padding:'10px 12px' }}>
        {isMulti ? (
          <textarea
            value={currentSi}
            onChange={e => onChange(row.key, e.target.value)}
            style={{ width:'100%', minHeight:80, padding:'8px 10px', border:`1px solid ${isDirty ? 'var(--accent-orange)' : 'var(--border-primary)'}`, borderRadius:8, fontSize:13.5, lineHeight:1.5, resize:'vertical', background:'var(--bg-primary)', color:'var(--text-primary)', fontFamily:'var(--font-sinhala,sans-serif)', boxSizing:'border-box' }}
          />
        ) : (
          <input
            value={currentSi}
            onChange={e => onChange(row.key, e.target.value)}
            style={{ width:'100%', padding:'8px 10px', border:`1px solid ${isDirty ? 'var(--accent-orange)' : 'var(--border-primary)'}`, borderRadius:8, fontSize:13.5, background:'var(--bg-primary)', color:'var(--text-primary)', fontFamily:'var(--font-sinhala,sans-serif)', boxSizing:'border-box' }}
          />
        )}
      </div>
    </div>
  );
}

const colHdr: React.CSSProperties = { fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--text-muted)', padding:'8px 0' };
const primaryBtn: React.CSSProperties = { padding:'10px 22px', borderRadius:10, border:'none', background:'var(--accent-orange)', color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer' };
const ghostBtn:   React.CSSProperties = { padding:'10px 22px', borderRadius:10, border:'1px solid var(--border-primary)', background:'var(--bg-card)', color:'var(--text-primary)', fontWeight:700, fontSize:14, cursor:'pointer' };
