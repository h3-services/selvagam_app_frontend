import api from './api';

export const studentService = {
    // Get all students with optional filters
    // filters: { student_status, transport_status, active_filter }
    getAllStudents: async (filters = {}) => {
        try {
            const params = {};
            if (filters.student_status) params.student_status = filters.student_status;
            if (filters.transport_status) params.transport_status = filters.transport_status;
            if (filters.active_filter) params.active_filter = filters.active_filter;
            const response = await api.get('/students', { params });
            return response.data;
        } catch (error) {
            console.error("Error fetching students:", error);
            throw error;
        }
    },

    // Get student by ID
    getStudentById: async (studentId) => {
        try {
            const response = await api.get(`/students/${studentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching student ${studentId}:`, error);
            throw error;
        }
    },

    // Create a new student
    createStudent: async (studentData) => {
        try {
            const response = await api.post('/students', studentData);
            return response.data;
        } catch (error) {
            console.error("Error creating student:", error);
            throw error;
        }
    },

    // Update student
    updateStudent: async (studentId, studentData) => {
        try {
            const response = await api.put(`/students/${studentId}`, studentData);
            return response.data;
        } catch (error) {
            console.error(`Error updating student ${studentId}:`, error);
            throw error;
        }
    },

    // Update student status
    updateStudentStatus: async (studentId, status) => {
        try {
            const response = await api.put(`/students/${studentId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error(`Error updating student status for ${studentId}:`, error);
            throw error;
        }
    },

    // Update student transport status
    updateTransportStatus: async (studentId, status) => {
        try {
            const response = await api.put(`/students/${studentId}/transport-status`, { status });
            return response.data;
        } catch (error) {
            console.error(`Error updating transport status for ${studentId}:`, error);
            throw error;
        }
    },

    // Delete student
    deleteStudent: async (studentId) => {
        try {
            const response = await api.delete(`/students/${studentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting student ${studentId}:`, error);
            throw error;
        }
    },

    // Update student primary parent
    updatePrimaryParent: async (studentId, parentId) => {
        try {
            const response = await api.patch(`/students/${studentId}/primary-parent`, { parent_id: parentId });
            return response.data;
        } catch (error) {
            console.error(`Error updating primary parent for ${studentId}:`, error);
            throw error;
        }
    },

    // Update student secondary parent
    updateSecondaryParent: async (studentId, sParentId) => {
        try {
            const response = await api.patch(`/students/${studentId}/secondary-parent`, { s_parent_id: sParentId });
            return response.data;
        } catch (error) {
            console.error(`Error updating secondary parent for ${studentId}:`, error);
            throw error;
        }
    },

    // Switch student parents (Swap Primary and Secondary)
    switchParents: async (studentId) => {
        try {
            const response = await api.post(`/students/${studentId}/switch-parents`);
            return response.data;
        } catch (error) {
            console.error(`Error switching parents for ${studentId}:`, error);
            throw error;
        }
    },

    // Get student count by route
    getStudentCountByRoute: async (routeId) => {
        try {
            const response = await api.get(`/students/count/route/${routeId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching student count for route ${routeId}:`, error);
            throw error;
        }
    },

    // Get students by route
    getStudentsByRoute: async (routeId, activeFilter = 'ACTIVE_ONLY') => {
        try {
            const response = await api.get(`/students/by-route/${routeId}`, {
                params: { active_filter: activeFilter }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching students for route ${routeId}:`, error);
            throw error;
        }
    }
};
