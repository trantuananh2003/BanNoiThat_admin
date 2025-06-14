import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { Tooltip } from "@mui/material";

const extensions = [
  StarterKit.configure({
    bulletList: { keepMarks: true },
    orderedList: { keepMarks: true },
    heading: false,
  }),
  Underline,
  TextStyle,
  Color,
  ListItem,
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Heading.configure({
    levels: [1, 2, 3],
  }),
  HorizontalRule,
];

interface EditorDescriptionProps {
  description: string;
  onChange: (value: string) => void;
}

export default function EditorDescription({
  description,
  onChange,
}: EditorDescriptionProps) {
  const [htmlOutput, setHtmlOutput] = useState("");
  const prevDescriptionRef = useRef<string>(description);
  const editorRef = useRef<any>(null);

  const editor = useEditor({
    extensions,
    content: description,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (let item of items) {
          if (item.type.indexOf("image") === 0) {
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                editor
                  ?.chain()
                  .focus()
                  .setImage({ src: reader.result as string })
                  .run();
              };
              reader.readAsDataURL(file);
              return true;
            }
          }
        }
        return false;
      },
      // Add handleKeyDown to prevent cursor jumping on spacebar
      handleKeyDown(view, event) {
        if (event.key === " ") {
          // Let Tiptap handle the spacebar naturally
          return false;
        }
        return false;
      },
    },
    // Ensure editor maintains focus
    autofocus: true,
  });

  // Store editor instance in ref for manual focus control
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Update editor content only when description prop changes
  useEffect(() => {
    if (!editor || description === prevDescriptionRef.current) return;

    const currentHtml = editor.getHTML();
    if (description !== currentHtml) {
      // Store current cursor position
      const { from, to } = editor.state.selection;

      // Update content without losing focus
      editor.commands.setContent(description, false, {
        preserveWhitespace: true,
      });

      // Restore cursor position
      try {
        editor.commands.setTextSelection({ from, to });
      } catch (e) {
        console.warn("Failed to restore cursor position:", e);
      }

      prevDescriptionRef.current = description;
    }
  }, [editor, description]);

  const buttonStyle = (isActive: boolean) =>
    `flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
      isActive
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
    }`;

  const handlePreview = () => {
    const html = editor?.getHTML();
    setHtmlOutput(html || "");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        ✍️ Product Description Editor
      </h1>

      <div className="flex flex-wrap gap-3 mb-4">
        <Tooltip title="Bold">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={buttonStyle(editor?.isActive("bold") || false)}
          >
            <FormatBoldIcon />
          </button>
        </Tooltip>

        <Tooltip title="Italic">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={buttonStyle(editor?.isActive("italic") || false)}
          >
            <FormatItalicIcon />
          </button>
        </Tooltip>

        <Tooltip title="Underline">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={buttonStyle(editor?.isActive("underline") || false)}
          >
            <FormatUnderlinedIcon />
          </button>
        </Tooltip>

        <Tooltip title="Align Left">
          <button
            type="button"
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            className={buttonStyle(editor?.isActive({ textAlign: "left" }) || false)}
          >
            <FormatAlignLeftIcon />
          </button>
        </Tooltip>

        <Tooltip title="Align Center">
          <button
            type="button"
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
            className={buttonStyle(editor?.isActive({ textAlign: "center" }) || false)}
          >
            <FormatAlignCenterIcon />
          </button>
        </Tooltip>

        <Tooltip title="Align Right">
          <button
            type="button"
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
            className={buttonStyle(editor?.isActive({ textAlign: "right" }) || false)}
          >
            <FormatAlignRightIcon />
          </button>
        </Tooltip>
      </div>

      <div className="border rounded-lg p-4 min-h-[150px] prose max-w-none focus:outline-none">
        <EditorContent editor={editor} />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={handlePreview}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Xem trước
        </button>
      </div>

      {htmlOutput && (
        <div className="mt-6 border p-4 rounded-lg bg-gray-50">
          <h2 className="font-bold mb-2">Preview</h2>
          <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />
        </div>
      )}
    </div>
  );
}