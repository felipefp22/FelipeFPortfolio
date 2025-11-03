import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function hireEmployeeService(companyId, employeeEmail, position) {

    const postData = {
        companyId,
        employeeEmail,
        position
    };

    try {
        const response = await axiosInstanceRestaurantSystem.put(`/company/add-employees`, postData,
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


export async function updateEmployeePositionService(companyId, employeeEmail, position) {

    const postData = {
        companyId,
        employeeEmail,
        position
    };
    
    try {
        const response = await axiosInstanceRestaurantSystem.put(`/company/update-employee-position`, postData,
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
