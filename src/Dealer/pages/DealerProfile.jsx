import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import toast from "react-hot-toast";

const DealerProfile = () => {
    const { user, updateDealerProfile, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        dealerName: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
    });
    
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Populate data when user changes/loads
    useEffect(() => {
        if (user) {
            setFormData({
                dealerName: user.dealerName || "",
                contactPerson: user.contactPerson || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                city: user.city || "",
                state: user.state || "",
                pincode: user.pincode || "",
                country: user.country || "",
            });
            setImagePreview(user.profileImage || null);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5 MB");
                return;
            }
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset to original data
        if (user) {
            setFormData({
                dealerName: user.dealerName || "",
                contactPerson: user.contactPerson || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                city: user.city || "",
                state: user.state || "",
                pincode: user.pincode || "",
                country: user.country || "",
            });
            setImagePreview(user.profileImage || null);
            setProfileImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user?._id) {
            toast.error("User not found!");
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== user[key]) {
                data.append(key, formData[key]);
            }
        });

        if (profileImage) {
            data.append("profileImage", profileImage);
        }

        const response = await updateDealerProfile(user._id, data);
        if (response?.success) {
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } else {
            toast.error(response?.message || "Failed to update profile.");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-extrabold text-[#19456d]">Dealer Profile</h2>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="px-4 py-2 bg-[#19456d] text-white rounded-md hover:bg-[#113150] transition-colors"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0 bg-gray-100">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span>No Img</span>
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Update Profile Picture</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-[#19456d]/10 file:text-[#19456d]
                                    hover:file:bg-[#19456d]/20 cursor-pointer"
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dealership Name</label>
                        <input 
                            type="text" 
                            name="dealerName"
                            value={formData.dealerName}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-[#19456d] focus:border-[#19456d] ${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300"}`} 
                            placeholder="e.g. ABC Motors" 
                            disabled={!isEditing} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                        <input 
                            type="text" 
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-[#19456d] focus:border-[#19456d] ${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300"}`} 
                            placeholder="e.g. John Doe" 
                            disabled={!isEditing} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-[#19456d] focus:border-[#19456d] ${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300"}`} 
                            placeholder="dealer@example.com" 
                            disabled={!isEditing} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-[#19456d] focus:border-[#19456d] ${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300"}`} 
                            placeholder="9876543210" 
                            disabled={!isEditing} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input 
                            type="text" 
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-[#19456d] focus:border-[#19456d] ${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300"}`} 
                            placeholder="Country" 
                            disabled={!isEditing} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                        <input 
                            type="text" 
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-[#19456d] focus:border-[#19456d] ${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300"}`} 
                            placeholder="123456" 
                            disabled={!isEditing} 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input 
                                type="text" 
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-[#19456d] focus:border-[#19456d] ${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300"}`} 
                                placeholder="City" 
                                disabled={!isEditing} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input 
                                type="text" 
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-[#19456d] focus:border-[#19456d] ${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300"}`} 
                                placeholder="State" 
                                disabled={!isEditing} 
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea 
                        rows={3} 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-[#19456d] focus:border-[#19456d] ${!isEditing ? "bg-gray-50 border-gray-200" : "border-gray-300"}`} 
                        placeholder="Full dealership address" 
                        disabled={!isEditing}
                    ></textarea>
                </div>
                
                {isEditing && (
                    <div className="flex justify-end pt-4 gap-4">
                        <button 
                            type="button" 
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-6 py-2 bg-[#19456d] text-white rounded-md hover:bg-[#113150] transition-colors flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : "Save Changes"}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default DealerProfile;
