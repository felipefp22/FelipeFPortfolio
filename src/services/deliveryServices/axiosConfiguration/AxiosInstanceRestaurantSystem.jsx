import axios from 'axios';
import { logOutAction, updateLocalStorage } from './../AuthService';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstanceRestaurantSystem = axios.create({
    withCredentials: true,
});

axiosInstanceRestaurantSystem.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('access_token');
    // config.baseURL = await getServer();
    config.baseURL = API_URL;
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['userAgent'] = `${navigator.userAgent}`;

    return config;
});

let refreshTokenPromise = null;

axiosInstanceRestaurantSystem.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // if (error.response?.status == 409 || error.response?.status == 404) {
        //     async function getNewConfigsFromFireBase() {
        //         await fetchRemoteConfig();
        //         // originalRequest.baseURL =  await getServer();
        //         // originalRequest.headers['code'] = await getUUID();
        //     }
        //     await getNewConfigsFromFireBase();
        // }

        if (error.response && !originalRequest._retry && error.response.status !== 400 && error.response.status !== 500) {
            originalRequest._retry = true;
 
            if (!refreshTokenPromise) {

                refreshTokenPromise = refreshAccessToken();
            }

            try {

                await refreshTokenPromise;
                refreshTokenPromise = null; // Reset the promise after refresh completes

                await new Promise(resolve => setTimeout(resolve, 400)); // little delay to 

                originalRequest.headers['Authorization'] = `Bearer ${ localStorage.getItem('access_token')}`;
                return axiosInstanceRestaurantSystem(originalRequest);

            } catch (refreshError) {

                console.log("Not authenticated or expired token");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

async function refreshAccessToken() {
    // let API_URL = await getServer();
    
    try {
        const postData = {
            refreshToken: localStorage.getItem('refresh_token'),
            associatedToken: localStorage.getItem('access_token')
        };

        // console.log("Refreshing token...", postData);

        const response = await axios.post(`${API_URL}/auth/refresh-token`, postData,
            {
                headers: {
                //   'code': await getUUID()
                }
            }
        );

        if (response?.data) updateLocalStorage(response?.data);

        return response?.data.access_token;
    } catch (error) {
        if ( localStorage.getItem("access_token") || localStorage.getItem("refresh_token")) logOutAction();

        console.error("Refresh token failed", error);
        throw error;
    }
}

export default axiosInstanceRestaurantSystem;
