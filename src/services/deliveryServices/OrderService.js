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

export async function createOrder(compId, tableNumberOrDeliveryOrPickup, customerID, pickupName, orderItemsIDs, notes, deliveryDistanceKM) {

    const postData = {
        companyID: compId,
        tableNumberOrDeliveryOrPickup: tableNumberOrDeliveryOrPickup,
        customerID: customerID,
        pickupName: pickupName,
        orderItemsIDs: orderItemsIDs,
        notes: notes,
        deliveryDistanceKM: deliveryDistanceKM,
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


export async function editOrderService(companyID, orderID, tableNumberOrDeliveryOrPickup, customerID, pickupName, notes, deliveryDistanceKM) {

    const postData = {
        companyID: companyID,
        orderID: orderID,
        tableNumberOrDeliveryOrPickup: tableNumberOrDeliveryOrPickup,
        customerID: customerID,
        pickupName: pickupName,
        notes: notes,
        deliveryDistanceKM: deliveryDistanceKM,
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

export async function addItemsToOrderService(companyID, orderID, orderItemsIDs) {

    const postData = {
        companyID: companyID,
        orderID: orderID,
        orderItemsIDs: orderItemsIDs
    };

    try {
        const response = await axiosInstanceRestaurantSystem.post(`/order/add-products-on-order`, postData,
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

export async function removeItemsFromOrderService(companyID, orderID, ordersItemsIDs) {

    const postData = {
        companyID: companyID,
        orderID: orderID,
        ordersItemsIDs: ordersItemsIDs,
    };

    try {
        const response = await axiosInstanceRestaurantSystem.put(`/order/remove-products-on-order`, postData,
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


export async function closeOrder(compID, ordersIDs, clientSaidNoTax, discountValue, deliverymanID, deliveryOrdersSequence) {

    const postData = {
        companyID: compID,
        ordersIDs: ordersIDs,
        clientSaidNoTax: clientSaidNoTax,
        discountValue: discountValue,
        deliverymanID: deliverymanID,
        deliveryOrdersSequence: deliveryOrdersSequence
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

export async function reopenOrder(compID, ordersIDs) {

    const postData = {
        companyID: compID,
        ordersIDs: ordersIDs
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
    console.log("Completing ");

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

//
export async function markOrderPrintSyncPrinted(compID, orderPrintSyncID) {

    const postData = {
        companyID: compID,
        orderPrintSyncID: orderPrintSyncID,
    };

    console.log("Completing orders:", postData);
    try {
        const response = await axiosInstanceRestaurantSystem.put(`/order/mark-orderPrintSync-printed`, postData,
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