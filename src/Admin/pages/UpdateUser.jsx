import React, { useState, useRef, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { getUserById, getDealerById, updateUser, updateDealer } from "../../auth/Api/auth.api";
import { toast } from "react-hot-toast";

const UpdateUser = ({ userId, userType, goBack }) => {
    const fileInputRef = useRef(null);

    // Common State
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState(""); // Leave empty unless changing
    const [profileImage, setProfileImage] = useState(null);
    const [currentImage, setCurrentImage] = useState("");

    // User Specific State
    const [name, setName] = useState("");
    const [role, setRole] = useState("User");

    // Dealer Specific State
    const [dealerName, setDealerName] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [stateLocation, setStateLocation] = useState("");
    const [pincode, setPincode] = useState("");
    const [country, setCountry] = useState("");

    // ISO codes for fetching subsequent dropdowns
    const [countryCode, setCountryCode] = useState("");
    const [stateCode, setStateCode] = useState("");

    // Computed lists for dropdowns
    const countries = Country.getAllCountries();
    const states = countryCode ? State.getStatesOfCountry(countryCode) : [];
    const cities = stateCode ? City.getCitiesOfState(countryCode, stateCode) : [];

    // Loading / Error states
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setInitialLoading(true);
            try {
                if (userType === "user") {
                    const res = await getUserById(userId);
                    if (res?.success && res.user) {
                        const u = res.user;
                        setName(u.name || "");
                        setEmail(u.email || "");
                        setPhone(u.phone || "");
                        setRole(u.role || "User");
                        setCurrentImage(u.profileImage || "");
                    } else {
                        toast.error(res?.message || "Failed to load user details");
                    }
                } else if (userType === "dealer") {
                    const res = await getDealerById(userId);
                    if (res?.success && res.dealer) {
                        const d = res.dealer;
                        setDealerName(d.dealerName || "");
                        setContactPerson(d.contactPerson || "");
                        setEmail(d.email || "");
                        setPhone(d.phone || "");
                        setAddress(d.address || "");
                        setCity(d.city || "");
                        setStateLocation(d.state || "");
                        setPincode(d.pincode || "");
                        setCountry(d.country || "");
                        setCurrentImage(d.profileImage || "");

                        // Attempt to reverse match Country/State codes for dropdowns
                        const matchedCountry = countries.find(c => c.name === d.country);
                        if (matchedCountry) {
                            setCountryCode(matchedCountry.isoCode);
                            const stList = State.getStatesOfCountry(matchedCountry.isoCode);
                            const matchedState = stList.find(s => s.name === d.state);
                            if (matchedState) {
                                setStateCode(matchedState.isoCode);
                            }
                        }
                    } else {
                        toast.error(res?.message || "Failed to load dealer details");
                    }
                }
            } catch (error) {
                toast.error("An error occurred while fetching details.");
            } finally {
                setInitialLoading(false);
            }
        };

        if (userId && userType) {
            fetchDetails();
        }
    }, [userId, userType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const toastId = toast.loading("Updating account...");

        try {
            let response;
            if (userType === "user") {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("email", email);
                formData.append("phone", phone);
                formData.append("role", role);
                if (password) formData.append("password", password); // Only send if changed
                if (profileImage) formData.append("profileImage", profileImage);

                response = await updateUser(userId, formData);
            } else {
                const formData = new FormData();
                formData.append("dealerName", dealerName);
                formData.append("contactPerson", contactPerson);
                formData.append("email", email);
                formData.append("phone", phone);
                formData.append("address", address);
                formData.append("city", city);
                formData.append("state", stateLocation);
                formData.append("pincode", pincode);
                formData.append("country", country);
                if (password) formData.append("password", password); // Only send if changed
                if (profileImage) formData.append("profileImage", profileImage);

                response = await updateDealer(userId, formData);
            }

            if (response?.success) {
                toast.success(`${userType === "user" ? "User" : "Dealer"} updated successfully!`, { id: toastId });
                if (goBack) goBack();
            } else {
                toast.error(response?.message || "Failed to update account. Please try again.", { id: toastId });
            }
        } catch (err) {
            toast.error("Something went wrong while updating.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19456d]"></div></div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#19456d] mb-2">Update Account</h2>
                    <p className="text-[#708ca4]">Modify the details of this {userType === 'user' ? 'User' : 'Dealer'}.</p>
                </div>
                <button onClick={goBack} type="button" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-200">
                    ← Back to List
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* ================= USER FORM ================= */}
                {userType === "user" && (
                    <div className="flex flex-col gap-5 bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                        <div className="mb-2 border-b border-[#708ca4]/20 pb-2">
                            <h3 className="text-lg font-bold text-[#52602d]">User Details</h3>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Full Name</label>
                            <input
                                type="text" required
                                value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#19456d] focus:ring-1 focus:ring-[#19456d] transition-all bg-white text-[#19456d] font-medium"
                                placeholder="Enter full name"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Email</label>
                            <input
                                type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#19456d] focus:ring-1 focus:ring-[#19456d] transition-all bg-white text-[#19456d] font-medium"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Phone</label>
                            <input
                                type="tel" required
                                value={phone} onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#19456d] focus:ring-1 focus:ring-[#19456d] transition-all bg-white text-[#19456d] font-medium"
                                placeholder="Phone number"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Password (Leave blank to keep current)</label>
                            <input
                                type="password" minLength={6}
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#19456d] focus:ring-1 focus:ring-[#19456d] transition-all bg-white text-[#19456d] font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Role</label>
                            <select
                                value={role} onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#19456d] focus:ring-1 focus:ring-[#19456d] transition-all bg-white text-[#19456d] font-medium"
                            >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>
                )}


                {/* ================= DEALER FORM ================= */}
                {userType === "dealer" && (
                    <div className="flex flex-col gap-5 bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                        <div className="mb-2 border-b border-[#708ca4]/20 pb-2">
                            <h3 className="text-lg font-bold text-[#b48001]">Dealer Information</h3>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Dealer Name</label>
                            <input
                                type="text" required
                                value={dealerName} onChange={(e) => setDealerName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001] transition-all bg-white text-[#19456d] font-medium"
                                placeholder="Dealership Name"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Contact Person</label>
                            <input
                                type="text" required
                                value={contactPerson} onChange={(e) => setContactPerson(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001] transition-all bg-white text-[#19456d] font-medium"
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Email</label>
                            <input
                                type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001] transition-all bg-white text-[#19456d] font-medium"
                                placeholder="dealer@example.com"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Phone</label>
                            <input
                                type="tel" required
                                value={phone} onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001] transition-all bg-white text-[#19456d] font-medium"
                                placeholder="Phone number"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Password (Leave blank to keep current)</label>
                            <input
                                type="password" minLength={6}
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001] transition-all bg-white text-[#19456d] font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="mt-4 mb-2 border-b border-[#708ca4]/20 pb-2">
                            <h3 className="text-lg font-bold text-[#b48001]">Address Details</h3>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Address</label>
                            <input
                                type="text" required
                                value={address} onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001] transition-all bg-white text-[#19456d] font-medium"
                                placeholder="Street Address"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Country</label>
                            <select
                                required
                                value={countryCode}
                                onChange={(e) => {
                                    setCountryCode(e.target.value);
                                    setCountry(e.target.options[e.target.selectedIndex].text);
                                    setStateCode("");
                                    setStateLocation("");
                                    setCity("");
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001] transition-all bg-white text-[#19456d] font-medium"
                            >
                                <option value="">Select Country</option>
                                {countries.map((c) => (
                                    <option key={c.isoCode} value={c.isoCode}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">State</label>
                            <select
                                required
                                value={stateCode}
                                onChange={(e) => {
                                    setStateCode(e.target.value);
                                    setStateLocation(e.target.options[e.target.selectedIndex].text);
                                    setCity("");
                                }}
                                disabled={!countryCode}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001] transition-all bg-white text-[#19456d] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">Select State</option>
                                {states.map((s) => (
                                    <option key={s.isoCode} value={s.isoCode}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">City</label>
                            <select
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                disabled={!stateCode}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001] transition-all bg-white text-[#19456d] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">Select City</option>
                                {cities.map((c) => (
                                    <option key={c.name} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Pincode</label>
                            <input
                                type="text" required
                                value={pincode} onChange={(e) => setPincode(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#b48001] focus:ring-1 focus:ring-[#b48001] transition-all bg-white text-[#19456d] font-medium"
                                placeholder="Pincode"
                            />
                        </div>


                    </div>
                )}

                {/* Profile Image (Common for both) */}
                <div className="bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm mt-6">
                    <div className="group">
                        <label className="block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2">Profile Image (Optional)</label>
                        {currentImage && (
                            <div className="mb-4">
                                <p className="text-sm text-[#708ca4] mb-2 font-medium">Current Image:</p>
                                <img src={currentImage} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-[#19456d]/20 shadow-sm" />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                        toast.error("Profile image size should be less than 5MB");
                                        setProfileImage(null);
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                        return;
                                    }
                                    setProfileImage(file);
                                }
                            }}
                            className={`w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:ring-1 transition-all bg-white text-[#19456d] font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#19456d]/10 file:text-[#19456d] hover:file:bg-[#19456d]/20 ${userType === 'user' ? 'focus:border-[#19456d] focus:ring-[#19456d]' : 'focus:border-[#b48001] focus:ring-[#b48001] file:bg-[#b48001]/10 file:text-[#b48001] hover:file:bg-[#b48001]/20'}`}
                        />
                        {profileImage && (
                            <p className="mt-2 text-sm text-[#52602d] font-medium">Selected new image: {profileImage.name}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center min-w-[200px] ${userType === "user"
                            ? "bg-[#19456d] hover:bg-[#113150]"
                            : "bg-[#b48001] hover:bg-[#8c6301]"
                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Updating...
                            </div>
                        ) : (
                            <span>Update {userType === "user" ? "User Account" : "Dealer Account"}</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateUser;
