import { useState, useCallback } from "react";
import { addNewCar, getAllCars, getCarById, deleteCar, updateCar as updateCarApi } from "../Api/cars.api";
import { toast } from "react-hot-toast";

export const useCars = () => {
    const [cars, setCars] = useState([]);
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(false);

    /* ---------- Fetch All Cars ---------- */
    const fetchAllCars = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllCars();
            if (res?.success) {
                setCars(res.cars);
            } else {
                toast.error(res?.message || "Failed to fetch cars.");
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred while fetching cars.");
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- Fetch Car By ID ---------- */
    const fetchCarById = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await getCarById(id);
            if (res?.success) {
                setCar(res.car);
            } else {
                toast.error(res?.message || "Failed to fetch car details.");
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred while fetching the car.");
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- Add New Car ---------- */
    const addCar = useCallback(async (formData) => {
        setLoading(true);
        const toastId = toast.loading("Adding car...");
        try {
            const res = await addNewCar(formData);
            if (res?.success) {
                toast.success(res.message || "Car added successfully!", { id: toastId });
                setCars((prev) => [res.car, ...prev]);
            } else {
                toast.error(res?.message || "Failed to add car.", { id: toastId });
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred.", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- Delete Car ---------- */
    const removeCar = useCallback(async (id) => {
        // Show confirmation first
        return new Promise((resolve) => {
            toast((t) => (
                <div className="flex flex-col gap-3">
                    <p className="font-semibold text-gray-800">Are you sure you want to delete this car?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                toast.dismiss(t.id);
                                const toastId = toast.loading("Deleting car...");
                                setLoading(true);
                                try {
                                    const res = await deleteCar(id);
                                    if (res?.success) {
                                        toast.success("Car deleted successfully!", { id: toastId });
                                        setCars((prev) => prev.filter((c) => c._id !== id));
                                        resolve(res);
                                    } else {
                                        toast.error(res?.message || "Failed to delete car.", { id: toastId });
                                        resolve(res);
                                    }
                                } catch (err) {
                                    toast.error("An unexpected error occurred.", { id: toastId });
                                    resolve({ success: false });
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg"
                        >Delete</button>
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve({ success: false, cancelled: true }); }}
                            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg"
                        >Cancel</button>
                    </div>
                </div>
            ), { duration: Infinity });
        });
    }, []);


    /* ---------- Update Car ---------- */
    const updateCar = useCallback(async (id, formData) => {
        setLoading(true);
        const toastId = toast.loading("Updating car...");
        try {
            const res = await updateCarApi(id, formData);
            if (res?.success) {
                toast.success(res.message || "Car updated successfully!", { id: toastId });
                setCars((prev) =>
                    prev.map((c) => (c._id === id ? res.car : c))
                );
                setCar(res.car);
            } else {
                toast.error(res?.message || "Failed to update car.", { id: toastId });
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred.", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, []);



    return {
        cars,
        car,
        loading,
        fetchAllCars,
        fetchCarById,
        addCar,
        removeCar,
        updateCar,
        setCars,
        setCar,
    };
};
