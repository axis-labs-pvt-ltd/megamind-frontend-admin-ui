'use client';

import { cn } from '@/lib/utils';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface TiptapEditorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const MenuButton = ({ onClick, disabled, isActive, label, title, className }: any) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            "px-2 py-1 rounded text-sm transition-colors min-w-[30px]",
            isActive ? "bg-[var(--accent-blue)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]",
            className
        )}
    >
        {label}
    </button>
);

export const TiptapEditor = ({ value, onChange, disabled = false }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
        attributes: {
            class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[150px] p-4 bg-[var(--bg-card)] text-[var(--text-primary)]'
        }
    }
  });

  // Sync content if value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
        if (value === '' && editor.getText() !== '') {
            editor.commands.setContent('');
        }
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-[var(--border-primary)] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[var(--accent-blue)] transition-all">
      {/* Toolbar */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] p-2 flex gap-1 flex-wrap">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run() || disabled}
          isActive={editor.isActive('bold')}
          label="B"
          title="Bold"
          className="font-bold"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run() || disabled}
          isActive={editor.isActive('italic')}
          label="I"
          title="Italic"
          className="italic"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run() || disabled}
          isActive={editor.isActive('underline')}
          label="U"
          title="Underline"
          className="underline"
        />
        <div className="w-px h-6 bg-[var(--border-primary)] mx-1" />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          disabled={disabled}
          label="• List"
          title="Bullet List"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          disabled={disabled}
          label="1. List"
          title="Ordered List"
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};
