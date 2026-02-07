import api from './api';

export const classService = {
    // Get all classes
    getAllClasses: async () => {
        try {
            const response = await api.get('/classes');
            return response.data;
        } catch (error) {
            console.error("Error fetching classes:", error);
            throw error;
        }
    },

    // Get class by ID
    getClassById: async (classId) => {
        try {
            const response = await api.get(`/classes/${classId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching class ${classId}:`, error);
            throw error;
        }
    },

    // Create a new class
    createClass: async (classData) => {
        try {
            const response = await api.post('/classes', classData);
            return response.data;
        } catch (error) {
            console.error("Error creating class:", error);
            throw error;
        }
    },

    // Update class
    updateClass: async (classId, classData) => {
        try {
            const response = await api.put(`/classes/${classId}`, classData);
            return response.data;
        } catch (error) {
            console.error(`Error updating class ${classId}:`, error);
            throw error;
        }
    },

    // Delete class
    deleteClass: async (classId) => {
        try {
            const response = await api.delete(`/classes/${classId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting class ${classId}:`, error);
            throw error;
        }
    }
};
