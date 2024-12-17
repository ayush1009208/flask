export interface Note {
    id: number;
    title: string; 
    content: string;
    created_at: string;
    isPinned?: boolean;
  }
  
  
  export interface AuthContextType {
    user: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    register: (username: string, password: string) => Promise<boolean>;
  }