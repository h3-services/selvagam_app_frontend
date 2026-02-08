import api from './api';

export const tripService = {
    // Get all trips
    getAllTrips: async () => {
        try {
            const response = await api.get('/trips');
            return response.data;
        } catch (error) {
            console.error("Error fetching trips:", error);
            throw error;
        }
    },

    // Get trip by ID
    getTripById: async (tripId) => {
        try {
            const response = await api.get(`/trips/${tripId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching trip ${tripId}:`, error);
            throw error;
        }
    },

    // Create a new trip
    createTrip: async (tripData) => {
        try {
            const response = await api.post('/trips', tripData);
            return response.data;
        } catch (error) {
            console.error("Error creating trip:", error);
            throw error;
        }
    },

    // Update trip status
    updateTripStatus: async (tripId, status) => {
        try {
            const response = await api.patch(`/trips/${tripId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error(`Error updating trip status ${tripId}:`, error);
            throw error;
        }
    },
    
    // Update trip details
    updateTrip: async (tripId, tripData) => {
        try {
            const response = await api.put(`/trips/${tripId}`, tripData);
            return response.data;
        } catch (error) {
             console.error(`Error updating trip ${tripId}:`, error);
             throw error;
        }
    }
};
