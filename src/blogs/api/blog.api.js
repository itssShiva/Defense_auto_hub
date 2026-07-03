import axios from "axios";

const blogApi = axios.create({
    baseURL: "http://localhost:3000/api/v1/blog",
    withCredentials: true  // needed for auth cookie to be sent
});

/* ================= CREATE BLOG ================= */
export const createBlog = async (formData) => {
    try {
        const res = await blogApi.post("/create", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/* ================= UPDATE BLOG ================= */
export const updateBlog = async (id, formData) => {
    try {
        const res = await blogApi.put(`/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/* ================= DELETE BLOG ================= */
export const deleteBlog = async (id) => {
    try {
        const res = await blogApi.delete(`/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/* ================= GET ALL BLOGS ================= */
export const getAllBlogs = async (params = {}) => {
    try {
        const res = await blogApi.get("/all", { params });
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/* ================= GET ONE BLOG BY ID ================= */
export const getOneBlog = async (id) => {
    try {
        const res = await blogApi.get(`/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/* ================= GET BLOGS BY CATEGORY ================= */
export const getBlogsByCategory = async (category) => {
    try {
        const res = await blogApi.get(`/category/${encodeURIComponent(category)}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};
