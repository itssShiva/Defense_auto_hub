import React, { useEffect, useState } from "react";
import { useCars } from "../../cars/hooks/useCars";
import { useAuth } from "../../auth/hooks/useAuth";
import { toast } from "react-hot-toast";

const AllUsedCars = ({ onEdit }) => {
    const { usedCars, fetchAllUsedCars, removeUsedCar, loading } = useCars();
    const { user } = useAuth();
    const [viewCar, setViewCar] = useState(null);

    useEffect(() => {
        fetchAllUsedCars();
    }, [fetchAllUsedCars]);

    const myUsedCars = usedCars.filter(car => car.postedBy?._id === user?._id);

    const handleDelete = async (id) => {
        await removeUsedCar(id);
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-[#19456d] mb-2">My Used Vehicles</h2>
                <p className="text-[#708ca4]">Manage your uploaded used vehicle listings.</p>
            </div>

            {loading && usedCars.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19456d]"></div>
                </div>
            ) : myUsedCars.length === 0 ? (
                <div className="text-center py-16 bg-[#fafbf8] rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <span className="text-5xl block mb-4">🚗</span>
                    <h3 className="text-xl font-bold text-[#19456d] mb-2">No Used Vehicles Found</h3>
                    <p className="text-[#708ca4]">You haven't uploaded any used vehicles yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {myUsedCars.map(car => (
                        <div key={car._id} className="bg-white rounded-2xl border border-[#708ca4]/20 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                            <div className="aspect-video bg-gray-100 relative">
                                {car.carImages && car.carImages.length > 0 ? (
                                    <img src={car.carImages[0]} alt={car.modelName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md text-white shadow-sm
                                        ${car.isVerified === 'Verified' ? 'bg-green-500' : car.isVerified === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                                        {car.isVerified || 'Pending'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-[#19456d] line-clamp-1">{car.brandName} {car.modelName}</h3>
                                <div className="text-xl font-extrabold text-[#b48001] mt-1">₹{car.ExShowroomPrice?.toLocaleString('en-IN')}</div>

                                <div className="grid grid-cols-2 gap-y-2 mt-4 text-sm text-[#708ca4]">
                                    <div className="flex items-center gap-1.5"><span className="text-lg">📅</span> {car.year}</div>
                                    <div className="flex items-center gap-1.5"><span className="text-lg">🛣️</span> {car.kmTravelled?.toLocaleString('en-IN')} km</div>
                                    <div className="flex items-center gap-1.5"><span className="text-lg">⛽</span> {car.fuelType}</div>
                                    <div className="flex items-center gap-1.5"><span className="text-lg">⚙️</span> {car.transmissionType}</div>
                                </div>

                                <div className="mt-auto pt-5 flex gap-2">
                                    <button onClick={() => setViewCar(car)} className="flex-1 px-3 py-2 bg-[#fafbf8] border border-[#708ca4]/20 text-[#19456d] font-bold rounded-lg hover:bg-[#19456d] hover:text-white transition-colors text-sm">
                                        👁️ View
                                    </button>
                                    <button onClick={() => onEdit && onEdit(car._id)} className="flex-1 px-3 py-2 bg-[#fafbf8] border border-[#708ca4]/20 text-[#b48001] font-bold rounded-lg hover:bg-[#b48001] hover:text-white transition-colors text-sm">
                                        ✏️ Edit
                                    </button>
                                    <button onClick={() => handleDelete(car._id)} className="flex-1 px-3 py-2 bg-red-50 border border-red-100 text-red-600 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm">
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Details Modal */}
            {viewCar && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-[#fafbf8]">
                            <h3 className="text-xl font-bold text-[#19456d]">Used Vehicle Details</h3>
                            <button onClick={() => setViewCar(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 font-bold">✕</button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Images */}
                                <div className="w-full md:w-1/2">
                                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-3">
                                        {viewCar.carImages?.length > 0 ? (
                                            <img src={viewCar.carImages[0]} alt="Main" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                        )}
                                    </div>
                                    {viewCar.carImages?.length > 1 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {viewCar.carImages.slice(1).map((img, i) => (
                                                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={img} alt={`vehicle-${i + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="w-full md:w-1/2 space-y-6">
                                    <div>
                                        <h2 className="text-3xl font-extrabold text-[#19456d] mb-1">{viewCar.brandName} {viewCar.modelName}</h2>
                                        <div className="text-2xl font-bold text-[#b48001]">₹{viewCar.ExShowroomPrice?.toLocaleString('en-IN')} (Ex-Showroom)</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#fafbf8] p-3 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Year</p>
                                            <p className="font-semibold text-[#19456d]">{viewCar.year}</p>
                                        </div>
                                        <div className="bg-[#fafbf8] p-3 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">KM Driven</p>
                                            <p className="font-semibold text-[#19456d]">{viewCar.kmTravelled?.toLocaleString('en-IN')} km</p>
                                        </div>
                                        <div className="bg-[#fafbf8] p-3 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Fuel</p>
                                            <p className="font-semibold text-[#19456d]">{viewCar.fuelType}</p>
                                        </div>
                                        <div className="bg-[#fafbf8] p-3 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Transmission</p>
                                            <p className="font-semibold text-[#19456d]">{viewCar.transmissionType}</p>
                                        </div>
                                        <div className="bg-[#fafbf8] p-3 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Owner</p>
                                            <p className="font-semibold text-[#19456d]">{viewCar.owner}</p>
                                        </div>
                                        <div className="bg-[#fafbf8] p-3 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Color</p>
                                            <p className="font-semibold text-[#19456d]">{viewCar.color}</p>
                                        </div>
                                    </div>

                                    {/* Normal Pricing Breakdown */}
                                    <div className="border-t border-gray-100 pt-5">
                                        <h3 className="text-sm font-bold text-[#19456d] uppercase tracking-wider mb-3">💰 Normal Pricing Breakdown</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {[
                                                ["CSD Price", viewCar.CSDPrice],
                                                ["On-Road Price", viewCar.OnRoadPrice],
                                                ["Ex-Showroom", viewCar.ExShowroomPrice],
                                                ["Insurance", viewCar.Insurance],
                                                ["Registration Fee", viewCar.RegistraionFee],
                                                ["Fast Tag Fee", viewCar.FastTagFee],
                                                ["HP Endorsement", viewCar.HPEndorsementFee],
                                                ["HSRP/Smart/Temp", viewCar.HSRPSMartCardTemporaryFee],
                                            ].map(([label, val]) => (
                                                <div key={label} className="flex justify-between bg-[#fafbf8] px-3 py-2 rounded-lg border border-gray-100">
                                                    <span className="text-gray-500 font-medium">{label}</span>
                                                    <span className="font-bold text-[#19456d]">
                                                        {val ? `₹${Number(val).toLocaleString('en-IN')}` : "—"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Location</p>
                                        <p className="text-sm font-medium text-[#19456d]">{viewCar.Address}, {viewCar.City}, {viewCar.State}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Status</p>
                                        <span className={`px-3 py-1.5 text-sm font-bold rounded-lg text-white shadow-sm inline-block
                                            ${viewCar.isVerified === 'Verified' ? 'bg-green-500' : viewCar.isVerified === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                                            {viewCar.isVerified || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllUsedCars;
