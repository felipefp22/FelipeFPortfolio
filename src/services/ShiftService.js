import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function getShiftOperation() {

    // const postData = {
    //     name,
    //     email
    // };
    try {
        const response = await axiosInstanceRestaurantSystem.get(`/shifts/get-shift-operation/${localStorage.getItem('companyOperatingID')}`, {},
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


export async function openNewShift() {

    try {
        const response = await axiosInstanceRestaurantSystem.post(`/shifts/create-shift/${localStorage.getItem('companyOperatingID')}`, {},
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


