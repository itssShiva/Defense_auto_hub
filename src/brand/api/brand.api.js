import axios from 'axios';

const brandApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1/brand`,
    withCredentials: true
});

/* ================= CREATE BRAND ================= */
export const createBrand = async (formData) => {
    try {
        const res = await brandApi.post("/create", formData);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/* ================= GET ALL BRANDS ================= */
export const getAllBrands = async () => {
    try {
        const res = await brandApi.get("/all");
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/* ================= GET BRAND BY ID ================= */
export const getBrandById = async (id) => {
    try {
        const res = await brandApi.get(`/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/* ================= UPDATE BRAND ================= */
export const updateBrand = async (id, formData) => {
    try {
        const res = await brandApi.put(`/${id}`, formData);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/* ================= DELETE BRAND ================= */
export const deleteBrand = async (id) => {
    try {
        const res = await brandApi.delete(`/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export default brandApi;
