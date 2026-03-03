import { useMemo } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

 const usePrivateAxios = () => {
  const { getToken } = useAuth();

  const instance = useMemo(() => {
    const axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    axiosInstance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return axiosInstance;
  }, [getToken]);

  return instance;
};

export default usePrivateAxios

// privateAxios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default privateAxios;