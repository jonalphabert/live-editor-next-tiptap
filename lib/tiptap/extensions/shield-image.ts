import { Extension, type CommandProps } from '@tiptap/core';

// Define the options interface for the Shields image
interface ShieldsImageOptions {
  label: string;
  logo: string;
  logoColor: string;
  href?: string; 
  style: string;
  styleColor: string; // Optional link URL
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertShieldsImage: {
      /**
       * Insert a Shields.io badge image
       */
      insertShieldsImage: (options: ShieldsImageOptions) => ReturnType;
    };
  }
}

export const ShieldsImageExtension = Extension.create({
  name: 'shieldsImage',

  addCommands() {
    return {
      insertShieldsImage: (options: ShieldsImageOptions) => 
        ({ commands, chain }: CommandProps) => {
          const { label, logo, logoColor, href, style, styleColor } = options;
        
        // Construct Shields.io URL with all options
        const url = new URL(`https://img.shields.io/badge/${encodeURIComponent(label)}-${styleColor.replace('#', '')}`);
        url.searchParams.set('style', style);
        url.searchParams.set('logo', logo);
        url.searchParams.set('logoColor', logoColor.replace('#', ''));

        console.log(url.toString());
        
        // Create image with optional link
        const img = `<img src="${url.toString()}" alt="${label}" style="display: inline-block; margin: 0 2px;" />`;
        const content = href 
          ? `<a href="${href}" target="_blank" style="display: inline-block;">${img}</a>` 
          : img;

          return chain()
          .insertContent(content, {
            parseOptions: {
              preserveWhitespace: 'full',
            }
          })
          .createParagraphNear()
          .run();
      }
    };
  }
});