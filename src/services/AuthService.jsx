import axiosInstanceRestaurantSystem from './axiosConfiguration/AxiosInstanceRestaurantSystem';
import axiosInstanceRestaurantSystemWithoutAuth from './axiosConfiguration/AxiosInstanceRestaurantSystemWithoutAuth';

export async function signUp(name, email, password) {

    const postData = {
        name,
        email,
        password
    };
    try {
        const response = await axiosInstanceRestaurantSystemWithoutAuth.post(`/auth/register`, postData,
            {
                headers: {
                    'fcmToken': "a",
                }
            }
        );

        if (response?.data) updateLocalStorage(response?.data);

        return response;
    } catch (error) {
        console.log(error);
        if (error?.response) return error.response;
    }
}

export async function login(emailOrUsername, password) {

    const postData = {
        emailOrUsername,
        password,
    };

    try {
        const response = await axiosInstanceRestaurantSystemWithoutAuth.post(`/auth/login`, postData,
            {
                headers: {
                    'fcmToken': "a",
                }
            }
        );

        if (response?.data) updateLocalStorage(response?.data);

        return response;
    } catch (error) {
        console.log(error);
        if (error?.response) return error.response;
    }
}

export async function verifyIfIsAdmin() {

    try {
        const response = await axiosInstanceRestaurantSystem.get(`/user-actions/is-admin`, {},
            {

            }
        );

        if (response?.data) updateLocalStorage(response?.data);

        return response;
    } catch (error) {
        console.log(error);
        return error.response;
    }
}

export async function logoutOnBackEnd() {

    try {
        const response = await axiosInstanceRestaurantSystem.patch(`/auth/logout`, {},
            {
                headers: {
                    'refreshToken': localStorage.getItem('refresh_token'),
                    'fcmToken': "a"
                }
            }
        );

        return response;
    } catch (error) {
        console.log(error);
        if (error?.response) return error.response;
    }
}

// export async function verifyIfEmailConfirmed() {
//     try {
//         const response = await axiosInstanceHiring.get(`/auth/verify-if-email-confirmed`,
//             {

//             }
//         );

//         if (await response?.data.isEmailConfirmed == true && await SecureStore.getItemAsync('isEmailConfirmed') == null) await updateLocalStorage(response?.data);

//         return response;
//     } catch (error) {
//         console.log(error);
//         if (error?.response) return error.response;
//     }
// }

export async function requestPasswordReset(email) {
    try {
        const response = await axiosInstanceRestaurantSystemWithoutAuth.patch(`/auth/request-reset-password`, postData,
            {
                headers: {
                    'emailToResetPassword': email,
                }
            }
        );

        return response;
    } catch (error) {
        console.log(error);
        if (error?.response) return error.response;
    }
}

export async function getTokenToResetPassword(email, confirmationCode) {
    try {
        const response = await axiosInstanceRestaurantSystemWithoutAuth.patch(`/auth/get-token-reset-password/` + confirmationCode, {},
            {
                headers: {
                    'emailToResetPassword': email,
                }
            }
        );

        return response;
    } catch (error) {
        console.log(error);
        if (error?.response) return error.response;
    }
}

export async function resetPassword(newPassword, confirmPassword, tokenID) {

    const postData = {
        tokenID,
        newPassword,
        confirmPassword,
    };


    try {
        const response = await axiosInstanceRestaurantSystemWithoutAuth.put(`/auth/reset-password`, postData,
            {

            }
        );

        return response;
    } catch (error) {
        console.log(error);
        if (error?.response) return error.response;
    }
}


export async function requestConfirmationCode() {

    try {
        const response = await axiosInstanceRestaurantSystem.patch(`/auth/request-confirm-account`, {},
            {

            }
        );

        return response;
    } catch (error) {
        console.log(error);
        if (error?.response) return error.response;
    }
}

export async function confirmAccount(confirmationCode) {

    try {
        const response = await axiosInstanceRestaurantSystem.put(`/auth/confirm-account-via-code/` + confirmationCode,
            {

            }
        );

        return response;
    } catch (error) {
        console.log(error);
        if (error?.response) return error.response;
    }
}


export async function requestPhoneChangeCode(phone) {

    try {
        const response = await axiosInstanceRestaurantSystem.patch(`/auth/request-change-and-confirm-phone`, {},
            {
                headers: {
                    'phoneToConfirm': phone,
                }
            }
        );

        return response;
    } catch (error) {
        console.log(error);
        if (error?.response) return error.response;
    }
}

export async function confirmPhone(confirmationCode) {

    try {
        const response = await axiosInstanceRestaurantSystem.put(`/auth/confirm-phone-via-code/` + confirmationCode,
            {

            }
        );

        console.log("Confirm Phone Response: ", response.data);
        // if (response?.status === 200) await updateLocalStorage(response.data);
        return response;
    } catch (error) {
        console.log(error);
        if (error?.response) return error.response;
    }
}


export async function updateLocalStorage(data) {

    if (data.access_token) localStorage.setItem('access_token', data.access_token);
    if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
    if (data.userLoggedEmail) localStorage.setItem('userLoggedEmail', data.userLoggedEmail);
    if (data.isEmailConfirmed) localStorage.setItem('isEmailConfirmed', data.isEmailConfirmed);
    if (data.isPhoneConfirmed) localStorage.setItem('isPhoneConfirmed', data.isPhoneConfirmed);
    if (data.compoundsYouAreOwner) localStorage.setItem('compoundsYouAreOwner', JSON.stringify(data.compoundsYouAreOwner));
    if (data.companiesYouWorks) localStorage.setItem('companiesYouWorks', JSON.stringify(data.companiesYouWorks));


    window.dispatchEvent(new CustomEvent("profileUpdated"));
}

export async function logOutAction() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userLoggedEmail');
    localStorage.removeItem('isEmailConfirmed');
    localStorage.removeItem('isPhoneConfirmed');
    localStorage.removeItem('compoundsYouAreOwner');
    localStorage.removeItem('companiesYouWorks');

    localStorage.removeItem('companyOperatingID');

    window.dispatchEvent(new CustomEvent("profileUpdated"));

    logoutOnBackEnd();
}
