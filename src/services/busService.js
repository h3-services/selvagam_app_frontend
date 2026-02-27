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
    },

    // Assign driver to bus
    assignDriver: async (busId, driverId) => {
        try {
            const response = await api.patch(`/buses/${busId}/driver`, { driver_id: driverId });
            return response.data;
        } catch (error) {
            console.error(`Error assigning driver to bus ${busId}:`, error);
            throw error;
        }
    },

    // Assign route to bus
    assignRoute: async (busId, routeId) => {
        try {
            const response = await api.patch(`/buses/${busId}/route`, { route_id: routeId });
            return response.data;
        } catch (error) {
            console.error(`Error assigning route to bus ${busId}:`, error);
            throw error;
        }
    },

    // Upload Bus RC Book
    uploadRCBook: async (busId, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post(`/uploads/bus/${busId}/rc-book`, formData);
            return response.data;
        } catch (error) {
            console.error(`Error uploading RC Book for bus ${busId}:`, error);
            throw error;
        }
    },

    // Upload Bus FC Certificate
    uploadFCCertificate: async (busId, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post(`/uploads/bus/${busId}/fc-certificate`, formData);
            return response.data;
        } catch (error) {
            console.error(`Error uploading FC Certificate for bus ${busId}:`, error);
            throw error;
        }
    }
};
