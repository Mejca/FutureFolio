const API_BASE_URL = 'http://localhost:3002/api';

const api = {
  getCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/courses`);
    return response.json();
  },
  getCourseDetails: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
    return response.json();
  },
  getModules: async () => {
    const response = await fetch(`${API_BASE_URL}/modules`);
    return response.json();
  },
  getModuleDetails: async (moduleId) => {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}`);
    return response.json();
  }
};

export default api;
