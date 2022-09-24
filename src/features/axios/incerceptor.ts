import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://165.227.162.246:5001",
});

axios.interceptors.response.use(null!, (error) => {
  if (error && error.message === "Network Error") {
    throw new Error(
      `Potential network CORS preflight error at ${error.config.url}`
    );
  }
  throw error;
});

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user")!);
  config.headers!["Authorization"] = `${user.username} ${user.token}`;
  return config;
});

export default axiosInstance;