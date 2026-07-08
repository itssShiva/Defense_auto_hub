import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useBrand } from "../../brand/hooks/useBrand";
import { Pencil, Trash2, Plus } from "lucide-react";

const AllBrands = ({ handleEditBrandClick }) => {
    const { getAllBrands, deleteBrand, loading } = useBrand();
    const [brands, setBrands] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    const fetchBrands = async () => {
        setIsFetching(true);
        const res = await getAllBrands();
        if (res?.success) {
            setBrands(res.brands);
        } else {
            toast.error("Failed to fetch brands");
        }
        setIsFetching(false);
    };

    useEffect(() => {
        fetchBrands();
    }, [getAllBrands]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

        const toastId = toast.loading(`Deleting ${name}...`);
        const res = await deleteBrand(id);
        
        if (res?.success) {
            toast.success(`${name} deleted successfully!`, { id: toastId });
            setBrands((prev) => prev.filter((b) => b._id !== id));
        } else {
            toast.error(res?.message || "Failed to delete brand", { id: toastId });
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#19456d] mb-2">All Brands</h2>
                    <p className="text-[#708ca4]">Manage your vehicle brands catalogue</p>
                </div>
            </div>

            {isFetching ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin w-10 h-10 border-4 border-[#19456d] border-t-transparent rounded-full"></div>
                </div>
            ) : brands.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-[#708ca4]/20 shadow-sm">
                    <p className="text-xl text-[#708ca4] font-medium">No brands found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-[#708ca4]/20 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#fafbf8] border-b border-[#708ca4]/20">
                                    <th className="py-4 px-6 font-bold text-[#19456d] uppercase text-sm tracking-wider">Logo</th>
                                    <th className="py-4 px-6 font-bold text-[#19456d] uppercase text-sm tracking-wider">Brand Name</th>
                                    <th className="py-4 px-6 font-bold text-[#19456d] uppercase text-sm tracking-wider">Country</th>
                                    <th className="py-4 px-6 font-bold text-[#19456d] uppercase text-sm tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#708ca4]/10">
                                {brands.map((brand) => (
                                    <tr key={brand._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-6">
                                            <div className="w-16 h-12 bg-gray-100 rounded-md p-1 border border-gray-200 flex items-center justify-center">
                                                <img 
                                                    src={brand.logo?.startsWith('http') ? brand.logo : `${import.meta.env.VITE_BACKEND_URL}${brand.logo}`}
                                                    alt={brand.brandName} 
                                                    className="max-w-full max-h-full object-contain"
                                                    onError={(e) => { e.target.src = "https://www.seat.com.mt/content/dam/public/seat-website/carworlds/compare/default-image/ghost.png" }}
                                                />
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-gray-800">{brand.brandName}</td>
                                        <td className="py-4 px-6 text-gray-600">{brand.brandCountry}</td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleEditBrandClick(brand._id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Brand"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(brand._id, brand.brandName)}
                                                    disabled={loading}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete Brand"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllBrands;
