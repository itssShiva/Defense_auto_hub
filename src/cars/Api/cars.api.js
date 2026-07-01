import axios from "axios";

const carsApi = axios.create({
    baseURL: "http://localhost:3000/api/v1/car",
    withCredentials: true  // needed for auth cookie to be sent
});

/* ================= ADD NEW CAR ================= */
export const addNewCar = async (formData) => {
    try {
        const res = await carsApi.post("/add/newcar", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/* ================= GET ALL CARS ================= */
export const getAllCars = async () => {
    try {
        const res = await carsApi.get("/all");
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/* ================= GET CAR BY ID ================= */
export const getCarById = async (id) => {
    try {
        const res = await carsApi.get(`/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/* ================= DELETE CAR ================= */
export const deleteCar = async (id) => {
    try {
        const res = await carsApi.delete(`/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};




/* ================= Update CAR Details ================= */
export const updateCar = async (id, formData) => {
    try {
        const res = await carsApi.put(`/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};


/* ================= ADD NEW CAR MODEL ================= */
export const addNewModel = async (formData) => {
    try {
        const res = await carsApi.post("/add/newmodel", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

/* ================= MODEL API ================= */
export const getAllModels = async () => {
    try {
        const res = await carsApi.get("/model/all");
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const updateModel = async (id, formData) => {
    try {
        const res = await carsApi.put(`/model/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};

export const deleteModel = async (id) => {
    try {
        const res = await carsApi.delete(`/model/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
};


export const addVariant = async (formData) => {
    try {
        const res = await carsApi.post("/add/variant", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const updateVariant = async (id, formData) => {
    try {
        const res = await carsApi.put(`/update/variant/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const deleteVariant = async (id) => {
    try {
        const res = await carsApi.delete(`/delete/variant/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const getAllVariants = async () => {
    try {
        const res = await carsApi.get("/variant/all");
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const getVariantById = async (id) => {
    try {
        const res = await carsApi.get(`/variant/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}


export const addUsedCar = async (formData) => {
    try {
        const res = await carsApi.post("/add/usedcar", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const updateUsedCar = async (id, formData) => {
    try {
        const res = await carsApi.put(`/update/usedcar/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const deleteUsedCar = async (id) => {
    try {
        const res = await carsApi.delete(`/delete/usedcar/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const getAllUsedCars = async () => {
    try {
        const res = await carsApi.get("/usedcar/all");
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export const approveUsedCar = async (id) => {
    try {
        const res = await carsApi.put(`/approve/usedcar/${id}`);
        return res.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
}

export default carsApi;
