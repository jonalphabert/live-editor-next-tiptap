import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";

import { all, createLowlight } from "lowlight";

import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

const lowlight = createLowlight(all);

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

export const underlineConfiguration = Underline.configure({
    HTMLAttributes: {
        class: "underline",
    },
})

export const imageConfiguration = Image.configure({
    inline: true,
    allowBase64: false,
    HTMLAttributes: {
        class: "rounded-lg my-4",
    },
})

export const codeBlockConfiguration = CodeBlockLowlight.configure({
    lowlight,
    HTMLAttributes: {
        class: "bg-gray-800 text-gray-100 p-4 rounded-lg my-4",
    },
});

const levels = [1, 2, 3, 4, 5]; // Add more levels if needed

export const headingExtensions = levels.map(level => 
  Heading.extend({
    name: `heading-${level}`, // Unique name per level to avoid conflicts
    levels: [level],
    addAttributes() {
      return {
        level: {
          default: level,
        },
        class: {
          default: "heading-blog",
        },
      };
    },
  })
);