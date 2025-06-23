import { DraftStatus } from '@/models/DraftStatus';
import TurndownService from 'turndown';
import { create } from 'zustand';

type BlogCreateState = {
  blogPostId: string | null;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  description: string;
  setDescription: (desc: string) => void;
  selectedGroup: string | null;
  setSelectedGroup: (group: string) => void;
  selectedCategories: string[];
  isEdited: boolean;
  toggleCategory: (category: string) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  draftPost: () => Promise<DraftStatus>;
  saveAsMarkdown: () => void;
};

export const useModalStore = create<BlogCreateState>((set: Function, get: Function) => ({
  blogPostId: null,
  isOpen: false,
  description: '',
  title: '',
  content: 'Start typing here...',
  isEdited: false,
  selectedGroup: null,
  selectedCategories: [],
  
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),

  setTitle: (title: string) => {
    set({ title: title });

    if(get().isEdited) return;
    set({ isEdited: true });
  },

  setContent: (content: string) => {
    set({ content: content });

    if(get().isEdited) return;
    set({ isEdited: true });
  },
  
  setDescription: (desc: string) => set({ description: desc }),
  
  setSelectedGroup: (group: string) => set({ selectedGroup: group }),
  
  toggleCategory: (category : string) => set((state : BlogCreateState) => ({
    selectedCategories: state.selectedCategories.includes(category)
      ? state.selectedCategories.filter((c : string) => c !== category)
      : [...state.selectedCategories, category]
  })),
  
  resetForm: () => set({
    description: '',
    selectedGroup: null,
    selectedCategories: []
  }),
  
  submitForm: async () => {
    const { description, selectedGroup, selectedCategories, title, content } = get();
    // API call would go here
    console.log('Submitting:', { description, selectedGroup, selectedCategories, title, content });
    get().closeModal();
    get().resetForm();
  },

  draftPost: async() => {
    const { title, content, blogPostId } = get();
    if(title === '' && content === '') return {
      success: false,
      message: 'Please enter a title and content first'
    };

    if(blogPostId){
      // Hit update blog API
    } else {
      // Hit create blog API
    }

    console.log('Submitting:', { title, content });
    return {
      success: true,
      message: 'Success'
    }
  },
  saveAsMarkdown: () => {
    const { content } = get();
    const turndownService = new TurndownService();
    
    // Add custom rules for better formatting (optional)
    turndownService.addRule('preformatted', {
      filter: ['pre'],
      replacement: (content) => `\`\`\`\n${content}\n\`\`\``
    });
    
    try {
      const markdown = turndownService.turndown(content);
      
      // Create download
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Readme.md';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Error converting content to Markdown');
    }
  }
}));