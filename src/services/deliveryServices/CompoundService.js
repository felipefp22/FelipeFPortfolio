import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function createeCompoundService(compoundName, compoundDescription) {

    const postData = {
        compoundName: compoundName,
        compoundDescription: compoundDescription,
    };
    try {
        const response = await axiosInstanceRestaurantSystem.post(`/companies-compound/create-compound`, postData,
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

export async function updateCompoundService(compoundID, compoundName, compoundDescription) {

    const postData = {
        compoundID: compoundID,
        compoundName: compoundName,
        compoundDescription: compoundDescription,
    };
    try {
        const response = await axiosInstanceRestaurantSystem.put(`/companies-compound/update-compound`, postData,
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
