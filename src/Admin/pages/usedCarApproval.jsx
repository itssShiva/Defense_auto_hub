import React, { useEffect, useState } from "react";
import { useCars } from "../../cars/hooks/useCars";

const UsedCarApproval = () => {
    const { usedCars, fetchAllUsedCars, approveUsedCar, removeUsedCar, loading } = useCars();
    const [selectedCar, setSelectedCar] = useState(null);

    // Fetch on mount
    useEffect(() => {
        fetchAllUsedCars();
    }, [fetchAllUsedCars]);

    // Filter only pending cars
    const pendingCars = usedCars?.filter(car => car.isVerified === "Pending") || [];

    const handleApprove = async (id) => {
        const res = await approveUsedCar(id);
        if (res?.success && selectedCar?._id === id) {
            setSelectedCar(null); // Close modal if approved from inside
        }
    };

    const handleReject = async (id) => {
        const res = await removeUsedCar(id);
        if (res?.success && selectedCar?._id === id) {
            setSelectedCar(null); // Close modal if rejected from inside
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#19456d]">Pending Used Cars ({pendingCars.length})</h2>
                <button
                    onClick={() => fetchAllUsedCars()}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
                >
                    {loading ? "Refreshing..." : "Refresh List"}
                </button>
            </div>

            {loading && pendingCars.length === 0 ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#19456d]"></div>
                </div>
            ) : pendingCars.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <span className="text-4xl block mb-4">🎉</span>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">All Caught Up!</h3>
                    <p className="text-gray-500">There are no pending used cars waiting for approval.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingCars.map((car) => (
                        <div key={car._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="h-48 overflow-hidden bg-gray-100">
                                <img
                                    src={car.carImages?.[0] ? `http://localhost:3000${car.carImages[0]}` : 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={car.modelName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                                />
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-xs font-bold text-[#b48001] uppercase tracking-wider">{car.brandName}</p>
                                        <h3 className="text-lg font-bold text-gray-800 leading-tight">{car.modelName}</h3>
                                    </div>
                                    <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                                        Pending
                                    </span>
                                </div>
                                <p className="text-lg font-extrabold text-[#19456d] mb-4">₹{car.ExShowroomPrice?.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-400">(Ex-Showroom)</span></p>

                                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-6 flex-1">
                                    <div className="flex items-center gap-1"><span>📅</span> {car.year}</div>
                                    <div className="flex items-center gap-1"><span>🛣️</span> {car.kmTravelled?.toLocaleString()} km</div>
                                    <div className="flex items-center gap-1"><span>⛽</span> {car.fuelType}</div>
                                    <div className="flex items-center gap-1"><span>⚙️</span> {car.transmissionType}</div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <button
                                        onClick={() => setSelectedCar(car)}
                                        className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors text-sm"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleApprove(car._id)}
                                        disabled={loading}
                                        className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold rounded-lg transition-colors text-sm"
                                        title="Approve"
                                    >
                                        ✓
                                    </button>
                                    <button
                                        onClick={() => handleReject(car._id)}
                                        disabled={loading}
                                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg transition-colors text-sm"
                                        title="Reject"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Details Modal */}
            {selectedCar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8 relative">
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedCar(null)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors z-10"
                        >
                            ✕
                        </button>

                        <div className="flex flex-col md:flex-row">
                            {/* Left: Images */}
                            <div className="md:w-2/5 bg-gray-100 flex flex-col">
                                <img
                                    src={selectedCar.carImages?.[0] ? `http://localhost:3000${selectedCar.carImages[0]}` : 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={selectedCar.modelName}
                                    className="w-full object-cover min-h-[300px] flex-1"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                                />
                                {selectedCar.carImages?.length > 1 && (
                                    <div className="flex gap-1.5 p-2 bg-gray-200 overflow-x-auto">
                                        {selectedCar.carImages.map((img, i) => (
                                            <img key={i} src={`http://localhost:3000${img}`} alt={`img-${i}`}
                                                className="h-14 w-20 object-cover rounded shrink-0 border-2 border-white"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right: Details */}
                            <div className="md:w-3/5 p-6 md:p-8 flex flex-col">
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-1">
                                        <p className="text-sm font-bold text-[#b48001] uppercase tracking-wider">{selectedCar.brandName}</p>
                                        <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">Pending Approval</span>
                                    </div>
                                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{selectedCar.modelName}</h2>
                                    <p className="text-2xl font-black text-[#19456d]">₹{selectedCar.ExShowroomPrice?.toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-400">(Ex-Showroom)</span></p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Year</p>
                                        <p className="font-medium">{selectedCar.year}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">KM Driven</p>
                                        <p className="font-medium">{selectedCar.kmTravelled?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Fuel</p>
                                        <p className="font-medium">{selectedCar.fuelType}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Transmission</p>
                                        <p className="font-medium">{selectedCar.transmissionType}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Color</p>
                                        <p className="font-medium">{selectedCar.color}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Ownership</p>
                                        <p className="font-medium">{selectedCar.owner}</p>
                                    </div>
                                </div>

                                {/* Normal Pricing Breakdown */}
                                <div className="border-t border-gray-100 pt-5 mb-5">
                                    <h3 className="text-sm font-bold text-[#19456d] uppercase tracking-wider mb-3">💰 Normal Pricing Breakdown</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {[
                                            ["CSD Price", selectedCar.CSDPrice],
                                            ["On-Road Price", selectedCar.OnRoadPrice],
                                            ["Ex-Showroom", selectedCar.ExShowroomPrice],
                                            ["RTO", selectedCar.RTO],
                                            ["Insurance", selectedCar.Insurance],
                                            ["Registration Fee", selectedCar.RegistraionFee],
                                            ["Fast Tag Fee", selectedCar.FastTagFee],
                                            ["HP Endorsement", selectedCar.HPEndorsementFee],
                                            ["HSRP/Smart/Temp", selectedCar.HSRPSMartCardTemporaryFee],
                                        ].map(([label, val]) => (
                                            <div key={label} className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                                <span className="text-gray-500 text-xs">{label}</span>
                                                <span className="font-semibold text-gray-800">₹{val?.toLocaleString('en-IN') ?? '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* BH Pricing Breakdown */}
                                <div className="border-t border-gray-100 pt-5 mb-5">
                                    <h3 className="text-sm font-bold text-[#19456d] uppercase tracking-wider mb-3">🏛️ BH Pricing Breakdown</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {[
                                            ["BH On-Road", selectedCar.BHOnRoadPrice],
                                            ["BH Ex-Showroom", selectedCar.ExShowroomPriceBH],
                                            ["BH Reg. Cost", selectedCar.BHRegistrationCost],
                                            ["BH Insurance", selectedCar.BHInsurance],
                                            ["BH Reg. Fee", selectedCar.BHRegistrationFee],
                                            ["BH Fast Tag", selectedCar.BHFastTagFee],
                                            ["BH HP Endorsement", selectedCar.BHHPEndorsementFee],
                                            ["BH HSRP/Smart", selectedCar.BHHSRPSMartCardTemporaryFee],
                                        ].map(([label, val]) => (
                                            <div key={label} className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                                <span className="text-gray-500 text-xs">{label}</span>
                                                <span className="font-semibold text-gray-800">₹{val?.toLocaleString('en-IN') ?? '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Other Pricing */}
                                <div className="border-t border-gray-100 pt-5 mb-5">
                                    <h3 className="text-sm font-bold text-[#19456d] uppercase tracking-wider mb-3">💳 Other Pricing</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {[
                                            ["Civil Ex-Showroom", selectedCar.civilExShowroomPrice],
                                            ["Monthly EMI", selectedCar.MonthlyEMI],
                                        ].map(([label, val]) => (
                                            <div key={label} className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                                <span className="text-gray-500 text-xs">{label}</span>
                                                <span className="font-semibold text-gray-800">₹{val?.toLocaleString('en-IN') ?? '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Dealer Details */}
                                <div className="border-t border-gray-200 pt-6 mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span>🏪</span> Dealer Information
                                    </h3>
                                    {selectedCar.postedBy ? (
                                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#19456d] text-white flex items-center justify-center font-bold text-lg shrink-0">
                                                    {selectedCar.postedBy.dealerName?.charAt(0) || "D"}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{selectedCar.postedBy.dealerName}</p>
                                                    <p className="text-sm text-gray-600 flex items-center gap-1"><span>📧</span> {selectedCar.postedBy.email}</p>
                                                    <p className="text-sm text-gray-600 flex items-center gap-1"><span>📞</span> {selectedCar.postedBy.phone}</p>
                                                    <p className="text-sm  flex items-center gap-1 mt-1 text-gray-600">
                                                        <span>📍</span> {selectedCar.Address}, {selectedCar.City}, {selectedCar.State}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">Dealer information not available.</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-auto flex gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleReject(selectedCar._id)}
                                        disabled={loading}
                                        className="flex-1 py-3 px-4 bg-white border-2 border-red-200 hover:border-red-600 hover:bg-red-50 text-red-600 font-bold rounded-xl transition-all"
                                    >
                                        Reject & Delete
                                    </button>
                                    <button
                                        onClick={() => handleApprove(selectedCar._id)}
                                        disabled={loading}
                                        className="flex-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-600/30"
                                    >
                                        Approve Listing
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsedCarApproval;
