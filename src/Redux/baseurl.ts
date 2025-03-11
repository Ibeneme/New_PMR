import AsyncStorage from "@react-native-async-storage/async-storage";

export const BaseUrl = `http://localhost:3000`

//export const BaseUrl = `https://padiman-route-admin-q7tl.onrender.com`


//https://padiman-route-admin-q7tl.onrender.com/
export const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('accessToken'); // Get token from SecureStorage
    console.log(token, 'tokentoken')
    if (!token) {
        throw new Error('No access token found');
    }
    return {
        Authorization: `Bearer ${token}`, // Return the token as a header
    };
};
