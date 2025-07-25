'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { useCallback } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Start typing...', 
  className = '' 
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && editor) {
        // Show loading state
        editor.chain().focus().setImage({ src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjY2NjIi8+Cjwvc3ZnPgo=' }).run();
        
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('/api/admin/media/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (response.ok) {
            const result = await response.json();
            // Replace loading image with actual uploaded image
            editor.chain().focus().setImage({ src: result.url, alt: result.originalName }).run();
          } else {
            // Remove loading image on error
            editor.chain().focus().deleteSelection().run();
            alert('Failed to upload image');
          }
        } catch (error) {
          console.error('Image upload error:', error);
          // Remove loading image on error
          editor.chain().focus().deleteSelection().run();
          alert('Failed to upload image');
        }
      }
    };
    input.click();
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive('bold') 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Bold"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 4a1 1 0 011-1h3a3 3 0 013 3 3 3 0 01-1.5 2.598A3 3 0 0112 12a3 3 0 01-3 3H6a1 1 0 01-1-1V4zm2 1v2h2a1 1 0 100-2H7zm0 4v3h3a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive('italic') 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Italic"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 1a1 1 0 011 1v1h2a1 1 0 110 2h-.5l-1 8H11a1 1 0 110 2H8a1 1 0 01-1-1v-1H5a1 1 0 110-2h.5l1-8H5a1 1 0 110-2h2V2a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive('underline') 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Underline"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12v1H4v-1z"/>
            <path d="M10 2C7.79 2 6 3.79 6 6v5c0 2.21 1.79 4 4 4s4-1.79 4-4V6c0-2.21-1.79-4-4-4zm2 9c0 1.1-.9 2-2 2s-2-.9-2-2V6c0-1.1.9-2 2-2s2 .9 2 2v5z"/>
          </svg>
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive('heading', { level: 1 }) 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Heading 1"
        >
          H1
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive('heading', { level: 2 }) 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Heading 2"
        >
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive('heading', { level: 3 }) 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Heading 3"
        >
          H3
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive('bulletList') 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive('orderedList') 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4h14v2H3V4zm0 5h14v2H3V9zm0 5h14v2H3v-2z"/>
            <circle cx="1.5" cy="5" r="0.5"/>
            <circle cx="1.5" cy="10" r="0.5"/>
            <circle cx="1.5" cy="15" r="0.5"/>
          </svg>
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        {/* Text Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive({ textAlign: 'left' }) 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Align Left"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive({ textAlign: 'center' }) 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Align Center"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-2 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive({ textAlign: 'right' }) 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Align Right"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm-4 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        {/* Media & Links */}
        <button
          onClick={addImage}
          className="p-2 rounded text-sm font-medium hover:bg-gray-100"
          title="Add Image"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={setLink}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive('link') 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Add Link"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="border-l border-gray-300 mx-1"></div>

        {/* Highlight */}
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive('highlight') 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Highlight"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.707 9.293l-5-5a.999.999 0 00-1.414 0l-5 5a.999.999 0 000 1.414l5 5a.999.999 0 001.414 0l5-5a.999.999 0 000-1.414zM12 8a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Quote */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded text-sm font-medium ${
            editor.isActive('blockquote') 
              ? 'bg-orange-100 text-orange-800' 
              : 'hover:bg-gray-100'
          }`}
          title="Quote"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="min-h-[200px]"
        placeholder={placeholder}
      />
    </div>
  );
}
