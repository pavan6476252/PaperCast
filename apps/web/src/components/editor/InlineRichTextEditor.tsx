import React, { useEffect, useRef, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { ContentLockExtension } from "./ContentLockExtension";
import { StarterKit } from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Underline } from "@tiptap/extension-underline";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Link } from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  Eraser,
  Underline as UnderlineIcon,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Palette,
} from "lucide-react";

export interface InlineRichTextEditorProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  lockContent?: boolean;
}

const defaultExtensions = [
  StarterKit.configure({
    heading: false,
    codeBlock: false,
    blockquote: false,
    bulletList: false,
    orderedList: false,
  }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  Underline,
  Subscript,
  Superscript,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
  }),
];

export const InlineRichTextEditor: React.FC<InlineRichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  lockContent,
}) => {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const activeExtensions = useMemo(() => {
    return lockContent
      ? [...defaultExtensions, ContentLockExtension]
      : defaultExtensions;
  }, [lockContent]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: activeExtensions,
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html === "<p></p>" || html === "") {
        onChangeRef.current(undefined);
      } else {
        onChangeRef.current(html);
      }
    },
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[100px] border border-border/80 rounded-b px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent bg-background text-foreground text-sm prose max-w-none prose-sm outline-none",
      },
    },
  });

  // Update editor content when value changes externally (and it's not the current content)
  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();
    if (value === currentHtml) return;

    // Normalize plain text to avoid resetting cursor on every keystroke
    if (
      value &&
      !value.trim().startsWith("<") &&
      `<p>${value}</p>` === currentHtml
    )
      return;
    if (!value && (currentHtml === "<p></p>" || currentHtml === "")) return;

    editor.commands.setContent(value || "", { emitUpdate: false });
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const toggleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().setColor(e.target.value).run();
  };

  const toggleHighlight = (e: React.ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().setHighlight({ color: e.target.value }).run();
  };

  return (
    <div className="flex flex-col w-full text-foreground">
      <div className="flex flex-wrap items-center gap-1 p-1 bg-surface border border-b-0 border-border/80 rounded-t">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={<Bold size={14} />}
          title="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={<Italic size={14} />}
          title="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          icon={<UnderlineIcon size={14} />}
          title="Underline"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          icon={<Strikethrough size={14} />}
          title="Strikethrough"
        />
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          isActive={false}
          icon={<Eraser size={14} />}
          title="Clear Formatting"
        />
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          icon={<LinkIcon size={14} />}
          title="Link"
        />
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive("subscript")}
          icon={<SubscriptIcon size={14} />}
          title="Subscript"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive("superscript")}
          icon={<SuperscriptIcon size={14} />}
          title="Superscript"
        />
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          icon={<AlignLeft size={14} />}
          title="Align Left"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          icon={<AlignCenter size={14} />}
          title="Align Center"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          icon={<AlignRight size={14} />}
          title="Align Right"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          icon={<AlignJustify size={14} />}
          title="Justify"
        />
        <div className="w-px h-4 bg-border mx-1" />
        <div
          className="relative flex items-center group cursor-pointer p-1.5 rounded hover:bg-background transition-all duration-200 ease-in-out"
          title="Text Color"
        >
          <Palette size={14} />
          <input
            type="color"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={toggleColor}
            value={editor.getAttributes("textStyle").color || "#000000"}
          />
        </div>
        <div
          className="relative flex items-center group cursor-pointer p-1.5 rounded hover:bg-background transition-all duration-200 ease-in-out"
          title="Highlight Color"
        >
          <Highlighter size={14} />
          <input
            type="color"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={toggleHighlight}
            value={editor.getAttributes("highlight").color || "#ffff00"}
          />
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

const ToolbarButton = ({
  onClick,
  isActive,
  icon,
  title,
}: {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
  title: string;
}) => {
  return (
    <button
      onClick={onClick}
      title={title}
      type="button"
      className={`p-1.5 rounded transition-all duration-200 ease-in-out ${
        isActive
          ? "bg-accent/20 text-accent font-semibold"
          : "text-foreground/70 hover:bg-background hover:text-foreground"
      }`}
    >
      {icon}
    </button>
  );
};
