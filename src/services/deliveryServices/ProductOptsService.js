import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function createProductOptService(companyID, name, price, description, imagePath, productCategoryID, ifoodCode) {

    const postData = {
        companyID: companyID,
        name: name,
        price: price,
        description: description,
        imagePath: imagePath,
        productCategoryID: productCategoryID,
        ifoodCode: ifoodCode
    };
    try {
        const response = await axiosInstanceRestaurantSystem.post(`/product-option/create-product-option`, postData,
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

export async function updateProductOptService(companyID, productOptID, name, price, description, imagePath, productCategoryID, ifoodCode) {

    const postData = {
        companyID: companyID,
        productOptID: productOptID,
        name: name,
        price: price,
        description: description,
        imagePath: imagePath,
        productCategoryID: productCategoryID,
        ifoodCode: ifoodCode
    };
    try {
        const response = await axiosInstanceRestaurantSystem.put(`/product-option/update-product-option`, postData,
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

