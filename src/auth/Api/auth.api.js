import axios from "axios";

const authApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
    withCredentials: true
})

export const registerUser = async (formData) => {
    try {
        const response = await authApi.post("/register/user", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
}


export const registerDealer = async (formData) => {
    try {
        const response = await authApi.post("/register/dealer", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const loginUser = async ({ email, password }) => {
    try {
        const response = await authApi.post("/login/user", { email, password })
        return response.data
    } catch (error) {
        console.log(error.message)
        return { success: false, message: error.response?.data?.message || error.message }
    }
}

export const loginDealer = async ({ email, password }) => {
    try {
        const response = await authApi.post("/login/dealer", { email, password })
        return response.data
    } catch (error) {
        console.log(error.message)
        return { success: false, message: error.response?.data?.message || error.message }
    }
}


export const getUserDetails = async () => {
    try {
        const response = await authApi.get("/get-me")
        return response.data
    } catch (error) {
        console.log(error.message)
        return { success: false, message: error.response?.data?.message || error.message }
    }
}

export const logoutUser = async () => {
    try {
        const response = await authApi.get("/logout")
        return response.data
    } catch (error) {
        console.log(error.message)
        return { success: false, message: error.response?.data?.message || error.message }
    }
}

export const getAllUsers = async () => {
    try {
        const response = await authApi.get("/user/all");
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const getAllDealers = async () => {
    try {
        const response = await authApi.get("/dealer/all");
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const getUserById = async (id) => {
    try {
        const response = await authApi.get(`/user/${id}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const getDealerById = async (id) => {
    try {
        const response = await authApi.get(`/dealer/${id}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const updateUser = async (id, formData) => {
    try {
        const response = await authApi.put(`/update/user/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const updateDealer = async (id, formData) => {
    try {
        const response = await authApi.put(`/update/dealer/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await authApi.delete(`/user/${id}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const deleteDealer = async (id) => {
    try {
        const response = await authApi.delete(`/dealer/${id}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const updateDealerPassword = async (id, data) => {
    try {
        const response = await authApi.put(`/update-password/dealer/${id}`, data);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}
