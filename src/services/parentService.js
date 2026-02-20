import api from './api';
import { securityUtils } from '../utils/security';

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
            // Encrypt password if provided
            const payload = { ...parentData };
            if (payload.password) {
                payload.password = securityUtils.encrypt(payload.password);
            }
            const response = await api.post('/parents', payload);
            return response.data;
        } catch (error) {
            console.error("Error creating parent:", error);
            throw error;
        }
    },

    // Update parent
    updateParent: async (parentId, parentData) => {
        try {
            // Encrypt password if provided
            const payload = { ...parentData };
            if (payload.password) {
                payload.password = securityUtils.encrypt(payload.password);
            }
            const response = await api.put(`/parents/${parentId}`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error updating parent ${parentId}:`, error);
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
