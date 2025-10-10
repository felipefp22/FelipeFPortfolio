import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function getUserInfos() {

    try {
        const response = await axiosInstanceRestaurantSystem.get(`/user-actions/me`, {},
            {
                headers: {

                }
            }
        );

        return response;
    } catch (error) {
        console.log(error);
        if (error?.response) return error.response;
    }
}

export async function createDefaultApiDemonstration() {

    try {
        const response = await axiosInstanceRestaurantSystem.put(`/user-actions/create-default-api-demonstration`, {},
            {
                headers: {

                }
            }
        );

        return response;
    } catch (error) {
        console.log(error);
        if (error?.response) return error.response;
    }
}

export async function setProfileTheme(theme) {

    try {
        const response = await axiosInstanceRestaurantSystem.put(`/user-actions/set-theme/${theme}`, {},
            {
                headers: {

                }
            }
        );

        
        return response;
    } catch (error) {
        console.log(error);
        if (error?.response) return error.response;
    }
}
