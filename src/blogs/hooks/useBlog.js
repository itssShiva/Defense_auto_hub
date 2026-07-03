import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
    createBlog as apiCreateBlog,
    updateBlog as apiUpdateBlog,
    deleteBlog as apiDeleteBlog,
    getAllBlogs as apiGetAllBlogs,
    getOneBlog as apiGetOneBlog,
    getBlogsByCategory as apiGetBlogsByCategory
} from "../api/blog.api";

export const useBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

    // CREATE BLOG
    const createBlog = async (formData) => {
        setLoading(true);
        try {
            const res = await apiCreateBlog(formData);
            if (res.success) {
                toast.success(res.message || "Blog created successfully");
                setBlogs(prev => [res.blog, ...prev]);
                return { success: true, data: res.blog };
            } else {
                toast.error(res.message || "Failed to create blog");
                return { success: false, message: res.message };
            }
        } catch (error) {
            toast.error("An unexpected error occurred while creating the blog");
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    // UPDATE BLOG
    const updateBlog = async (id, formData) => {
        setLoading(true);
        try {
            const res = await apiUpdateBlog(id, formData);
            if (res.success) {
                toast.success(res.message || "Blog updated successfully");
                setBlogs(prev => prev.map(blog => blog._id === id ? res.blog : blog));
                if (currentBlog?._id === id) {
                    setCurrentBlog(res.blog);
                }
                return { success: true, data: res.blog };
            } else {
                toast.error(res.message || "Failed to update blog");
                return { success: false, message: res.message };
            }
        } catch (error) {
            toast.error("An unexpected error occurred while updating the blog");
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    // DELETE BLOG
    const deleteBlog = async (id) => {
        setLoading(true);
        try {
            const res = await apiDeleteBlog(id);
            if (res.success) {
                toast.success(res.message || "Blog deleted successfully");
                setBlogs(prev => prev.filter(blog => blog._id !== id));
                if (currentBlog?._id === id) {
                    setCurrentBlog(null);
                }
                return { success: true };
            } else {
                toast.error(res.message || "Failed to delete blog");
                return { success: false, message: res.message };
            }
        } catch (error) {
            toast.error("An unexpected error occurred while deleting the blog");
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    // GET ALL BLOGS (with optional params for pagination, filtering, searching)
    const fetchAllBlogs = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await apiGetAllBlogs(params);
            if (res.success) {
                setBlogs(res.blogs || []);
                setPagination({
                    total: res.total,
                    page: res.page,
                    totalPages: res.totalPages
                });
                return { success: true, data: res.blogs };
            } else {
                toast.error(res.message || "Failed to fetch blogs");
                return { success: false, message: res.message };
            }
        } catch (error) {
            toast.error("An unexpected error occurred while fetching blogs");
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // GET ONE BLOG
    const fetchOneBlog = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await apiGetOneBlog(id);
            if (res.success) {
                setCurrentBlog(res.blog);
                return { success: true, data: res.blog };
            } else {
                toast.error(res.message || "Failed to fetch blog details");
                return { success: false, message: res.message };
            }
        } catch (error) {
            toast.error("An unexpected error occurred while fetching blog details");
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // GET BLOGS BY CATEGORY
    const fetchBlogsByCategory = useCallback(async (category) => {
        setLoading(true);
        try {
            const res = await apiGetBlogsByCategory(category);
            if (res.success) {
                setBlogs(res.blogs || []);
                return { success: true, data: res.blogs };
            } else {
                toast.error(res.message || "Failed to fetch category blogs");
                return { success: false, message: res.message };
            }
        } catch (error) {
            toast.error("An unexpected error occurred while fetching category blogs");
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        blogs,
        currentBlog,
        loading,
        pagination,
        createBlog,
        updateBlog,
        deleteBlog,
        fetchAllBlogs,
        fetchOneBlog,
        fetchBlogsByCategory
    };
};
