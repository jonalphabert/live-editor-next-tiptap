import React from 'react';
import { render } from '@testing-library/react';
import GithubStatsComponent from '@/components/github-stats';
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { GitHubStatsExtension } from '@/lib/tiptap/extensions/github-stat';

// Test for component
test('renders github stats correctly', () => {
  const mockNode = {
    attrs: {
      username: 'testuser',
      theme: 'dark'
    }
  };
  
  const { getByAltText } = render(
    <GithubStatsComponent node={mockNode} />
  );
  
  const img = getByAltText('GitHub stats for testuser');
  expect(img).toHaveAttribute(
    'src',
    'https://github-readme-stats.vercel.app/api?username=testuser&theme=dark&show_icons=true'
  );
});

// Test for extension
describe('GitHubStatsExtension', () => {
    let editor: Editor;
    
    beforeEach(() => {
      editor = new Editor({
        extensions: [StarterKit, Image, GitHubStatsExtension],
      });
    });
  
    afterEach(() => {
      editor.destroy();
    });
  
    it('should insert GitHub stats image with default options', () => {
      editor.commands.insertGitHubStats({
        username: 'testuser'
      });
  
      const html = editor.getHTML();
      const expectedSrc = 'https://github-readme-stats.vercel.app/api?username=testuser';
      const expectedAlt = 'GitHub stats for testuser';
      const expectedTheme = 'default';
      
      expect(html).toContain(`<img`);
      expect(html).toContain(expectedSrc);
      expect(html).toContain(`alt="${expectedAlt}"`);
      expect(html).toContain(`theme=${expectedTheme}`);
      expect(html).not.toContain('<a href');
    });
  
    it('should insert GitHub stats image with custom options', () => {
      editor.commands.insertGitHubStats({
        username: 'anotheruser',
        theme: 'dark',
        showIcons: false,
        href: 'https://github.com/anotheruser'
      });
  
      const html = editor.getHTML();
      const expectedSrc = 'https://github-readme-stats.vercel.app/api?username=anotheruser';
      
      expect(html).toContain(`<img`);
      expect(html).toContain(expectedSrc);
      expect(html).toContain(`theme=dark`);
      expect(html).toContain('show_icons=false');
      expect(html).toContain('alt="GitHub stats for anotheruser"');
    });
  
    it('should handle special characters in username', () => {
      editor.commands.insertGitHubStats({
        username: 'user-with-dash',
        theme: 'radical'
      });
  
      const html = editor.getHTML();
      const expectedSrc = 'https://github-readme-stats.vercel.app/api?username=user-with-dash';
      
      expect(html).toContain(`<img`);
      expect(html).toContain(expectedSrc);
      expect(html).toContain(`theme=radical`);
      expect(html).toContain('show_icons=true');
    });
  
    it('should handle showIcons as false', () => {
      editor.commands.insertGitHubStats({
        username: 'testuser',
        showIcons: false
      });
  
      const html = editor.getHTML();
      expect(html).toContain('show_icons=false');
    });
  
    it('should handle empty href', () => {
      editor.commands.insertGitHubStats({
        username: 'testuser',
        href: ''
      });
  
      const html = editor.getHTML();
      expect(html).not.toContain('<a href');
    });
  
    it('should create proper URL with all parameters', () => {
      editor.commands.insertGitHubStats({
        username: 'testuser',
        theme: 'merko',
        showIcons: true
      });
  
      const html = editor.getHTML();

      const expectedSrc = 'https://github-readme-stats.vercel.app/api?username=testuser';

      expect(html).toContain(`<img`);
      expect(html).toContain(expectedSrc);
      expect(html).toContain(`theme=merko`);
      expect(html).toContain('show_icons=true');
    });
  
    it('should insert content with proper formatting', () => {
      editor.commands.insertGitHubStats({
        username: 'testuser'
      });
  
      const node = editor.state.doc.content.firstChild;
      expect(node?.type.name).toBe('image');
    });
  
    it('should handle theme with spaces', () => {
      editor.commands.insertGitHubStats({
        username: 'testuser',
        theme: 'high contrast'
      });
  
      const html = editor.getHTML();
      expect(html).toContain('theme=high+contrast');
    });
  });