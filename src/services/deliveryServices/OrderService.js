import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function getOrderOperation() {

    // const postData = {
    //     name,
    //     email
    // };
    try {
        const response = await axiosInstanceRestaurantSystem.get(`/order/get-company-operation/${localStorage.getItem('companyOperatingID')}`, {},
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

export async function createOrder( tableNumberOrDeliveryOrPickup, customerID, pickupName, orderItemsIDs, notes ) {

    const postData = {
        companyID: localStorage.getItem('companyOperatingID'),
        tableNumberOrDeliveryOrPickup: tableNumberOrDeliveryOrPickup,
        customerID: customerID,
        pickupName: pickupName,
        orderItemsIDs: orderItemsIDs,
        notes: notes,
    };
    try {
        const response = await axiosInstanceRestaurantSystem.post(`/order/create-order`, postData,
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

export async function closeOrder( orderID, clientSaidNoTax, discountValue ) {

    const postData = {
        companyID: localStorage.getItem('companyOperatingID'),
        orderID: orderID,
        clientSaidNoTax: clientSaidNoTax,
        discountValue: discountValue,
    };
    try {
        const response = await axiosInstanceRestaurantSystem.put(`/order/close-order`, postData,
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

export async function reopenOrder( orderID ) {

    const postData = {
        companyID: localStorage.getItem('companyOperatingID'),
        orderID: orderID
    };
    try {
        const response = await axiosInstanceRestaurantSystem.put(`/order/reopen-order`, postData,
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


export async function cancelOrder( orderID, managerID, adminPassword, cancellationReason ) {

    const postData = {
        companyID: localStorage.getItem('companyOperatingID'),
        orderID: orderID,
        managerID: managerID,
        adminPassword: adminPassword,
        cancellationReason: cancellationReason
    };
    try {
        const response = await axiosInstanceRestaurantSystem.delete(`/order/cancel-order`, postData,
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
