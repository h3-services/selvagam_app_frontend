import api from './api';

export const busService = {
    // Get all buses
    getAllBuses: async () => {
        try {
            const response = await api.get('/buses');
            return response.data;
        } catch (error) {
            console.error("Error fetching buses:", error);
            throw error;
        }
    },

    // Get bus by ID
    getBusById: async (busId) => {
        try {
            const response = await api.get(`/buses/${busId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching bus ${busId}:`, error);
            throw error;
        }
    },

    // Create a new bus
    createBus: async (busData) => {
        try {
            const response = await api.post('/buses', busData);
            return response.data;
        } catch (error) {
            console.error("Error creating bus:", error);
            throw error;
        }
    },

    // Update bus
    updateBus: async (busId, busData) => {
        try {
            const response = await api.put(`/buses/${busId}`, busData);
            return response.data;
        } catch (error) {
            console.error(`Error updating bus ${busId}:`, error);
            throw error;
        }
    },

    // Delete bus
    deleteBus: async (busId) => {
        try {
            const response = await api.delete(`/buses/${busId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting bus ${busId}:`, error);
            throw error;
        }
    },

    // Update bus status
    updateBusStatus: async (busId, status) => {
        try {
            const response = await api.patch(`/buses/${busId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error(`Error updating bus status ${busId}:`, error);
            throw error;
        }
    }
};
