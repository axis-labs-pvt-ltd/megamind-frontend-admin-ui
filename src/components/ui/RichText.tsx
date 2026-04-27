// Client Component - Renders text with inline KaTeX math/chemistry formulas
'use client';

import katex from 'katex';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem'; // enables \ce{} for chemical equations

interface RichTextProps {
  text: string;
  className?: string;
}

// Splits text on $...$ and $$...$$ delimiters, renders each segment
export function RichText({ text, className }: RichTextProps) {
  const segments = parseSegments(text);

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (!seg.isFormula) return <span key={i}>{seg.content}</span>;

        try {
          const html = katex.renderToString(seg.content, {
            throwOnError: false,
            displayMode: seg.display,
            trust: false,
          });
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{ __html: html }}
              style={{ display: seg.display ? 'block' : 'inline' }}
            />
          );
        } catch {
          return <code key={i} style={{ color: 'var(--accent-red, #e74c3c)', fontSize: '0.9em' }}>{seg.content}</code>;
        }
      })}
    </span>
  );
}

interface Segment {
  content: string;
  isFormula: boolean;
  display: boolean;
}

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  // Match $$...$$ (display) then $...$ (inline)
  const re = /\$\$([^$]+)\$\$|\$([^$\n]+)\$/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ content: text.slice(last, match.index), isFormula: false, display: false });
    }
    const isDisplay = match[0].startsWith('$$');
    segments.push({ content: isDisplay ? match[1] : match[2], isFormula: true, display: isDisplay });
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    segments.push({ content: text.slice(last), isFormula: false, display: false });
  }

  return segments.length ? segments : [{ content: text, isFormula: false, display: false }];
}
