import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users`;

export const signUpUser = async ({username, email, password}) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/signup`,
            {username, email, password},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const user = res?.data?.user || null;
        const message = res?.data?.message || '';
        return {user, message};
    } catch (error) {
        const message = error.response?.data?.message || 'Signup failed';
        throw {message, status: error.response?.status || 500};
    }
}

export const signInUser = async ({email, password}) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/login`,
            {email, password},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        const user = res?.data?.user || null;
        const message = res?.data?.message || '';
        return {user, message};
    } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        throw {message, status: error.response?.status || 500};
    }
}

export const logoutUser = async () => {
    try {
        const res = await axios.post(`${API_BASE_URL}/logout`, {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return true;
    } catch (error) {
        const message = error.response?.data?.message || 'Logout failed';
        throw {message, status: error.response?.status || 500};
    }
}

export const getUserProfile = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/profile`,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        const user = res?.data?.user || null;
        const message = res?.data?.message || '';
        return {user, message};
    } catch (error) {
        const message = error.response?.data?.message || 'Fetching profile failed';
        throw {message, status: error.response?.status || 500};
    }
}
// TODO: implement updateAvatar function
export const updateAvatar = async (avatarFile) => {

}