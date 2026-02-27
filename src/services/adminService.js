import api from './api';

export const adminService = {
    // Get all admins
    getAllAdmins: async () => {
        try {
            const response = await api.get('/admins');
            return response.data;
        } catch (error) {
            console.error("Error fetching admins:", error);
            throw error;
        }
    },

    // Create a new admin
    createAdmin: async (adminData) => {
        try {
            const response = await api.post('/admins', adminData);
            return response.data;
        } catch (error) {
            console.error("Error creating admin:", error);
            throw error;
        }
    },

    // Update admin
    updateAdmin: async (adminId, adminData) => {
        try {
            const response = await api.put(`/admins/${adminId}`, adminData);
            return response.data;
        } catch (error) {
            console.error(`Error updating admin ${adminId}:`, error);
            throw error;
        }
    },

    // Delete admin
    deleteAdmin: async (adminId) => {
        try {
            const response = await api.delete(`/admins/${adminId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting admin ${adminId}:`, error);
            throw error;
        }
    },

    // Update admin status
    updateAdminStatus: async (adminId, status) => {
        try {
            const response = await api.put(`/admins/${adminId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error(`Error updating admin status ${adminId}:`, error);
            throw error;
        }
    }
};
