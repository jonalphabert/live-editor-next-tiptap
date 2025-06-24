"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useCallback, useRef } from "react";
import { useModalStore } from "@/store/BlogCreate";
import { 
  Bold, CodeXml, Heading1, Heading2, Heading3, Heading4, Heading5, 
  ImageUp, Italic, LucideList, LucideListOrdered, LucideUnderline, 
  LucideLink
} from "lucide-react";
import {underlineConfiguration,
  imageConfiguration,
  codeBlockConfiguration,
  headingExtensions, 
  linkConfiguration} from "@/utils/editor-setup";
import Highlight from "@tiptap/extension-highlight";
import { ShieldsImageExtension } from "@/lib/tiptap/extensions/shield-image";

import { ShieldsModal } from '@/components/ShieldsModal';

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
      Placeholder.configure({
        placeholder,
      }),
      Highlight,
      underlineConfiguration,
      imageConfiguration,
      codeBlockConfiguration,
      ...headingExtensions,
      linkConfiguration,
      ShieldsImageExtension,
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

  const addImageByUrl = useCallback(() => {
    const url = window.prompt('Enter image URL');
    
    if (url && editor) {
      // // Basic URL validation
      // if (!url.match(/\.(jpeg|jpg|gif|png|webp)$/)) {
      //   alert('Please enter a valid image URL (jpg, png, gif, webp)');
      //   return;
      // }
      
      editor
        .chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: {
            src: url,
            alt: "Inserted image",
            title: "Inserted image",
          },
        })
        .run();
    }
  }, [editor]);

  const handleInsertShieldsImage = (data: {
    label: string;
    logo: string;
    logoColor: string;
    href: string;
    style: string;
    styleColor: string;
  }) => {
    if (editor) {
      editor.commands.insertShieldsImage(data);
    }
  };

  if (!editor) {
    return <div className="text-gray-500 p-4">Loading editor...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-700 w-full h-[80vh] overflow-y-auto rounded-xl shadow-lg relative">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
     
      
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Heading 1"
        >
          <Heading1 />
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
          <Heading2 />
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
          <Heading3 />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("heading", { level: 4 })
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Heading 4"
        >
          <Heading4 />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("heading", { level: 5 })
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Heading 5"
        >
          <Heading5 />
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
          <Bold />
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
          <Italic />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive("underline")
              ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
          title="Underline"
        >
          <LucideUnderline />
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
          <LucideList />
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
          <LucideListOrdered />
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
          <CodeXml />
        </button>

        <button
          onClick={addImageByUrl}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          title="Insert Image by URL"
        >
          <LucideLink /> {/* Use link icon for URL insertion */}
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
            <ImageUp />
          )}
        </button>

        <ShieldsModal onInsert={handleInsertShieldsImage } />
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
                    focus:outline-none"
        />
      </div>
    </div>
  );
};

function isImageFile(file: File) {
  return file.type.includes("image/");
}

export default TiptapEditor;