import { useState, useEffect, useCallback } from "react";
import { getAllBrands } from "../../brand/api/brand.api";
import { getVehiclesByBrand, getAllVariants } from "../../cars/Api/cars.api";

/**
 * useInsuranceWizard
 *
 * Manages brand → vehicle → fuel → variant cascade for the
 * New Car Insurance wizard using live database data.
 */
export function useInsuranceWizard() {
    // ── Brands ───────────────────────────────────────────────
    const [brands, setBrands] = useState([]);
    const [brandsLoading, setBrandsLoading] = useState(false);

    useEffect(() => {
        setBrandsLoading(true);
        getAllBrands()
            .then((res) => {
                if (res?.success) setBrands(res.brands || []);
            })
            .finally(() => setBrandsLoading(false));
    }, []);

    // ── Vehicles (fetched when brand is selected) ─────────────
    const [vehicles, setVehicles] = useState([]);
    const [vehiclesLoading, setVehiclesLoading] = useState(false);

    const fetchVehicles = useCallback(async (brandId) => {
        if (!brandId) { setVehicles([]); return; }
        setVehiclesLoading(true);
        const res = await getVehiclesByBrand(brandId);
        if (res?.success) setVehicles(res.vehicles || []);
        else setVehicles([]);
        setVehiclesLoading(false);
    }, []);

    // ── Variants (fetched when vehicle is selected) ───────────
    const [variants, setVariants] = useState([]);
    const [variantsLoading, setVariantsLoading] = useState(false);

    const fetchVariants = useCallback(async (vehicleId) => {
        if (!vehicleId) { setVariants([]); return; }
        setVariantsLoading(true);
        const res = await getAllVariants({ vehicleId });
        if (res?.success) setVariants(res.variants || []);
        else setVariants([]);
        setVariantsLoading(false);
    }, []);

    // ── Derived: unique fuel types from variant list ──────────
    const fuelTypes = [...new Set(
        variants.map((v) => v.fuelType || v.FuelType).filter(Boolean)
    )];

    // ── Derived: variants filtered by selected fuel ───────────
    const variantsByFuel = (fuel) =>
        variants.filter((v) => (v.fuelType || v.FuelType) === fuel);

    return {
        brands, brandsLoading,
        vehicles, vehiclesLoading, fetchVehicles,
        variants, variantsLoading, fetchVariants,
        fuelTypes, variantsByFuel,
    };
}
