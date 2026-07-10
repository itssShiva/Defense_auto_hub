import axios from "axios";

const leadApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1/lead`,
    withCredentials: true
});

export const createLead = async (formData) => {
    try {
        const response = await leadApi.post("/create", formData);
        return response.data;
    } catch (error) {
        console.error(error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const getDealerLeads = async () => {
    try {
        const response = await leadApi.get("/dealer");
        return response.data;
    } catch (error) {
        console.error(error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const deleteLead = async (id) => {
    try {
        const response = await leadApi.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return { success: false, message: error.response?.data?.message || error.message };
    }
};
