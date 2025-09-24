import axios from 'axios';
// import { fetchRemoteConfig, getUUID } from './../../ServicesFirebase/FireBaseRemoteConfig.jsx';
// import { getServer } from '../FirebaseServices/FireBaseRemoteConfig';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstanceHiringWithoutAuth = axios.create({
    withCredentials: true,
});

axiosInstanceHiringWithoutAuth.interceptors.request.use(async (config) => {
    config.baseURL = API_URL;
    config.headers = config.headers || {};
    // config.headers['code'] = `${await getUUID()}`;
    config.headers['userAgent'] = `${navigator.userAgent}`;

    return config;
});

axiosInstanceHiringWithoutAuth.interceptors.response.use(
 
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // if (error.response?.status == 409 || error.response?.status == 404) {
        //     async function getNewConfigsFromFireBase() {
        //         await fetchRemoteConfig();
        //         // originalRequest.baseURL =  await getServer();
        //         originalRequest.headers['code'] = await getUUID();
        //     }
        //     await getNewConfigsFromFireBase();
        // }

        if (error.response && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await new Promise(resolve => setTimeout(resolve, 400)); // little delay to 

                return axiosInstanceHiringWithoutAuth(originalRequest);

            } catch (refreshError) {

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstanceHiringWithoutAuth;