import { Extension, type CommandProps } from '@tiptap/core';

interface GitHubStatsOptions {
  username: string;
  theme?: string;
  showIcons?: boolean;
  href?: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertGitHubStats: {
      /**
       * Insert GitHub stats card
       */
      insertGitHubStats: (options: GitHubStatsOptions) => ReturnType;
    };
  }
}

export const GitHubStatsExtension = Extension.create({
  name: 'githubStats',

  addCommands() {
    return {
      insertGitHubStats: (options: GitHubStatsOptions) => 
        ({ commands, chain }: CommandProps) => {
          const { username, theme = 'default', showIcons = true, href } = options;
          
          // Construct GitHub Stats URL
          const url = new URL(`https://github-readme-stats.vercel.app/api`);
          url.searchParams.set('username', username);
          url.searchParams.set('theme', theme);
          url.searchParams.set('show_icons', showIcons.toString());
          
          // Create image with optional link
          const img = `<img 
            src="${url.toString()}" 
            alt="GitHub stats for ${username}" 
            style="display: block; margin: 12px 0; border-radius: 4px;" 
          />`;
          
          const content = href 
            ? `<a href="${href}" target="_blank">${img}</a>` 
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