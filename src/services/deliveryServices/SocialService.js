import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function findPersonByEmailService(personEmail) {

    // const postData = {
    //     companyId,
    //     employeeEmail,
    //     position
    // };
    
    try {
        const response = await axiosInstanceRestaurantSystem.get(`/social/get-user-by-email/${personEmail}`, {},
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
