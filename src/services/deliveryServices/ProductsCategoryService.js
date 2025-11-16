import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function getAllProductsCategories(compID) {

    try {
        const response = await axiosInstanceRestaurantSystem.get(`/product-category/get-all-categories-of-company/${compID}`, {},
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

export async function createProductsCategoriesService(companyID, categoryName, description) {
    const postData = {
        companyID: companyID,
        categoryName: categoryName,
        description: description,
    };

    try {
        const response = await axiosInstanceRestaurantSystem.post(`/product-category/create-product-category`, postData,
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

export async function updateProductsCategoriesService(companyID, categoryID, categoryName, description, customOrderAllowedCandidate, customOrderPriceRuleCandidate) {
    const postData = {
        companyID: companyID,
        categoryID: categoryID,
        categoryName: categoryName,
        description: description,
        customOrderAllowed: customOrderAllowedCandidate,
        customOrderPriceRule: customOrderPriceRuleCandidate,
    };

    try {
        const response = await axiosInstanceRestaurantSystem.put(`/product-category/update-category`, postData,
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