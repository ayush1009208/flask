const API_URL = 'http://127.0.0.1:5000';

export const authService = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    return response;
  },

  logout: async () => {
    return fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  },

  register: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response;
  },

  fetchNotes: async () => {
    return fetch(`${API_URL}/notes`, {
      credentials: 'include'
    });
  },

  addNote: async (content: string) => {
    return fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content })
    });
  },

  deleteNote: async (noteId: number) => {
    return fetch(`${API_URL}/notes/${noteId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
  }
};