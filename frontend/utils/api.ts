const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const api = {
  // Auth
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Invalid credentials');
    return response.json();
  },

  initUsers: async () => {
    const response = await fetch(`${API_URL}/api/auth/init`, {
      method: 'POST',
    });
    return response.json();
  },

  // Window Types
  getWindowTypes: async () => {
    const response = await fetch(`${API_URL}/api/window-types`);
    return response.json();
  },

  createWindowType: async (name: string) => {
    const response = await fetch(`${API_URL}/api/window-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to create window type');
    return response.json();
  },

  deleteWindowType: async (id: string) => {
    const response = await fetch(`${API_URL}/api/window-types/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete window type');
    return response.json();
  },

  // Estimates
  getEstimates: async () => {
    const response = await fetch(`${API_URL}/api/estimates`);
    return response.json();
  },

  getEstimate: async (id: string) => {
    const response = await fetch(`${API_URL}/api/estimates/${id}`);
    return response.json();
  },

  createEstimate: async (data: any) => {
    const response = await fetch(`${API_URL}/api/estimates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create estimate');
    return response.json();
  },

  updateEstimate: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/api/estimates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update estimate');
    return response.json();
  },

  deleteEstimate: async (id: string) => {
    const response = await fetch(`${API_URL}/api/estimates/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete estimate');
    return response.json();
  },

  // Settings
  getSettings: async () => {
    const response = await fetch(`${API_URL}/api/settings`);
    return response.json();
  },

  updateSettings: async (data: any) => {
    const response = await fetch(`${API_URL}/api/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};