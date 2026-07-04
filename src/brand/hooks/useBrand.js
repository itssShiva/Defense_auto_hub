import { useState, useCallback } from 'react';
import {
    createBrand as createBrandApi,
    getAllBrands as getAllBrandsApi,
    getBrandById as getBrandByIdApi,
    updateBrand as updateBrandApi,
    deleteBrand as deleteBrandApi
} from '../api/brand.api';

export const useBrand = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createBrand = useCallback(async (formData) => {
        setLoading(true);
        setError(null);
        const res = await createBrandApi(formData);
        setLoading(false);
        if (!res.success && res.message) {
            setError(res.message);
        }
        return res;
    }, []);

    const getAllBrands = useCallback(async () => {
        setLoading(true);
        setError(null);
        const res = await getAllBrandsApi();
        setLoading(false);
        if (!res.success && res.message) {
            setError(res.message);
        }
        return res;
    }, []);

    const getBrandById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        const res = await getBrandByIdApi(id);
        setLoading(false);
        if (!res.success && res.message) {
            setError(res.message);
        }
        return res;
    }, []);

    const updateBrand = useCallback(async (id, formData) => {
        setLoading(true);
        setError(null);
        const res = await updateBrandApi(id, formData);
        setLoading(false);
        if (!res.success && res.message) {
            setError(res.message);
        }
        return res;
    }, []);

    const deleteBrand = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        const res = await deleteBrandApi(id);
        setLoading(false);
        if (!res.success && res.message) {
            setError(res.message);
        }
        return res;
    }, []);

    return {
        loading,
        error,
        createBrand,
        getAllBrands,
        getBrandById,
        updateBrand,
        deleteBrand,
    };
};
