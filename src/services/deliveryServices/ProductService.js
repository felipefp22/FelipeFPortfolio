import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function createProductService(companyID, name, price, description, imagePath, productCategoryID) {

    const postData = {
        companyID: companyID,
        name: name,
        price: price,
        description: description,
        imagePath: imagePath,
        productCategoryID: productCategoryID
    };
    try {
        const response = await axiosInstanceRestaurantSystem.post(`/product/create-product`, postData,
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

export async function updateProductService(companyID, productID, name, price, description, imagePath, productCategoryID) {

    const postData = {
        companyID: companyID,
        productID: productID,
        name: name,
        price: price,
        description: description,
        imagePath: imagePath,
        productCategoryID: productCategoryID
    };
    try {
        const response = await axiosInstanceRestaurantSystem.put(`/product/update-product`, postData,
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

