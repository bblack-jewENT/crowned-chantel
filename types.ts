
export interface ModelImage {
  url: string;
  category: 'Pageant' | 'Casual' | 'High Fashion' | 'Studio';
  title?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export enum Section {
  HERO = 'hero',
  GALLERY = 'gallery',
  ABOUT = 'about',
  STATS = 'stats',
  ASSISTANT = 'assistant',
  CHARITY = 'charity',
  CONTACT = 'contact'
}
