import axios from "axios";

/* ── Base axios instances ───────────────────────────────────── */
const carsApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1/car`,
    withCredentials: true,
});

const vehicleApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1/vehicle`,
    withCredentials: true,
});

/* ══════════════════════════════════════════════════════════════
   NEW VEHICLE MANAGEMENT API (Brand → Vehicle → Model → Variant)
══════════════════════════════════════════════════════════════ */

/* ── Filter Options ──────────────────────────────────────── */
export const getFilterOptions = async () => {
    try {
        const res = await vehicleApi.get("/filter-options");
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

/* ── Vehicle CRUD ─────────────────────────────────────────── */
export const addVehicle = async (formData) => {
    try {
        const res = await vehicleApi.post("/add", formData, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const getAllVehicles = async (params = {}) => {
    try {
        const res = await vehicleApi.get("/all", { params });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const getVehiclesByBrand = async (brandId) => {
    try {
        const res = await vehicleApi.get("/all", { params: { brandId } });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const getVehicleById = async (id) => {
    try {
        const res = await vehicleApi.get(`/vehicle/${id}`);
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const updateVehicle = async (id, formData) => {
    try {
        const res = await vehicleApi.put(`/vehicle/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const deleteVehicle = async (id) => {
    try {
        const res = await vehicleApi.delete(`/vehicle/${id}`);
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

/* ── Vehicle Model CRUD ───────────────────────────────────── */
export const addNewModel = async (formData) => {
    try {
        const res = await vehicleApi.post("/model/add", formData, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const getAllModels = async (params = {}) => {
    try {
        const res = await vehicleApi.get("/model/all", { params });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const getModelsByVehicle = async (vehicleId) => {
    try {
        const res = await vehicleApi.get("/model/all", { params: { vehicleId } });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const getModelById = async (id) => {
    try {
        const res = await vehicleApi.get(`/model/${id}`);
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const updateModel = async (id, formData) => {
    try {
        const res = await vehicleApi.put(`/model/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const deleteModel = async (id) => {
    try {
        const res = await vehicleApi.delete(`/model/${id}`);
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

/* ── Variant CRUD ─────────────────────────────────────────── */
export const addVariant = async (formData) => {
    try {
        const res = await vehicleApi.post("/variant/add", formData, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const getAllVariants = async (params = {}) => {
    try {
        const res = await vehicleApi.get("/variant/all", { params });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const getVariantsByModel = async (modelId) => {
    try {
        const res = await vehicleApi.get("/variant/all", { params: { modelId } });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const getVariantById = async (id) => {
    try {
        const res = await vehicleApi.get(`/variant/${id}`);
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const updateVariant = async (id, formData) => {
    try {
        const res = await vehicleApi.put(`/variant/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const deleteVariant = async (id) => {
    try {
        const res = await vehicleApi.delete(`/variant/${id}`);
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

/* ── Used Car CRUD ────────────────────────────────────────── */
export const addUsedCar = async (formData) => {
    try {
        const res = await vehicleApi.post("/usedcar/add", formData, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const updateUsedCar = async (id, formData) => {
    try {
        const res = await vehicleApi.put(`/usedcar/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const deleteUsedCar = async (id) => {
    try {
        const res = await vehicleApi.delete(`/usedcar/${id}`);
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const getAllUsedCars = async () => {
    try {
        const res = await vehicleApi.get("/usedcar/all");
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const getUsedCarById = async (id) => {
    try {
        const res = await vehicleApi.get(`/usedcar/${id}`);
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const approveUsedCar = async (id) => {
    try {
        const res = await vehicleApi.put(`/usedcar/approve/${id}`);
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

/* ══════════════════════════════════════════════════════════════
   LEGACY CAR API  (kept for public-facing pages that still use /api/v1/car)
══════════════════════════════════════════════════════════════ */
export const addNewCar = async (formData) => {
    try {
        const res = await carsApi.post("/add/newcar", formData, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const getAllCars = async () => {
    try {
        const res = await carsApi.get("/all");
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const getCarById = async (id) => {
    try {
        const res = await carsApi.get(`/${id}`);
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const deleteCar = async (id) => {
    try {
        const res = await carsApi.delete(`/${id}`);
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export const updateCar = async (id, formData) => {
    try {
        const res = await carsApi.put(`/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        return res.data;
    } catch (e) { return { success: false, message: e.response?.data?.message || e.message }; }
};

export default vehicleApi;
