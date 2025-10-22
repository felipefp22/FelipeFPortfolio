import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function getShiftOperation(compID) {

    // const postData = {
    //     name,
    //     email
    // };
    try {
        const response = await axiosInstanceRestaurantSystem.get(`/shifts/get-shift-operation/${compID}`, {},
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


export async function openNewShift(companyID) {

    try {
        const response = await axiosInstanceRestaurantSystem.post(`/shifts/create-shift/${companyID}`, {},
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

export async function endShift(companyID, shiftID, adminPassword) {
    const postData = {
        companyID,
        shiftID,
        adminPassword
    };

    try {
        const response = await axiosInstanceRestaurantSystem.put(`/shifts/close-shift`, postData,
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