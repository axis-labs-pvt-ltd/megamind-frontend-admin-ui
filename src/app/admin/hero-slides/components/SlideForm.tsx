// Client Component - Add / Edit hero slide form
'use client';

import { HeroSlide, SlideInput } from '@/services/api/heroSlides';
import { useState } from 'react';

interface Props {
  initial?: HeroSlide;
  onSave: (data: SlideInput) => void;
  onCancel: () => void;
  saving: boolean;
}

type StatRow = { n: string; l: string; star: boolean };
type ChipRow = { n: string; e: string };

export function SlideForm({ initial, onSave, onCancel, saving }: Props) {
  const [chip,         setChip]         = useState(initial?.chip          ?? '');
  const [title,        setTitle]        = useState(initial?.title         ?? '');
  const [body,         setBody]         = useState(initial?.body          ?? '');
  const [primaryLabel, setPrimaryLabel] = useState(initial?.primaryLabel  ?? '');
  const [primaryHref,  setPrimaryHref]  = useState(initial?.primaryHref   ?? '');
  const [ghostLabel,   setGhostLabel]   = useState(initial?.ghostLabel    ?? '');
  const [ghostHref,    setGhostHref]    = useState(initial?.ghostHref     ?? '');
  const [photoUrl,     setPhotoUrl]     = useState(initial?.photoUrl      ?? '');
  const [sortOrder,    setSortOrder]    = useState(initial?.sortOrder      ?? 0);
  const [isActive,     setIsActive]     = useState(initial?.isActive       ?? true);
  const [stats,        setStats]        = useState<StatRow[]>(initial?.stats?.map(s => ({ n: s.n, l: s.l, star: s.star ?? false })) ?? []);
  const [chips,        setChips]        = useState<ChipRow[]>(initial?.subjectChips ?? []);

  const addStat  = () => setStats(s => [...s, { n: '', l: '', star: false }]);
  const addChip  = () => setChips(c => [...c, { n: '', e: '' }]);
  const rmStat   = (i: number) => setStats(s => s.filter((_, x) => x !== i));
  const rmChip   = (i: number) => setChips(c => c.filter((_, x) => x !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ chip, title, body, primaryLabel, primaryHref, ghostLabel, ghostHref, photoUrl, sortOrder, isActive, stats: stats.length ? stats : null, subjectChips: chips.length ? chips : null });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <Field label="Chip label" value={chip} onChange={setChip} required />
        <Field label="Sort order" type="number" value={String(sortOrder)} onChange={v => setSortOrder(Number(v))} />
      </div>
      <Field label="Title (use \\n for line break)" value={title} onChange={setTitle} required />
      <Field label="Body text" value={body} onChange={setBody} textarea required />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <Field label="Primary button label" value={primaryLabel} onChange={setPrimaryLabel} required />
        <Field label="Primary button href"  value={primaryHref}  onChange={setPrimaryHref}  required />
        <Field label="Ghost button label"   value={ghostLabel}   onChange={setGhostLabel}   required />
        <Field label="Ghost button href"    value={ghostHref}    onChange={setGhostHref}    required />
      </div>
      <div>
        <Field label="Photo URL or path (e.g. /hero-student.jpg)" value={photoUrl} onChange={setPhotoUrl} required />
        {photoUrl && <img src={photoUrl} alt="" style={{ marginTop:8, height:80, borderRadius:8, objectFit:'cover', border:'1px solid var(--border-primary)' }} />}
      </div>

      {/* Stats rows */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <label style={lbl}>Stats (optional, shown below title)</label>
          <button type="button" onClick={addStat} style={addBtn}>+ Add stat</button>
        </div>
        {stats.map((s, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto auto', gap:8, marginBottom:8, alignItems:'center' }}>
            <input style={inp} placeholder="Value e.g. 12,400+" value={s.n} onChange={e => setStats(prev => prev.map((x,j) => j===i ? {...x,n:e.target.value} : x))} />
            <input style={inp} placeholder="Label e.g. Students" value={s.l} onChange={e => setStats(prev => prev.map((x,j) => j===i ? {...x,l:e.target.value} : x))} />
            <label style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'var(--text-secondary)', cursor:'pointer' }}>
              <input type="checkbox" checked={s.star} onChange={e => setStats(prev => prev.map((x,j) => j===i ? {...x,star:e.target.checked} : x))} />★
            </label>
            <button type="button" onClick={() => rmStat(i)} style={rmBtn}>✕</button>
          </div>
        ))}
      </div>

      {/* Subject chips */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <label style={lbl}>Subject chips (optional, replaces stats)</label>
          <button type="button" onClick={addChip} style={addBtn}>+ Add chip</button>
        </div>
        {chips.map((c, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8, marginBottom:8 }}>
            <input style={inp} placeholder="Name e.g. Physics"  value={c.n} onChange={e => setChips(prev => prev.map((x,j) => j===i ? {...x,n:e.target.value} : x))} />
            <input style={inp} placeholder="Emoji e.g. ⚛️"      value={c.e} onChange={e => setChips(prev => prev.map((x,j) => j===i ? {...x,e:e.target.value} : x))} />
            <button type="button" onClick={() => rmChip(i)} style={rmBtn}>✕</button>
          </div>
        ))}
      </div>

      <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:14, color:'var(--text-primary)' }}>
        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
        Active (show on landing page)
      </label>

      <div style={{ display:'flex', gap:10, paddingTop:8, borderTop:'1px solid var(--border-primary)' }}>
        <button type="submit" disabled={saving} style={{ padding:'10px 22px', borderRadius:10, border:'none', background:'var(--accent-orange)', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer' }}>
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Add slide'}
        </button>
        <button type="button" onClick={onCancel} style={{ padding:'10px 22px', borderRadius:10, border:'1px solid var(--border-primary)', background:'var(--bg-card)', color:'var(--text-primary)', fontWeight:700, fontSize:14, cursor:'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, textarea, required, type }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; required?: boolean; type?: string }) {
  const style = inp;
  return (
    <div>
      <label style={lbl}>{label}{required && <span style={{ color:'var(--accent-orange)' }}> *</span>}</label>
      {textarea
        ? <textarea style={{ ...style, height:80, resize:'vertical' }} value={value} onChange={e => onChange(e.target.value)} required={required} />
        : <input type={type ?? 'text'} style={style} value={value} onChange={e => onChange(e.target.value)} required={required} />
      }
    </div>
  );
}

const lbl: React.CSSProperties = { display:'block', fontSize:12, fontWeight:700, color:'var(--text-secondary)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.04em' };
const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid var(--border-primary)', background:'var(--bg-primary)', color:'var(--text-primary)', fontSize:14, boxSizing:'border-box' };
const addBtn: React.CSSProperties = { padding:'5px 12px', borderRadius:8, border:'1px solid var(--border-primary)', background:'var(--bg-card)', color:'var(--text-secondary)', fontSize:12, fontWeight:700, cursor:'pointer' };
const rmBtn:  React.CSSProperties = { padding:'5px 10px', borderRadius:8, border:'1px solid var(--border-primary)', background:'transparent', color:'var(--text-muted)', fontSize:12, cursor:'pointer' };
