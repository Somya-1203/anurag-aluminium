// Add these API methods to api.ts

// Field Experts API
fieldExperts: {
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/field-experts`);
    return response.json();
  },

  getActive: async () => {
    const response = await fetch(`${API_URL}/api/field-experts/active`);
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/api/field-experts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create field expert');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/api/field-experts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update field expert');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/api/field-experts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete field expert');
    return response.json();
  },

  get: async (id: string) => {
    const response = await fetch(`${API_URL}/api/field-experts/${id}`);
    if (!response.ok) throw new Error('Field expert not found');
    return response.json();
  },

  search: async (query: string) => {
    const response = await fetch(`${API_URL}/api/field-experts/search?query=${query}`);
    return response.json();
  },
},

// Notifications API
notifications: {
  getAll: async (adminId: string) => {
    const response = await fetch(`${API_URL}/api/notifications/admin/${adminId}`);
    return response.json();
  },

  getUnreadCount: async (adminId: string) => {
    const response = await fetch(`${API_URL}/api/notifications/admin/${adminId}/unread-count`);
    return response.json();
  },

  markAsRead: async (id: string) => {
    const response = await fetch(`${API_URL}/api/notifications/${id}/mark-read`, {
      method: 'PUT',
    });
    return response.json();
  },
},

// Sorting/Filtering for Estimates
getEstimatesByDate: async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const response = await fetch(`${API_URL}/api/estimates?${params}`);
  return response.json();
},

getEstimatesByFieldExpert: async (fieldExpertName: string) => {
  const response = await fetch(`${API_URL}/api/estimates/field-expert/${fieldExpertName}`);
  return response.json();
},

searchEstimates: async (query: string) => {
  const response = await fetch(`${API_URL}/api/estimates/search?query=${query}`);
  return response.json();
},
