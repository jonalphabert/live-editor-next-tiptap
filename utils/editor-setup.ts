import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

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
        class: "mx-0.5 my-0.5 inline-block",
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

export const linkConfiguration = Link.configure({
  openOnClick: false,
  autolink: true,
  defaultProtocol: 'https',
  protocols: ['http', 'https'],
  isAllowedUri: (url, ctx) => {
    try {
      // construct URL
      const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

      // use default validation
      if (!ctx.defaultValidate(parsedUrl.href)) {
        return false
      }

      // disallowed protocols
      const disallowedProtocols = ['ftp', 'file', 'mailto']
      const protocol = parsedUrl.protocol.replace(':', '')

      if (disallowedProtocols.includes(protocol)) {
        return false
      }

      // only allow protocols specified in ctx.protocols
      const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

      if (!allowedProtocols.includes(protocol)) {
        return false
      }

      // disallowed domains
      const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
      const domain = parsedUrl.hostname

      if (disallowedDomains.includes(domain)) {
        return false
      }

      // all checks have passed
      return true
    } catch {
      return false
    }
  },
  shouldAutoLink: url => {
    try {
      // construct URL
      const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

      // only auto-link if the domain is not in the disallowed list
      const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
      const domain = parsedUrl.hostname

      return !disallowedDomains.includes(domain)
    } catch {
      return false
    }
  },
  HTMLAttributes:{
    class: 'inline-block'
  }
})