import api from './api';
import { securityUtils } from '../utils/security';

export const driverService = {
    // Get all drivers
    getAllDrivers: async () => {
        try {
            const response = await api.get('/drivers');
            return response.data;
        } catch (error) {
            console.error("Error fetching drivers:", error);
            throw error;
        }
    },

    // Get driver by ID (if needed for detail view, though we might pass data)
    getDriverById: async (driverId) => {
        try {
            const response = await api.get(`/drivers/${driverId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching driver ${driverId}:`, error);
            throw error;
        }
    },

    // Create a new driver (placeholder for future implementation)
    createDriver: async (driverData) => {
        try {
            const payload = { ...driverData };
            if (payload.password) {
                payload.password = securityUtils.encrypt(payload.password);
            }
            const response = await api.post('/drivers', payload);
            return response.data;
        } catch (error) {
            console.error("Error creating driver:", error);
            throw error;
        }
    },

    // Update driver
    updateDriver: async (driverId, driverData) => {
        try {
            const payload = { ...driverData };
            if (payload.password) {
                payload.password = securityUtils.encrypt(payload.password);
            }
            const response = await api.put(`/drivers/${driverId}`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error updating driver ${driverId}:`, error);
            throw error;
        }
    },

    // Delete driver
    deleteDriver: async (driverId) => {
        try {
            const response = await api.delete(`/drivers/${driverId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting driver ${driverId}:`, error);
            throw error;
        }
    },
    // Update driver status
    updateDriverStatus: async (driverId, status) => {
        try {
            const response = await api.put(`/drivers/${driverId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error(`Error updating driver status ${driverId}:`, error);
            throw error;
        }
    }
};
