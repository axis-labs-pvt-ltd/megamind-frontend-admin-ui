// Client Component - Question text editor with formula toolbar and image upload
'use client';

import { RichText } from '@/components/ui/RichText';
import { supabase } from '@/lib/supabase';
import { ImagePlus, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface QuestionTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  imageUrl?: string;
  onImageChange: (url: string | undefined) => void;
  error?: string;
}

// Chemical / math formula snippets
const FORMULA_SNIPPETS = [
  { label: 'Inline math', insert: '$  $', cursor: 1 },
  { label: 'Display math', insert: '$$  $$', cursor: 3 },
  { label: '\\ce{ }', insert: '$\\ce{  }$', cursor: 5, title: 'Chemical equation (mhchem)' },
  { label: '→', insert: '$\\rightarrow$', title: 'Reaction arrow' },
  { label: '⇌', insert: '$\\rightleftharpoons$', title: 'Equilibrium arrow' },
  { label: 'H₂O', insert: '$\\ce{H2O}$' },
  { label: 'CO₂', insert: '$\\ce{CO2}$' },
  { label: 'H₂SO₄', insert: '$\\ce{H2SO4}$' },
  { label: 'NaCl', insert: '$\\ce{NaCl}$' },
  { label: 'Δ', insert: '$\\Delta$', title: 'Delta' },
  { label: 'λ', insert: '$\\lambda$', title: 'Lambda (wavelength)' },
  { label: 'x²', insert: '$x^{2}$', title: 'Superscript' },
  { label: 'xₙ', insert: '$x_{n}$', title: 'Subscript' },
  { label: '½', insert: '$\\frac{1}{2}$', title: 'Fraction' },
  { label: '√x', insert: '$\\sqrt{x}$', title: 'Square root' },
];

export function QuestionTextEditor({ value, onChange, imageUrl, onImageChange, error }: QuestionTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState('');

  const insertAtCursor = (insert: string, cursorOffset?: number) => {
    const el = textareaRef.current;
    if (!el) return;
    const start  = el.selectionStart;
    const end    = el.selectionEnd;
    const before = value.slice(0, start);
    const after  = value.slice(end);
    const newVal = before + insert + after;
    onChange(newVal);
    // Restore cursor position
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + (cursorOffset ?? insert.length);
      el.setSelectionRange(pos, pos);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploadError('Not authenticated'); setUploading(false); return; }

    const ext  = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage.from('question-images').upload(path, file, { upsert: true });
    if (upErr) { setUploadError('Upload failed'); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from('question-images').getPublicUrl(path);
    onImageChange(publicUrl);
    setUploading(false);
    // Reset input so same file can be re-selected
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-[var(--text-secondary)]">
          Question Text <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={() => setShowPreview(p => !p)}
          className="text-xs text-[var(--accent-blue)] hover:underline"
        >
          {showPreview ? 'Hide preview' : 'Show preview'}
        </button>
      </div>

      {/* Formula toolbar */}
      <div className="flex flex-wrap gap-1 p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
        <span className="text-xs text-[var(--text-muted)] self-center mr-1 font-medium">Formula:</span>
        {FORMULA_SNIPPETS.map((s, i) => (
          <button
            key={i}
            type="button"
            title={s.title ?? s.label}
            onClick={() => insertAtCursor(s.insert, s.cursor)}
            className="px-2 py-0.5 text-xs rounded border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--accent-blue-light)] hover:border-[var(--accent-blue)] transition-colors font-mono"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
        placeholder={'Enter your question here...\nUse $formula$ for inline math, $$formula$$ for display math\nUse $\\ce{H2O}$ for chemical equations'}
      />

      {/* Live preview */}
      {showPreview && value && (
        <div className="px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm">
          <div className="text-xs text-[var(--text-muted)] mb-2 font-medium uppercase tracking-wide">Preview</div>
          <RichText text={value} />
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Image upload */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <ImagePlus className="h-4 w-4" />
            {uploading ? 'Uploading…' : imageUrl ? 'Replace image' : 'Add image'}
          </button>
          {imageUrl && (
            <button
              type="button"
              onClick={() => onImageChange(undefined)}
              className="flex items-center gap-1 px-2 py-2 text-xs rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
              title="Remove image"
            >
              <X className="h-3 w-3" /> Remove
            </button>
          )}
          {uploadError && <span className="text-xs text-red-500">{uploadError}</span>}
        </div>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

        {imageUrl && (
          <div className="relative inline-block">
            <img
              src={imageUrl}
              alt="Question"
              className="max-h-48 rounded-lg border border-[var(--border-primary)] object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
