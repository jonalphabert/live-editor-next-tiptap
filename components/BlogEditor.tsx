"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { all, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { useState, useCallback, useRef } from "react";
import { useModalStore } from "@/store/BlogCreate";

const lowlight = createLowlight(all);

// Register languages for syntax highlighting
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

type TiptapProps = {
  className?: string;
  placeholder?: string;
};

const TiptapEditor = ({ 
  className, 
  placeholder = "Tell your story..." 
}: TiptapProps) => {

  const content = useModalStore(state => state.content);
  const setContent = useModalStore(state => state.setContent);
  
  const [isImageUploading, setIsImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    if (isImageUploading) return;
    setIsImageUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would upload the file to your server or cloud storage
      // For demo purposes, we'll use a blob URL
      const url = URL.createObjectURL(file);
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    } finally {
      setIsImageUploading(false);
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
            levels: [1, 2, 3],
            HTMLAttributes: { class: "heading-blog" },
        },
        paragraph: {
            HTMLAttributes: { class: "mb-2 font-lato text-lg" },
        },
        bulletList: {
            HTMLAttributes: { class: "list-disc font-lato ms-6" },
        },
        orderedList: {
            HTMLAttributes: { class: "list-decimal font-lato ms-6" },
        },
        codeBlock: {
            HTMLAttributes: { class: "bg-gray-800 text-white p-4 rounded" },
        },
        blockquote: {
            HTMLAttributes: {
                class:
                "border-l-4 border-teal-500 bg-gray-100 p-4 italic text-gray-700 mb-3",
            },
        },
        code: {
        HTMLAttributes: { class: "bg-gray-800 text-white px-1 rounded" },
        },
      }),
      Heading.extend({
        name: "heading",
        levels: [1],
        addAttributes() {
          return {
            level: {
              default: 1,
            },
            class: {
              default: "heading-blog",
            },
          };
        },
      }),
      Heading.extend({
        name: "heading",
        levels: [2],
        addAttributes() {
          return {
            level: {
              default: 2,
            },
            class: {
              default: "heading-blog",
            },
          };
        },
      }),
      Heading.extend({
        name: "heading",
        levels: [3],
        addAttributes() {
          return {
            level: {
              default: 3,
            },
            class: {
              default: "heading-blog",
            },
          };
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-lg my-4",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-gray-800 text-gray-100 p-4 rounded-lg my-4",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `focus:outline-none min-h-screen ${className || ""}`,
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (isImageFile(file)) {
            event.preventDefault();
            
            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
    
            handleImageUpload(file).then((url) => {
              if (url && editor) {
                editor
                  .chain()
                  .focus()
                  .insertContentAt(coordinates?.pos || editor.state.selection.anchor, {
                    type: "image",
                    attrs: {
                      src: url,
                      alt: file.name,
                      title: file.name,
                    },
                  })
                  .run();
              }
            });
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        if (event.clipboardData?.files?.length) {
          const file = event.clipboardData.files[0];
          if (isImageFile(file)) {
            event.preventDefault();
            
            handleImageUpload(file).then((url) => {
              if (url && editor) {
                editor
                  .chain()
                  .focus()
                  .insertContentAt(editor.state.selection.anchor, {
                    type: "image",
                    attrs: {
                      src: url,
                      alt: file.name,
                      title: file.name,
                    },
                  })
                  .run();
              }
            });
            return true;
          }
        }
        return false;
      },
    },
  });

  const addImage = useCallback(() => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        const file = e.target.files[0];
        const url = await handleImageUpload(file);
        if (url && editor) {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "image",
              attrs: {
                src: url,
                alt: file.name,
                title: file.name,
              },
            })
            .run();
        }
      }
    },
    [editor, handleImageUpload]
  );

  if (!editor) {
    return <div className="text-gray-500 p-4">Loading editor...</div>;
  }

  return (
    <div className="w-full mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
     
      
      {/* Editor toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Heading 1"
        >
          <span className="font-bold text-xl">H1</span>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Heading 2"
        >
          <span className="font-bold text-lg">H2</span>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("heading", { level: 3 })
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Heading 3"
        >
          <span className="font-bold">H3</span>
        </button>
        
        <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("bold")
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("italic")
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("paragraph")
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Paragraph"
        >
          <span className="text-sm">P</span>
        </button>
        
        <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("bulletList")
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1H5zm0 5a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H5zm0 5a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H5zm10-8a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm0 5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm0 5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("orderedList")
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Ordered List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1H5zm0 5a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H5zm0 5a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H5zm10-8a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm0 5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm0 5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M9 5h6v2H9V5zm0 5h6v2H9v-2zm0 5h6v2H9v-2z" />
          </svg>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("codeBlock")
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Code Block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          onClick={addImage}
          disabled={isImageUploading}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            isImageUploading
              ? "opacity-50 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Insert Image"
        >
          {isImageUploading ? (
            <span className="animate-pulse">Uploading...</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex space-x-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                editor.isActive("bold") ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              <span className="font-bold">B</span>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                editor.isActive("italic") ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              <span className="italic">I</span>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                editor.isActive("strike") ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              <span className="line-through">S</span>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                editor.isActive("code") ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              <span className="font-mono">{`</>`}</span>
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* Editor content with Medium-like styling */}
      <div className="p-6">
        <EditorContent 
          editor={editor} 
          className="prose prose-lg max-w-none dark:prose-invert
                    prose-headings:font-serif prose-headings:font-bold
                    prose-p:my-4 prose-p:leading-relaxed
                    prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:pl-4 prose-blockquote:italic
                    prose-ul:list-disc prose-ul:pl-6
                    prose-ol:list-decimal prose-ol:pl-6
                    prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-img:rounded-lg prose-img:shadow-md
                    focus:outline-none min-h-[300px]"
        />
      </div>
    </div>
  );
};

function isImageFile(file: File) {
  return file.type.includes("image/");
}

export default TiptapEditor;