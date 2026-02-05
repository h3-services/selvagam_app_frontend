import api from './api';

export const routeService = {
    // Get all routes
    getAllRoutes: async () => {
        try {
            const response = await api.get('/routes');
            return response.data;
        } catch (error) {
            console.error("Error fetching routes:", error);
            throw error;
        }
    },

    // Get all route stops
    getAllRouteStops: async () => {
        try {
            const response = await api.get('/route-stops');
            return response.data;
        } catch (error) {
            console.error("Error fetching route stops:", error);
            throw error;
        }
    },

    // Get route by ID (if needed, or just filter from all)
    getRouteById: async (routeId) => {
        try {
            const response = await api.get(`/routes/${routeId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching route ${routeId}:`, error);
            throw error;
        }
    },

    // Create route
    createRoute: async (routeData) => {
        try {
            const response = await api.post('/routes', routeData);
            return response.data;
        } catch (error) {
            console.error("Error creating route:", error);
            throw error;
        }
    },

    // Create route stop
    createRouteStop: async (stopData) => {
        try {
            console.log("Creating route stop with payload:", JSON.stringify(stopData, null, 2));
            const response = await api.post('/route-stops', stopData);
            return response.data;
        } catch (error) {
            console.error("Error creating route stop:", error);
            // Log server response details if available
            if (error.response) {
                console.error("Server Response Data:", error.response.data);
            }
            throw error;
        }
    },

    // Delete route stop
    deleteRouteStop: async (stopId) => {
        try {
            const response = await api.delete(`/route-stops/${stopId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting route stop ${stopId}:`, error);
            throw error;
        }
    },

    // Update route
    updateRoute: async (routeId, routeData) => {
        try {
            const response = await api.put(`/routes/${routeId}`, routeData);
            return response.data;
        } catch (error) {
            console.error(`Error updating route ${routeId}:`, error);
            throw error;
        }
    },

    // Delete route
    deleteRoute: async (routeId) => {
        try {
            const response = await api.delete(`/routes/${routeId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting route ${routeId}:`, error);
            throw error;
        }
    }
};
