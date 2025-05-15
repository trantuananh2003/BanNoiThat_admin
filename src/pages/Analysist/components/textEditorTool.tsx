import React from "react";
import {
  EditorProvider,
  useCurrentEditor,
  FloatingMenu,
  BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";

// Extensions cấu hình
const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  TextStyle,
  Color,
  ListItem,
];

// Toolbar Component
const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const buttonStyle = (isActive: any) =>
    `flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150
    ${isActive ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}`;

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonStyle(editor.isActive("bold"))}
      >
        <span>🔠</span> <span>Bold</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonStyle(editor.isActive("italic"))}
      >
        <span>👁️‍🗨️</span> <span>Italic</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonStyle(editor.isActive("bulletList"))}
      >
        <span>•</span> <span>Bullet</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonStyle(editor.isActive("orderedList"))}
      >
        <span>1.</span> <span>Ordered</span>
      </button>
    </div>
  );
};

// Initial content
const content = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`;

// Main Editor Component
export default function Editor() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        📝 Simple TipTap Editor
      </h1>
      <EditorProvider extensions={extensions} content={content}>
        <MenuBar />
        <div className="border rounded-lg p-4 min-h-[150px] tiptap prose max-w-none focus:outline-none" />
      </EditorProvider>
    </div>
  );
}
