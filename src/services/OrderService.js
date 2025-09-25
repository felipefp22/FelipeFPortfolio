import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function getOrderOperation() {

    // const postData = {
    //     name,
    //     email
    // };
    try {
        const response = await axiosInstanceRestaurantSystem.get(`/company/get-company-operation/${localStorage.getItem('companyOperatingID')}`, {},
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
