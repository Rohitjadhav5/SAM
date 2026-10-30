import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getProfile = () => api.get("/faculty/myprofile");

export const getStudents = (filters = {}) =>
  api.get("/faculty/student", { params: filters });

export const markAttendance = (data) =>
  api.post("/faculty/manualattendance", data);

export default api;
