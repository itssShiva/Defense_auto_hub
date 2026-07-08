import { useState, useCallback } from "react";
import {
    addVehicle as addVehicleApi, getAllVehicles, getVehiclesByBrand, getVehicleById, updateVehicle as updateVehicleApi, deleteVehicle as deleteVehicleApi,
    addNewModel, getAllModels, getModelsByVehicle, getModelById, updateModel as updateModelApi, deleteModel as deleteModelApi,
    addVariant as addVariantApi, getAllVariants, getVariantsByModel, getVariantById, updateVariant as updateVariantApi, deleteVariant as deleteVariantApi,
    addUsedCar as addUsedCarApi, updateUsedCar as updateUsedCarApi, deleteUsedCar as deleteUsedCarApi, getAllUsedCars as getAllUsedCarsApi, approveUsedCar as approveUsedCarApi
} from "../Api/cars.api";
import { toast } from "react-hot-toast";

export const useCars = () => {
    const [vehicles, setVehicles] = useState([]);
    const [vehicle, setVehicle] = useState(null);
    const [models, setModels] = useState([]);
    const [variants, setVariants] = useState([]);
    const [usedCars, setUsedCars] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ══════════════════════════════════════════════════════════════
       VEHICLES
    ══════════════════════════════════════════════════════════════ */
    const fetchAllVehicles = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await getAllVehicles(params);
            if (res?.success) setVehicles(res.vehicles);
            else toast.error(res?.message || "Failed to fetch vehicles.");
            return res;
        } catch (err) { toast.error("Error fetching vehicles."); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const fetchVehiclesByBrandId = useCallback(async (brandId) => {
        setLoading(true);
        try {
            const res = await getVehiclesByBrand(brandId);
            if (res?.success) setVehicles(res.vehicles);
            else toast.error(res?.message || "Failed to fetch vehicles by brand.");
            return res;
        } catch (err) { toast.error("Error fetching vehicles by brand."); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const fetchVehicleById = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await getVehicleById(id);
            if (res?.success) setVehicle(res.vehicle);
            else toast.error(res?.message || "Failed to fetch vehicle details.");
            return res;
        } catch (err) { toast.error("Error fetching vehicle details."); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const addVehicle = useCallback(async (formData) => {
        setLoading(true);
        const toastId = toast.loading("Adding vehicle...");
        try {
            const res = await addVehicleApi(formData);
            if (res?.success) {
                toast.success(res.message || "Vehicle added successfully!", { id: toastId });
                setVehicles((prev) => [res.vehicle, ...prev]);
            } else toast.error(res?.message || "Failed to add vehicle.", { id: toastId });
            return res;
        } catch (err) { toast.error("Error adding vehicle.", { id: toastId }); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const updateVehicle = useCallback(async (id, formData) => {
        setLoading(true);
        const toastId = toast.loading("Updating vehicle...");
        try {
            const res = await updateVehicleApi(id, formData);
            if (res?.success) {
                toast.success(res.message || "Vehicle updated successfully!", { id: toastId });
                setVehicles((prev) => prev.map((v) => (v._id === id ? res.vehicle : v)));
                if (vehicle?._id === id) setVehicle(res.vehicle);
            } else toast.error(res?.message || "Failed to update vehicle.", { id: toastId });
            return res;
        } catch (err) { toast.error("Error updating vehicle.", { id: toastId }); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const removeVehicle = useCallback(async (id) => {
        return new Promise((resolve) => {
            toast((t) => (
                <div className="flex flex-col gap-3">
                    <p className="font-semibold text-gray-800">Are you sure you want to delete this vehicle?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                toast.dismiss(t.id);
                                const toastId = toast.loading("Deleting vehicle...");
                                setLoading(true);
                                try {
                                    const res = await deleteVehicleApi(id);
                                    if (res?.success) {
                                        toast.success("Vehicle deleted successfully!", { id: toastId });
                                        setVehicles((prev) => prev.filter((v) => v._id !== id));
                                    } else toast.error(res?.message || "Failed to delete vehicle.", { id: toastId });
                                    resolve(res);
                                } catch (err) { toast.error("Error deleting vehicle.", { id: toastId }); resolve({ success: false }); }
                                finally { setLoading(false); }
                            }}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg"
                        >Delete</button>
                        <button onClick={() => { toast.dismiss(t.id); resolve({ success: false, cancelled: true }); }} className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg">Cancel</button>
                    </div>
                </div>
            ), { duration: Infinity });
        });
    }, []);

    /* ══════════════════════════════════════════════════════════════
       MODELS
    ══════════════════════════════════════════════════════════════ */
    const fetchAllModels = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await getAllModels(params);
            if (res?.success) setModels(res.models);
            else toast.error(res?.message || "Failed to fetch models.");
            return res;
        } catch (err) { toast.error("Error fetching models."); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const fetchModelsByVehicleId = useCallback(async (vehicleId) => {
        setLoading(true);
        try {
            const res = await getModelsByVehicle(vehicleId);
            if (res?.success) setModels(res.models);
            else toast.error(res?.message || "Failed to fetch models for vehicle.");
            return res;
        } catch (err) { toast.error("Error fetching models."); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const addModel = useCallback(async (formData) => {
        setLoading(true);
        const toastId = toast.loading("Adding model...");
        try {
            const res = await addNewModel(formData);
            if (res?.success) {
                toast.success(res.message || "Model added successfully!", { id: toastId });
                setModels((prev) => [res.model, ...prev]);
            } else toast.error(res?.message || "Failed to add model.", { id: toastId });
            return res;
        } catch (err) { toast.error("Error adding model.", { id: toastId }); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const updateModel = useCallback(async (id, formData) => {
        setLoading(true);
        const toastId = toast.loading("Updating model...");
        try {
            const res = await updateModelApi(id, formData);
            if (res?.success) {
                toast.success(res.message || "Model updated successfully!", { id: toastId });
                setModels((prev) => prev.map((m) => (m._id === id ? res.model : m)));
            } else toast.error(res?.message || "Failed to update model.", { id: toastId });
            return res;
        } catch (err) { toast.error("Error updating model.", { id: toastId }); return { success: false }; }
        finally { setLoading(false); }
    }, []);

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
                                    const res = await deleteModelApi(id);
                                    if (res?.success) {
                                        toast.success("Model deleted successfully!", { id: toastId });
                                        setModels((prev) => prev.filter((m) => m._id !== id));
                                    } else toast.error(res?.message || "Failed to delete model.", { id: toastId });
                                    resolve(res);
                                } catch (err) { toast.error("Error deleting model.", { id: toastId }); resolve({ success: false }); }
                                finally { setLoading(false); }
                            }}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg"
                        >Delete</button>
                        <button onClick={() => { toast.dismiss(t.id); resolve({ success: false, cancelled: true }); }} className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg">Cancel</button>
                    </div>
                </div>
            ), { duration: Infinity });
        });
    }, []);

    /* ══════════════════════════════════════════════════════════════
       VARIANTS
    ══════════════════════════════════════════════════════════════ */
    const fetchAllVariants = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const res = await getAllVariants(params);
            if (res?.success) setVariants(res.variants);
            else toast.error(res?.message || "Failed to fetch variants.");
            return res;
        } catch (err) { toast.error("Error fetching variants."); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const fetchVariantsByModelId = useCallback(async (modelId) => {
        setLoading(true);
        try {
            const res = await getVariantsByModel(modelId);
            if (res?.success) setVariants(res.variants);
            else toast.error(res?.message || "Failed to fetch variants for model.");
            return res;
        } catch (err) { toast.error("Error fetching variants."); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const fetchVariantById = useCallback(async (id) => {
        setLoading(true);
        try {
            const res = await getVariantById(id);
            if (!res?.success) toast.error(res?.message || "Failed to fetch variant details.");
            return res;
        } catch (err) { toast.error("Error fetching variant details."); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const addVariantHook = useCallback(async (formData) => {
        setLoading(true);
        const toastId = toast.loading("Adding variant...");
        try {
            const res = await addVariantApi(formData);
            if (res?.success) {
                toast.success(res.message || "Variant added successfully!", { id: toastId });
                setVariants((prev) => [res.variant, ...prev]);
            } else toast.error(res?.message || "Failed to add variant.", { id: toastId });
            return res;
        } catch (err) { toast.error("Error adding variant.", { id: toastId }); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const updateVariantHook = useCallback(async (id, formData) => {
        setLoading(true);
        const toastId = toast.loading("Updating variant...");
        try {
            const res = await updateVariantApi(id, formData);
            if (res?.success) {
                toast.success(res.message || "Variant updated successfully!", { id: toastId });
                setVariants((prev) => prev.map((v) => (v._id === id ? res.variant : v)));
            } else toast.error(res?.message || "Failed to update variant.", { id: toastId });
            return res;
        } catch (err) { toast.error("Error updating variant.", { id: toastId }); return { success: false }; }
        finally { setLoading(false); }
    }, []);

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
                                    } else toast.error(res?.message || "Failed to delete variant.", { id: toastId });
                                    resolve(res);
                                } catch (err) { toast.error("Error deleting variant.", { id: toastId }); resolve({ success: false }); }
                                finally { setLoading(false); }
                            }}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg"
                        >Delete</button>
                        <button onClick={() => { toast.dismiss(t.id); resolve({ success: false, cancelled: true }); }} className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg">Cancel</button>
                    </div>
                </div>
            ), { duration: Infinity });
        });
    }, []);

    /* ══════════════════════════════════════════════════════════════
       USED CARS
    ══════════════════════════════════════════════════════════════ */
    const fetchAllUsedCars = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllUsedCarsApi();
            if (res?.success) setUsedCars(res.usedCars);
            else toast.error(res?.message || "Failed to fetch used vehicles.");
            return res;
        } catch (err) { toast.error("Error fetching used vehicles."); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const addUsedCarHook = useCallback(async (formData) => {
        setLoading(true);
        const toastId = toast.loading("Adding used vehicle listing...");
        try {
            const res = await addUsedCarApi(formData);
            if (res?.success) {
                toast.success(res.message || "Used vehicle added successfully!", { id: toastId });
                setUsedCars((prev) => [res.usedCar, ...prev]);
            } else toast.error(res?.message || "Failed to add used vehicle.", { id: toastId });
            return res;
        } catch (err) { toast.error("Error adding used vehicle.", { id: toastId }); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const updateUsedCarHook = useCallback(async (id, formData) => {
        setLoading(true);
        const toastId = toast.loading("Updating used vehicle...");
        try {
            const res = await updateUsedCarApi(id, formData);
            if (res?.success) {
                toast.success(res.message || "Used vehicle updated successfully!", { id: toastId });
                setUsedCars((prev) => prev.map((uc) => (uc._id === id ? res.usedCar : uc)));
            } else toast.error(res?.message || "Failed to update used vehicle.", { id: toastId });
            return res;
        } catch (err) { toast.error("Error updating used vehicle.", { id: toastId }); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    const removeUsedCar = useCallback(async (id) => {
        return new Promise((resolve) => {
            toast((t) => (
                <div className="flex flex-col gap-3">
                    <p className="font-semibold text-gray-800">Are you sure you want to delete this used vehicle?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                toast.dismiss(t.id);
                                const toastId = toast.loading("Deleting used vehicle...");
                                setLoading(true);
                                try {
                                    const res = await deleteUsedCarApi(id);
                                    if (res?.success) {
                                        toast.success("Used vehicle deleted successfully!", { id: toastId });
                                        setUsedCars((prev) => prev.filter((uc) => uc._id !== id));
                                    } else toast.error(res?.message || "Failed to delete used vehicle.", { id: toastId });
                                    resolve(res);
                                } catch (err) { toast.error("Error deleting used vehicle.", { id: toastId }); resolve({ success: false }); }
                                finally { setLoading(false); }
                            }}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg"
                        >Delete</button>
                        <button onClick={() => { toast.dismiss(t.id); resolve({ success: false, cancelled: true }); }} className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg">Cancel</button>
                    </div>
                </div>
            ), { duration: Infinity });
        });
    }, []);

    const approveUsedCarHook = useCallback(async (id) => {
        setLoading(true);
        const toastId = toast.loading("Approving used vehicle...");
        try {
            const res = await approveUsedCarApi(id);
            if (res?.success) {
                toast.success(res.message || "Used vehicle approved successfully!", { id: toastId });
                setUsedCars((prev) => prev.map((uc) => (uc._id === id ? res.usedCar : uc)));
            } else toast.error(res?.message || "Failed to approve used vehicle.", { id: toastId });
            return res;
        } catch (err) { toast.error("Error approving used vehicle.", { id: toastId }); return { success: false }; }
        finally { setLoading(false); }
    }, []);

    /* ══════════════════════════════════════════════════════════════
       LEGACY ALIASES (to avoid breaking components not yet updated)
    ══════════════════════════════════════════════════════════════ */
    return {
        // State
        cars: vehicles, // alias for components expecting "cars"
        vehicles,
        car: vehicle,
        vehicle,
        models,
        variants,
        usedCars,
        loading,
        
        // Vehicle / Legacy Cars
        fetchAllCars: fetchAllVehicles,
        fetchAllVehicles,
        fetchVehiclesByBrandId,
        fetchCarById: fetchVehicleById,
        fetchVehicleById,
        addCar: addVehicle,
        addVehicle,
        updateCar: updateVehicle,
        updateVehicle,
        removeCar: removeVehicle,
        removeVehicle,
        setCars: setVehicles,
        setVehicles,
        setCar: setVehicle,
        setVehicle,

        // Models
        fetchAllModels,
        fetchModelsByVehicleId,
        addModel,
        updateModel,
        removeModel,
        setModels,

        // Variants
        fetchAllVariants,
        fetchVariantsByModelId,
        fetchVariantById,
        addVariant: addVariantHook,
        updateVariant: updateVariantHook,
        removeVariant,
        setVariants,

        // Used Cars
        fetchAllUsedCars,
        addUsedCar: addUsedCarHook,
        updateUsedCar: updateUsedCarHook,
        removeUsedCar,
        approveUsedCar: approveUsedCarHook,
        setUsedCars
    };
};
