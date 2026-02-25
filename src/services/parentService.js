import api from './api';

export const parentService = {
    // Get all parents with optional filters
    // filters: { active_filter: 'ALL' | 'ACTIVE_ONLY' }
    getAllParents: async (filters = {}) => {
        try {
            const params = {};
            if (filters.active_filter) params.active_filter = filters.active_filter;
            const response = await api.get('/parents', { params });
            return response.data;
        } catch (error) {
            console.error("Error fetching parents:", error);
            throw error;
        }
    },

    // Get parent by ID
    getParentById: async (parentId) => {
        try {
            const response = await api.get(`/parents/${parentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching parent ${parentId}:`, error);
            throw error;
        }
    },

    // Create a new parent
    createParent: async (parentData) => {
        try {
            const response = await api.post('/parents', parentData);
            return response.data;
        } catch (error) {
            console.error("Error creating parent:", error);
            if (error.response?.data) {
                console.error("API Validation Details:", JSON.stringify(error.response.data, null, 2));
            }
            throw error;
        }
    },

    // Update parent
    updateParent: async (parentId, parentData) => {
        try {
            const response = await api.put(`/parents/${parentId}`, parentData);
            return response.data;
        } catch (error) {
            console.error(`Error updating parent ${parentId}:`, error);
            if (error.response?.data) {
                console.error("API Validation Details:", JSON.stringify(error.response.data, null, 2));
            }
            throw error;
        }
    },

    // Update parent status
    updateParentStatus: async (parentId, status) => {
        try {
            const response = await api.put(`/parents/${parentId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error(`Error updating parent status for ${parentId}:`, error);
            throw error;
        }
    },

    // Delete parent
    deleteParent: async (parentId) => {
        try {
            const response = await api.delete(`/parents/${parentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting parent ${parentId}:`, error);
            throw error;
        }
    },

    // Get all parent FCM tokens
    getAllParentFcmTokens: async () => {
        try {
            const response = await api.get('/parents/fcm-tokens/all');
            return response.data;
        } catch (error) {
            console.error("Error fetching parent FCM tokens:", error);
            throw error;
        }
    }
};
