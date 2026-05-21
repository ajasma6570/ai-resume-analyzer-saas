import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    withCredentials: true
})


let accessToken = ""

export const setAccessToken = (token: string) => {
    accessToken = token;
}

export const clearAccessToken = () => {
    accessToken = "";
}

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config;
})


api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 403 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const apiBaseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
                const response = await axios.get(
                    `${apiBaseURL}/auth/refresh-token`,
                    {
                        withCredentials: true,
                    }
                );

                accessToken =
                    response.data.accessToken;

                originalRequest.headers.Authorization =
                    `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (err) {
                console.error(err);
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);


export default api;