import api from './api';

export const parentService = {
    // Get all parents
    getAllParents: async () => {
        try {
            const response = await api.get('/parents');
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
