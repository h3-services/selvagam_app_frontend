import api from './api';

export const studentService = {
    // Get all students
    getAllStudents: async () => {
        try {
            const response = await api.get('/students');
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

    // Update student secondary parent
    updateSecondaryParent: async (studentId, sParentId) => {
        try {
            const response = await api.patch(`/students/${studentId}/secondary-parent`, { s_parent_id: sParentId });
            return response.data;
        } catch (error) {
            console.error(`Error updating secondary parent for ${studentId}:`, error);
            throw error;
        }
    }
};
