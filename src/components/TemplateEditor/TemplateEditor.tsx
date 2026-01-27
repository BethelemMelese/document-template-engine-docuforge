import { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { VariableMark } from './VariableHighlighter';
import { extractVariables } from '../../utils/templateParser';
import { Button } from '../common/Button';

interface TemplateEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onVariablesDetected: (variables: string[]) => void;
  onSave?: () => void;
}

export function TemplateEditor({
  content,
  onContentChange,
  onVariablesDetected,
  onSave,
}: TemplateEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your cover letter... Use {{company}}, {{position}}, {{date}} for variables.',
      }),
      VariableMark,
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      onContentChange(text);
      
      // Detect variables and notify parent
      const variables = extractVariables(text);
      onVariablesDetected(variables);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getText()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const insertVariable = useCallback((variableName: string) => {
    if (editor) {
      editor.chain().focus().insertContent(`{{${variableName}}}`).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium ${
            editor.isActive('bold') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium ${
            editor.isActive('italic') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded text-sm font-medium ${
            editor.isActive('bulletList') ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          •
        </button>
        <div className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertVariable('company')}
        >
          Insert {'{{company}}'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertVariable('position')}
        >
          Insert {'{{position}}'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertVariable('date')}
        >
          Insert {'{{date}}'}
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 border border-gray-200 rounded-b-lg overflow-auto">
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .variable-mark {
          background-color: #dbeafe;
          color: #1e40af;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
          font-family: 'Courier New', monospace;
        }
        .ProseMirror {
          outline: none;
        }
        .ProseMirror p {
          margin: 0.75em 0;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
