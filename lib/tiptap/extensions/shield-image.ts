import { Extension, type CommandProps } from '@tiptap/core';

// Define the options interface for the Shields image
interface ShieldsImageOptions {
  label: string;
  logo: string;
  logoColor: string;
  href?: string;  // Optional link URL
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
        ({ commands }: CommandProps) => {
        const { label, logo, logoColor, href } = options;
        console.log(label, logo, logoColor, href);
        
        // Construct Shields.io URL
        const url = new URL(`https://img.shields.io/badge/${encodeURIComponent(label)}-informational`);
        url.searchParams.set('logo', logo);
        url.searchParams.set('logoColor', logoColor);
        
        // Create image with optional link
        const img = `<img src="${url.toString()}" alt="${label}" />`;
        const content = href 
          ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${img}</a>` 
          : img;
        

        return commands.insertContent(content);
      }
    };
  }
});