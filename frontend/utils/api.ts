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

  searchEstimates: async (query: string) => {
    const response = await fetch(`${API_URL}/api/estimates/search?query=${encodeURIComponent(query)}`);
    return response.json();
  },

  getEstimatesByDate: async (startDate: string, endDate: string) => {
    const response = await fetch(`${API_URL}/api/estimates/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.json();
  },

  getEstimatesByFieldExpert: async (fieldExpertName: string) => {
    const response = await fetch(`${API_URL}/api/estimates/field-expert/${encodeURIComponent(fieldExpertName)}`);
    return response.json();
  },

  getEstimatesByPaymentStatus: async (status: string) => {
    const response = await fetch(`${API_URL}/api/estimates/payment-status/${status}`);
    return response.json();
  },

  // Field Experts
  getFieldExperts: async () => {
    const response = await fetch(`${API_URL}/api/field-experts`);
    return response.json();
  },

  getActiveFieldExperts: async () => {
    const response = await fetch(`${API_URL}/api/field-experts/active`);
    return response.json();
  },

  createFieldExpert: async (data: any) => {
    const response = await fetch(`${API_URL}/api/field-experts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create field expert');
    return response.json();
  },

  updateFieldExpert: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/api/field-experts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update field expert');
    return response.json();
  },

  activateFieldExpert: async (id: string) => {
    const response = await fetch(`${API_URL}/api/field-experts/${id}/activate`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to activate field expert');
    return response.json();
  },

  deactivateFieldExpert: async (id: string) => {
    const response = await fetch(`${API_URL}/api/field-experts/${id}/deactivate`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to deactivate field expert');
    return response.json();
  },

  deleteFieldExpert: async (id: string) => {
    const response = await fetch(`${API_URL}/api/field-experts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete field expert');
    return response.json();
  },

  getFieldExpert: async (id: string) => {
    const response = await fetch(`${API_URL}/api/field-experts/${id}`);
    return response.json();
  },

  searchFieldExperts: async (query: string) => {
    const response = await fetch(`${API_URL}/api/field-experts/search?query=${encodeURIComponent(query)}`);
    return response.json();
  },

  // Notifications
  getNotifications: async (adminId: string) => {
    const response = await fetch(`${API_URL}/api/notifications/admin/${adminId}`);
    return response.json();
  },

  getUnreadNotificationCount: async (adminId: string) => {
    const response = await fetch(`${API_URL}/api/notifications/admin/${adminId}/unread-count`);
    return response.json();
  },

  markNotificationAsRead: async (id: string) => {
    const response = await fetch(`${API_URL}/api/notifications/${id}/mark-read`, {
      method: 'PUT',
    });
    return response.json();
  },
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