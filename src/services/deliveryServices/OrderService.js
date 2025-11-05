import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function getOrderOperation(compID) {

    // const postData = {
    //     name,
    //     email
    // };
    try {
        const response = await axiosInstanceRestaurantSystem.get(`/order/get-company-operation/${compID}`, {},
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

export async function createOrder(compId, tableNumberOrDeliveryOrPickup, customerID, pickupName, orderItemsIDs, notes) {

    const postData = {
        companyID: compId,
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


export async function editOrderService(companyID, orderID, tableNumberOrDeliveryOrPickup, customerID, pickupName, notes) {

    const postData = {
        companyID: companyID,
        orderID: orderID,
        tableNumberOrDeliveryOrPickup: tableNumberOrDeliveryOrPickup,
        customerID: customerID,
        pickupName: pickupName,
        notes: notes,
    };
    try {
        const response = await axiosInstanceRestaurantSystem.put(`/order/update-order`, postData,
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


export async function closeOrder(compID, orderID, clientSaidNoTax, discountValue) {

    const postData = {
        companyID: compID,
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

export async function reopenOrder(compID, orderID) {

    const postData = {
        companyID: compID,
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


export async function cancelOrder(compID, orderID, managerID, adminPassword, cancellationReason) {

    const postData = {
        companyID: compID,
        orderID: orderID,
        managerID: managerID,
        adminPassword: adminPassword,
        cancellationReason: cancellationReason
    };
    try {
        const response = await axiosInstanceRestaurantSystem.put(`/order/cancel-order`, postData,
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

export async function completeOrders(compID, orderID) {

    const postData = {
        companyID: compID,
        orderID: orderID,
    };

    console.log("Completing orders:", postData);
    try {
        const response = await axiosInstanceRestaurantSystem.put(`/order/confirm-paid-order`, postData,
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

