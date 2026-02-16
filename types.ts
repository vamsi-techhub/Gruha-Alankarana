export enum AppTab {
  HOME = 'HOME',
  ANALYZE = 'ANALYZE',
  GENERATE = 'GENERATE',
  EDIT = 'EDIT',
  AGENT = 'AGENT',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isAudio?: boolean;
  audioData?: string; // base64
}

export interface DesignGenerationConfig {
  prompt: string;
  size: '1K' | '2K' | '4K';
}

export interface AnalysisResult {
  text: string;
  items?: string[];
}
