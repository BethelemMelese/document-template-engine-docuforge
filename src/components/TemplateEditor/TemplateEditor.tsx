import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Code from '@tiptap/extension-code';
import { VariableMark } from './VariableHighlighter';
import { extractVariables } from '../../utils/templateParser';
import { Button } from '../common/Button';
import { Dialog } from '../common/Dialog';

export interface TemplateEditorHandle {
  insertVariable: (variableName: string) => void;
}

export interface TemplateEditorProps {
  content: string;
  /** Existing variable names (from template content / Variable Inspector) for "insert existing" in the modal */
  existingVariables?: string[];
  onContentChange: (content: string) => void;
  onVariablesDetected: (variables: string[]) => void;
  onSave?: () => void;
}

// Convert plain text to HTML if needed
function normalizeContent(content: string): string {
  if (!content) return '';
  // If content doesn't look like HTML (no tags), wrap it in paragraph tags
  if (!content.includes('<') && !content.includes('>')) {
    // Split by newlines and wrap each line in <p> tags
    return content.split('\n').map(line => `<p>${line || '<br>'}</p>`).join('');
  }
  return content;
}

const CREATE_NEW_VALUE = '__create_new__';

export const TemplateEditor = forwardRef<TemplateEditorHandle, TemplateEditorProps>(function TemplateEditor({
  content,
  existingVariables = [],
  onContentChange,
  onVariablesDetected,
}, ref) {
  const [insertVarOpen, setInsertVarOpen] = useState(false);
  const [insertVarName, setInsertVarName] = useState('');
  const [insertVarExisting, setInsertVarExisting] = useState<string>(CREATE_NEW_VALUE);
  const [insertLinkOpen, setInsertLinkOpen] = useState(false);
  const [insertLinkUrl, setInsertLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Code.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono text-sm',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your cover letter... Use {{company}}, {{position}}, {{date}} for variables.',
      }),
      VariableMark,
    ],
    content: normalizeContent(content),
    onUpdate: ({ editor }) => {
      // Save HTML content to preserve formatting
      const html = editor.getHTML();
      onContentChange(html);
      
      // Extract variables from text (strip HTML for variable detection)
      const text = editor.getText();
      const variables = extractVariables(text);
      onVariablesDetected(variables);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4 dark:prose-invert',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== undefined) {
      const currentHtml = editor.getHTML();
      const normalizedContent = normalizeContent(content);
      
      // Only update if content is different (avoid infinite loops)
      if (normalizedContent !== currentHtml) {
        try {
          // Use normalized content (converts plain text to HTML if needed)
          editor.commands.setContent(normalizedContent, false);
        } catch (error) {
          console.error('Error setting editor content:', error);
        }
      }
    }
  }, [content, editor]);

  const insertVariable = useCallback((variableName: string) => {
    if (editor) {
      editor.chain().focus().insertContent(`{{${variableName}}}`).run();
    }
  }, [editor]);

  useImperativeHandle(ref, () => ({ insertVariable }), [insertVariable]);

  const isInsertExisting = insertVarExisting !== CREATE_NEW_VALUE;
  const canInsertVar = useMemo(
    () => isInsertExisting || insertVarName.trim().length > 0,
    [isInsertExisting, insertVarName]
  );
  const canInsertLink = useMemo(() => insertLinkUrl.trim().length > 0, [insertLinkUrl]);

  const confirmInsertVariable = () => {
    const nameToInsert = isInsertExisting ? insertVarExisting : insertVarName.trim().replace(/\s+/g, '_');
    if (!nameToInsert) return;
    insertVariable(nameToInsert);
    setInsertVarName('');
    setInsertVarExisting(CREATE_NEW_VALUE);
    setInsertVarOpen(false);
  };

  const confirmInsertLink = () => {
    if (!editor || !canInsertLink) return;
    const url = insertLinkUrl.trim();
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setInsertLinkUrl('');
    setInsertLinkOpen(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-white rounded-t-lg">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-2 py-1 rounded text-xs font-medium hover:bg-gray-100 ${
            editor.isActive('paragraph') ? 'bg-primary-100 text-primary-700' : 'text-gray-700'
          }`}
          title="Paragraph"
          type="button"
        >
          P
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded text-xs font-medium hover:bg-gray-100 ${
            editor.isActive('heading', { level: 1 }) ? 'bg-primary-100 text-primary-700' : 'text-gray-700'
          }`}
          title="Heading 1"
          type="button"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-xs font-medium hover:bg-gray-100 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-primary-100 text-primary-700' : 'text-gray-700'
          }`}
          title="Heading 2"
          type="button"
        >
          H2
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('bold') ? 'bg-primary-100 text-primary-700' : 'text-gray-700'
          }`}
          title="Bold"
          type="button"
        >
          <strong className="text-sm">B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('italic') ? 'bg-primary-100 text-primary-700' : 'text-gray-700'
          }`}
          title="Italic"
          type="button"
        >
          <em className="text-sm">I</em>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('bulletList') ? 'bg-primary-100 text-primary-700' : 'text-gray-700'
          }`}
          title="Bullet List"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('orderedList') ? 'bg-primary-100 text-primary-700' : 'text-gray-700'
          }`}
          title="Numbered List"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          onClick={() => setInsertLinkOpen(true)}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('link') ? 'bg-primary-100 text-primary-700' : 'text-gray-700'
          }`}
          title="Link"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('code') ? 'bg-primary-100 text-primary-700' : 'text-gray-700'
          }`}
          title="Inline Code"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-100 text-gray-700"
          title="Undo"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-100 text-gray-700"
          title="Redo"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-8a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        </button>
        <div className="flex-1" />
        <Button
          variant="primary"
          size="sm"
          onClick={() => setInsertVarOpen(true)}
        >
          <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Insert Variable
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="p-6 min-h-full">
          <EditorContent editor={editor} />
        </div>
      </div>

      <style>{`
        .variable-mark {
          background-color: #dbeafe;
          color: #1e40af;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
          font-family: 'Courier New', monospace;
          display: inline-block;
        }
        .variable-mark.purple {
          background-color: #e9d5ff;
          color: #6b21a8;
        }
        .ProseMirror {
          outline: none;
          min-height: 500px;
        }
        .ProseMirror p {
          margin: 0.75em 0;
          line-height: 1.6;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror strong {
          font-weight: 600;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.75em 0;
        }
        .ProseMirror li {
          margin: 0.25em 0;
        }
        .ProseMirror a {
          color: #0284c7;
          text-decoration: underline;
        }
        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
      `}</style>

      <Dialog
        open={insertVarOpen}
        title="Insert variable"
        description="Select an existing variable or create a new one to insert at the cursor."
        confirmText="Insert"
        onConfirm={confirmInsertVariable}
        onClose={() => {
          setInsertVarOpen(false);
          setInsertVarName('');
          setInsertVarExisting(CREATE_NEW_VALUE);
        }}
        confirmDisabled={!canInsertVar}
        size="sm"
      >
        {existingVariables.length > 0 && (
          <>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Existing variables
            </label>
            <select
              value={insertVarExisting}
              onChange={(e) => setInsertVarExisting(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
            >
              <option value={CREATE_NEW_VALUE}>+ Create new variable...</option>
              {existingVariables.map((v) => (
                <option key={v} value={v}>{'{{' + v + '}}'}</option>
              ))}
            </select>
          </>
        )}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          {existingVariables.length > 0 ? 'New variable name (if creating new)' : 'Variable name'}
        </label>
        <input
          value={isInsertExisting ? '' : insertVarName}
          onChange={(e) => {
            setInsertVarName(e.target.value);
            if (insertVarExisting !== CREATE_NEW_VALUE) setInsertVarExisting(CREATE_NEW_VALUE);
          }}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="company_name"
          disabled={isInsertExisting}
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Will insert{' '}
          <span className="font-mono">
            {isInsertExisting ? `{{${insertVarExisting}}}` : '{' + '{' + (insertVarName.trim() || 'variable') + '}' + '}'}
          </span>
        </p>
      </Dialog>

      <Dialog
        open={insertLinkOpen}
        title="Insert link"
        description="Paste a URL. The selected text will become a link."
        confirmText="Insert"
        onConfirm={confirmInsertLink}
        onClose={() => {
          setInsertLinkOpen(false);
          setInsertLinkUrl('');
        }}
        confirmDisabled={!canInsertLink}
        size="sm"
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          URL
        </label>
        <input
          value={insertLinkUrl}
          onChange={(e) => setInsertLinkUrl(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="https://example.com"
          autoFocus
        />
      </Dialog>
    </div>
  );
});
