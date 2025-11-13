import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function getAllCompanyCustomers(compID) {

    try {
        const response = await axiosInstanceRestaurantSystem.get(`/customer/get-all-customers/${compID}`, {},
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

export async function createCustomer(compID, customerName, phone, email, address, addressNumber, city, state, zipCode, lat, lng, complement) {
    const postData = {
        companyID: compID,
        customerName: customerName,
        phone: phone,
        email: email,
        address: address,
        addressNumber: addressNumber,
        city: city,
        state: state,
        zipCode: zipCode,
        lat: lat,
        lng: lng,
        complement: complement,
    };

    try {
        const response = await axiosInstanceRestaurantSystem.post(`/customer/create-customer`, postData,
            {
                headers: {

                }
            }
        );

        return response;
    } catch (error) {
        console.error(error);
        if (error?.response) return error.response;
    }
}

export async function updateCustomerService(compID, customerID, customerName, phone, email, address, addressNumber, city, state, zipCode, lat, lng, complement) {
    const postData = {
        companyID: compID,
        id: customerID,
        customerName: customerName,
        phone: phone,
        email: email,
        address: address,
        addressNumber: addressNumber,
        city: city,
        state: state,
        zipCode: zipCode,
        lat: lat,
        lng: lng,
        complement: complement,
    };

    try {
        const response = await axiosInstanceRestaurantSystem.put(`/customer/update-customer`, postData,
            {
                headers: {

                }
            }
        );

        return response;
    } catch (error) {
        console.error(error);
        if (error?.response) return error.response;
    }
}