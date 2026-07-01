import { useState, useCallback } from "react";
import { addNewCar, getAllCars, getCarById, deleteCar, updateCar as updateCarApi, addNewModel, getAllModels, updateModel as updateModelApi, deleteModel, addVariant as addVariantApi, updateVariant as updateVariantApi, deleteVariant as deleteVariantApi, getAllVariants, getVariantById, addUsedCar as addUsedCarApi, updateUsedCar as updateUsedCarApi, deleteUsedCar as deleteUsedCarApi, getAllUsedCars as getAllUsedCarsApi, approveUsedCar as approveUsedCarApi } from "../Api/cars.api";
import { toast } from "react-hot-toast";

export const useCars = () => {
    const [cars, setCars] = useState([]);
    const [car, setCar] = useState(null);
    const [models, setModels] = useState([]);
    const [variants, setVariants] = useState([]);
    const [usedCars, setUsedCars] = useState([]);
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


    /* ---------- Add New Car Model ---------- */
    const addModel = useCallback(async (formData) => {
        setLoading(true);
        const toastId = toast.loading("Adding model...");
        try {
            const res = await addNewModel(formData);
            if (res?.success) {
                toast.success(res.message || "Model added successfully!", { id: toastId });
            } else {
                toast.error(res?.message || "Failed to add model.", { id: toastId });
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred.", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, []);


    /* ---------- Fetch All Car Models ---------- */
    const fetchAllModels = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllModels();
            if (res?.success) {
                setModels(res.models);
            } else {
                toast.error(res?.message || "Failed to fetch models.");
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred while fetching models.");
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- Delete Model ---------- */
    const removeModel = useCallback(async (id) => {
        return new Promise((resolve) => {
            toast((t) => (
                <div className="flex flex-col gap-3">
                    <p className="font-semibold text-gray-800">Are you sure you want to delete this model?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                toast.dismiss(t.id);
                                const toastId = toast.loading("Deleting model...");
                                setLoading(true);
                                try {
                                    const res = await deleteModel(id);
                                    if (res?.success) {
                                        toast.success("Model deleted successfully!", { id: toastId });
                                        setModels((prev) => prev.filter((m) => m._id !== id));
                                        resolve(res);
                                    } else {
                                        toast.error(res?.message || "Failed to delete model.", { id: toastId });
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

    /* ---------- Update Model ---------- */
    const updateModel = useCallback(async (id, formData) => {
        setLoading(true);
        const toastId = toast.loading("Updating model...");
        try {
            const res = await updateModelApi(id, formData);
            if (res?.success) {
                toast.success(res.message || "Model updated successfully!", { id: toastId });
                setModels((prev) =>
                    prev.map((m) => (m._id === id ? res.model : m))
                );
            } else {
                toast.error(res?.message || "Failed to update model.", { id: toastId });
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred.", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- Add New Variant ---------- */
    const addVariantHook = useCallback(async (formData) => {
        setLoading(true);
        const toastId = toast.loading("Adding variant...");
        try {
            const res = await addVariantApi(formData);
            if (res?.success) {
                toast.success(res.message || "Variant added successfully!", { id: toastId });
                setVariants((prev) => [res.variant, ...prev]);
            } else {
                toast.error(res?.message || "Failed to add variant.", { id: toastId });
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred.", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- Update Variant ---------- */
    /* ---------- Update Variant ---------- */
    const updateVariantHook = useCallback(async (id, formData) => {
        setLoading(true);
        const toastId = toast.loading("Updating variant...");
        try {
            const res = await updateVariantApi(id, formData);
            if (res?.success) {
                toast.success(res.message || "Variant updated successfully!", { id: toastId });
                setVariants((prev) => prev.map((v) => (v._id === id ? res.variant : v)));
            } else {
                toast.error(res?.message || "Failed to update variant.", { id: toastId });
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred.", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- Remove Variant (with confirm) ---------- */
    const removeVariant = useCallback(async (id) => {
        return new Promise((resolve) => {
            toast((t) => (
                <div className="flex flex-col gap-3">
                    <p className="font-semibold text-gray-800">Are you sure you want to delete this variant?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                toast.dismiss(t.id);
                                const toastId = toast.loading("Deleting variant...");
                                setLoading(true);
                                try {
                                    const res = await deleteVariantApi(id);
                                    if (res?.success) {
                                        toast.success("Variant deleted successfully!", { id: toastId });
                                        setVariants((prev) => prev.filter((v) => v._id !== id));
                                        resolve(res);
                                    } else {
                                        toast.error(res?.message || "Failed to delete variant.", { id: toastId });
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

    /* ---------- Fetch All Variants ---------- */
    const fetchAllVariants = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllVariants();
            if (res?.success) {
                setVariants(res.variants);
            } else {
                toast.error(res?.message || "Failed to fetch variants.");
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred while fetching variants.");
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- Fetch Variant By ID ---------- */
    const fetchVariantById = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await getVariantById(id);
            if (!res?.success) {
                toast.error(res?.message || "Failed to fetch variant details.");
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred while fetching the variant.");
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- Fetch All Used Cars ---------- */
    const fetchAllUsedCars = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllUsedCarsApi();
            if (res?.success) {
                setUsedCars(res.usedCars);
            } else {
                toast.error(res?.message || "Failed to fetch used cars.");
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred while fetching used cars.");
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- Add Used Car ---------- */
    const addUsedCarHook = useCallback(async (formData) => {
        setLoading(true);
        const toastId = toast.loading("Adding used car listing...");
        try {
            const res = await addUsedCarApi(formData);
            if (res?.success) {
                toast.success(res.message || "Used car added successfully!", { id: toastId });
                setUsedCars((prev) => [res.usedCar, ...prev]);
            } else {
                toast.error(res?.message || "Failed to add used car.", { id: toastId });
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred.", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- Update Used Car ---------- */
    const updateUsedCarHook = useCallback(async (id, formData) => {
        setLoading(true);
        const toastId = toast.loading("Updating used car...");
        try {
            const res = await updateUsedCarApi(id, formData);
            if (res?.success) {
                toast.success(res.message || "Used car updated successfully!", { id: toastId });
                setUsedCars((prev) =>
                    prev.map((uc) => (uc._id === id ? res.usedCar : uc))
                );
            } else {
                toast.error(res?.message || "Failed to update used car.", { id: toastId });
            }
            return res;
        } catch (err) {
            toast.error("An unexpected error occurred.", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, []);

    /* ---------- Remove Used Car (with confirm) ---------- */
    const removeUsedCar = useCallback(async (id) => {
        return new Promise((resolve) => {
            toast((t) => (
                <div className="flex flex-col gap-3">
                    <p className="font-semibold text-gray-800">Are you sure you want to delete this used car listing?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                toast.dismiss(t.id);
                                const toastId = toast.loading("Deleting used car...");
                                setLoading(true);
                                try {
                                    const res = await deleteUsedCarApi(id);
                                    if (res?.success) {
                                        toast.success("Used car deleted successfully!", { id: toastId });
                                        setUsedCars((prev) => prev.filter((uc) => uc._id !== id));
                                        resolve(res);
                                    } else {
                                        toast.error(res?.message || "Failed to delete used car.", { id: toastId });
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

    /* ---------- Approve Used Car ---------- */
    const approveUsedCarHook = useCallback(async (id) => {
        setLoading(true);
        const toastId = toast.loading("Approving used car...");
        try {
            const res = await approveUsedCarApi(id);
            if (res?.success) {
                toast.success(res.message || "Used car approved successfully!", { id: toastId });
                setUsedCars((prev) =>
                    prev.map((uc) => (uc._id === id ? res.usedCar : uc))
                );
            } else {
                toast.error(res?.message || "Failed to approve used car.", { id: toastId });
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
        models,
        variants,
        usedCars,
        loading,
        fetchAllCars,
        fetchCarById,
        addCar,
        removeCar,
        updateCar,
        addModel,
        fetchAllModels,
        removeModel,
        updateModel,
        addVariant: addVariantHook,
        updateVariant: updateVariantHook,
        removeVariant,
        fetchAllVariants,
        fetchVariantById,
        addUsedCar: addUsedCarHook,
        updateUsedCar: updateUsedCarHook,
        removeUsedCar,
        approveUsedCar: approveUsedCarHook,
        fetchAllUsedCars,
        setCars,
        setCar,
        setModels,
        setVariants,
        setUsedCars,
    };
};
