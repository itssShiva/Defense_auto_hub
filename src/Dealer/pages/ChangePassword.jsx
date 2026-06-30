import React, { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import toast from "react-hot-toast";

const ChangePassword = () => {
    const { user, updateDealerPassword, loading } = useAuth();
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user?._id) {
            toast.error("Dealer not found!");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        const response = await updateDealerPassword(user._id, {
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword
        });

        if (response?.success) {
            toast.success("Password changed successfully!");
            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } else {
            toast.error(response?.message || "Failed to change password.");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold text-[#19456d] mb-6 border-b pb-4">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input 
                        type="password" 
                        name="currentPassword"
                        value={passwords.currentPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#19456d] focus:border-[#19456d]" 
                        placeholder="••••••••" 
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                        type="password" 
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#19456d] focus:border-[#19456d]" 
                        placeholder="••••••••" 
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input 
                        type="password" 
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#19456d] focus:border-[#19456d]" 
                        placeholder="••••••••" 
                        required
                    />
                </div>
                <div className="flex justify-end pt-4">
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
                                Updating...
                            </>
                        ) : "Update Password"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
