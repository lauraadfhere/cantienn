"use client";

import RichTextEditor from "../components/RichTextEditor";
import { useState } from "react";

export default function EditorPage() {
  const [editorContent, setEditorContent] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Rich Text Editor</h1>
          <p className="text-gray-600">
            A professional rich text editor with formatting toolbar and content management features.
          </p>
        </div>

        {/* Editor Component */}
        <RichTextEditor
          title="Comments for the Editor"
          placeholder="Enter your text here... You can use the toolbar to format your content."
          onContentChange={setEditorContent}
          initialContent="Start typing or paste your content here..."
        />

        {/* Content Preview */}
        {editorContent && (
          <div className="mt-8 bg-white p-6 rounded border border-gray-300">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Preview</h2>
            <div className="text-gray-700 whitespace-pre-wrap break-words text-sm">
              {editorContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
