import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function createCompanyService(companiesCompoundID,companyName, companyEmail, companyPhone, companyAddress, lat, lng, numberOfTables) {

    const postData = {
        companiesCompoundID,
        companyName,
        companyEmail,
        companyPhone,
        companyAddress,
        lat,
        lng,
        numberOfTables
    };
    try {
        const response = await axiosInstanceRestaurantSystem.post(`/company/create-company`, postData,
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

export async function getCompanyOperation(compID) {

    // const postData = {
    //     name,
    //     email
    // };
    try {
        const response = await axiosInstanceRestaurantSystem.get(`/company/get-company-operation/${compID}`, {},
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

export async function updateCompanyService(companyID, companyName, companyEmail, companyPhone, companyAddress, companyLat, companyLng, numberOfTables, taxServicePercentage) {

    const postData = {
        companyID: companyID,
        companyName: companyName,
        companyEmail: companyEmail,
        companyPhone: companyPhone,
        companyAddress: companyAddress,
        companyLat: companyLat,
        companyLng: companyLng,
        numberOfTables: numberOfTables,
        taxServicePercentage: taxServicePercentage,
    };
    try {
        const response = await axiosInstanceRestaurantSystem.put(`/company/update-company`, postData,
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
