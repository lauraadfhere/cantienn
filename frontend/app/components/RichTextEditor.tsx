"use client";

import { useState, useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link,
  Strikethrough,
  Code,
  Eye,
  Maximize2,
  Copy,
  Download,
  Image,
  Upload,
} from "lucide-react";

interface RichTextEditorProps {
  title?: string;
  placeholder?: string;
  onContentChange?: (content: string) => void;
  initialContent?: string;
}

export default function RichTextEditor({
  title = "Comments for the Editor",
  placeholder = "Enter your text here...",
  onContentChange,
  initialContent = "",
}: RichTextEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange?.(newContent);
  }, [onContentChange]);

  const applyFormatting = useCallback((format: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (!selectedText) return;

    let formattedText = selectedText;
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "underline":
        formattedText = `<u>${selectedText}</u>`;
        break;
      case "strikethrough":
        formattedText = `~~${selectedText}~~`;
        break;
      case "code":
        formattedText = `\`${selectedText}\``;
        break;
      case "link":
        formattedText = `[${selectedText}](url)`;
        break;
    }

    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    onContentChange?.(newContent);

    // Restore focus and cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + 2, start + 2 + selectedText.length);
      }
    }, 0);
  }, [content, onContentChange]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      alert("Content copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy content");
    });
  }, [content]);

  const downloadContent = useCallback(() => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "editor-content.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  }, [content]);

  return (
    <div
      className={`flex flex-col bg-white border border-gray-300 rounded ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Title */}
      {title && (
        <div className="px-4 py-3 border-b border-gray-300 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-300 bg-gray-50 flex-wrap">
        {/* Text Formatting */}
        <button
          onClick={() => applyFormatting("bold")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4 text-gray-700" />
        </button>

        <button
          onClick={() => applyFormatting("italic")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4 text-gray-700" />
        </button>

        <button
          onClick={() => applyFormatting("underline")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4 text-gray-700" />
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Link & Code */}
        <button
          onClick={() => applyFormatting("link")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Link"
        >
          <Link className="w-4 h-4 text-gray-700" />
        </button>

        <button
          onClick={() => applyFormatting("strikethrough")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4 text-gray-700" />
        </button>

        <button
          onClick={() => applyFormatting("code")}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Code"
        >
          <Code className="w-4 h-4 text-gray-700" />
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Media & View */}
        <button
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Image"
        >
          <Image className="w-4 h-4 text-gray-700" />
        </button>

        <button
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Upload"
        >
          <Upload className="w-4 h-4 text-gray-700" />
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Utilities */}
        <button
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Preview"
        >
          <Eye className="w-4 h-4 text-gray-700" />
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4 text-gray-700" />
        </button>

        <button
          onClick={copyToClipboard}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Copy to Clipboard"
        >
          <Copy className="w-4 h-4 text-gray-700" />
        </button>

        <button
          onClick={downloadContent}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Download"
        >
          <Download className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          className="w-full h-full p-4 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none font-sans"
          style={{ minHeight: isFullscreen ? "calc(100vh - 120px)" : "300px" }}
        />
      </div>
    </div>
  );
}
