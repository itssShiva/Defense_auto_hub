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



export default carsApi;
