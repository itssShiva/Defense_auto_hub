import React, { useState, useRef } from "react";
import { Country, State, City } from "country-state-city";
import { registerUser, registerDealer } from "../../auth/Api/auth.api";
import { toast } from "react-hot-toast";
import { useBrand } from "../../brand/hooks/useBrand";

const INITIAL_USER = { name: "", email: "", phone: "", role: "User", password: "" };
const INITIAL_DEALER = { dealerName: "", contactPerson: "", email: "", phone: "", password: "", address: "", pincode: "" };

const AddUsers = () => {
    const fileInputRef = useRef(null);

    // Form type toggle
    const [accountType, setAccountType] = useState("user");

    // States
    const [userForm, setUserForm] = useState(INITIAL_USER);
    const [dealerForm, setDealerForm] = useState(INITIAL_DEALER);
    const [brandsHandled, setBrandsHandled] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Dealer location dropdowns
    const [countryCode, setCountryCode] = useState("");
    const [stateCode, setStateCode] = useState("");
    const [city, setCity] = useState("");

    const { getAllBrands } = useBrand();
    const [brands, setBrands] = useState([]);

    React.useEffect(() => {
        const fetchBrands = async () => {
            const res = await getAllBrands();
            if (res?.success) setBrands(res.brands || []);
        };
        fetchBrands();
    }, [getAllBrands]);

    const countries = Country.getAllCountries();
    const states = countryCode ? State.getStatesOfCountry(countryCode) : [];
    const cities = stateCode ? City.getCitiesOfState(countryCode, stateCode) : [];

    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!ALLOWED.includes(file.type)) {
            toast.error(`Unsupported file type: .${file.name.split('.').pop().toUpperCase()}. Only JPEG, PNG and WEBP are allowed.`);
            e.target.value = "";
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Profile image must be less than 2 MB.");
            e.target.value = "";
            return;
        }
        setProfileImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleUserChange = (e) => setUserForm({ ...userForm, [e.target.name]: e.target.value });
    const handleDealerChange = (e) => setDealerForm({ ...dealerForm, [e.target.name]: e.target.value });

    const handleReset = () => {
        setUserForm(INITIAL_USER);
        setDealerForm(INITIAL_DEALER);
        setProfileImage(null);
        setImagePreview(null);
        setCountryCode("");
        setStateCode("");
        setCity("");
        setBrandsHandled([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const toastId = toast.loading(`Creating ${accountType} account...`);

        try {
            let res;
            if (accountType === "user") {
                if (!userForm.name || !userForm.email || !userForm.phone || !userForm.password) {
                    toast.error("Please fill all required fields.", { id: toastId });
                    setLoading(false);
                    return;
                }
                const fd = new FormData();
                Object.entries(userForm).forEach(([k, v]) => fd.append(k, v));
                if (profileImage) fd.append("profileImage", profileImage);
                res = await registerUser(fd);
            } else {
                if (!dealerForm.dealerName || !dealerForm.contactPerson || !dealerForm.email || !dealerForm.phone || !dealerForm.password || !countryCode || !stateCode || !city || !dealerForm.address || !dealerForm.pincode) {
                    toast.error("Please fill all required fields.", { id: toastId });
                    setLoading(false);
                    return;
                }
                const fd = new FormData();
                Object.entries(dealerForm).forEach(([k, v]) => fd.append(k, v));
                fd.append("country", Country.getCountryByCode(countryCode)?.name || "");
                fd.append("state", State.getStateByCodeAndCountry(stateCode, countryCode)?.name || "");
                fd.append("city", city);
                fd.append("brandsHandled", JSON.stringify(brandsHandled));
                if (profileImage) fd.append("profileImage", profileImage);
                res = await registerDealer(fd);
            }

            if (res?.success) {
                toast.success(`${accountType === 'user' ? 'User' : 'Dealer'} account created successfully!`, { id: toastId });
                handleReset();
            } else {
                toast.error(res?.message || "Failed to create account.", { id: toastId });
            }
        } catch (error) {
            toast.error("An unexpected error occurred.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 focus:outline-none focus:border-[#19456d] focus:ring-1 focus:ring-[#19456d] transition-all bg-white text-[#19456d] font-medium";
    const labelCls = "block text-xs font-bold text-[#708ca4] uppercase tracking-widest mb-2";

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-[#19456d] mb-2">Create New Account</h2>
                <p className="text-[#708ca4]">Add a new user or dealer to the system.</p>
            </div>

            {/* Account Type Toggle */}
            <div className="flex gap-4 mb-8 bg-[#fafbf8] p-2 rounded-xl border border-[#708ca4]/20 ">
                <button
                    type="button"
                    onClick={() => { setAccountType("user"); handleReset(); }}
                    className={`px-6 py-2.5 rounded-lg font-bold transition-all ${accountType === "user" ? "bg-[#19456d] text-white shadow-md" : "text-[#708ca4] hover:bg-[#708ca4]/10"}`}
                >
                    👤 User Account
                </button>
                <button
                    type="button"
                    onClick={() => { setAccountType("dealer"); handleReset(); }}
                    className={`px-6 py-2.5 rounded-lg font-bold transition-all ${accountType === "dealer" ? "bg-[#b48001] text-white shadow-md" : "text-[#708ca4] hover:bg-[#708ca4]/10"}`}
                >
                    🏪 Dealer Account
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* ═══ USER DETAILS FORM ═══ */}
                {accountType === "user" && (
                    <div className="flex flex-col gap-5 bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                        <div className="mb-2 border-b border-[#708ca4]/20 pb-2">
                            <h3 className="text-lg font-bold text-[#19456d]">User Details</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                                <input type="text" name="name" required value={userForm.name} onChange={handleUserChange} className={inputCls} placeholder="Enter full name" />
                            </div>
                            <div>
                                <label className={labelCls}>Email <span className="text-red-500">*</span></label>
                                <input type="email" name="email" required value={userForm.email} onChange={handleUserChange} className={inputCls} placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className={labelCls}>Phone <span className="text-red-500">*</span></label>
                                <input type="tel" name="phone" required value={userForm.phone} onChange={handleUserChange} className={inputCls} placeholder="Phone number" />
                            </div>
                            <div>
                                <label className={labelCls}>Password <span className="text-red-500">*</span></label>
                                <input type="password" name="password" required value={userForm.password} onChange={handleUserChange} className={inputCls} placeholder="Create a password" />
                            </div>
                            <div>
                                <label className={labelCls}>Role <span className="text-red-500">*</span></label>
                                <select name="role" required value={userForm.role} onChange={handleUserChange} className={inputCls}>
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ DEALER DETAILS FORM ═══ */}
                {accountType === "dealer" && (
                    <div className="flex flex-col gap-5 bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                        <div className="mb-2 border-b border-[#708ca4]/20 pb-2">
                            <h3 className="text-lg font-bold text-[#19456d]">Dealer Details</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
                            <div><label className={labelCls}>Dealership Name <span className="text-red-500">*</span></label><input type="text" name="dealerName" required value={dealerForm.dealerName} onChange={handleDealerChange} className={inputCls} placeholder="Dealership name" /></div>
                            <div><label className={labelCls}>Contact Person <span className="text-red-500">*</span></label><input type="text" name="contactPerson" required value={dealerForm.contactPerson} onChange={handleDealerChange} className={inputCls} placeholder="Manager / Owner name" /></div>
                            <div><label className={labelCls}>Email <span className="text-red-500">*</span></label><input type="email" name="email" required value={dealerForm.email} onChange={handleDealerChange} className={inputCls} placeholder="Dealership email" /></div>
                            <div><label className={labelCls}>Phone <span className="text-red-500">*</span></label><input type="tel" name="phone" required value={dealerForm.phone} onChange={handleDealerChange} className={inputCls} placeholder="Dealership phone" /></div>
                            <div><label className={labelCls}>Password <span className="text-red-500">*</span></label><input type="password" name="password" required value={dealerForm.password} onChange={handleDealerChange} className={inputCls} placeholder="Create a password" /></div>
                        </div>

                        <div className="mb-4">
                            <label className={labelCls}>Brands Handled</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                                {brands?.map(b => (
                                    <label key={b._id} className="flex items-center gap-2 text-sm font-medium text-[#19456d] cursor-pointer">
                                        <input
                                            type="checkbox"
                                            value={b._id}
                                            checked={brandsHandled.includes(b._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) setBrandsHandled([...brandsHandled, b._id]);
                                                else setBrandsHandled(brandsHandled.filter(id => id !== b._id));
                                            }}
                                            className="w-4 h-4 text-[#b48001] rounded border-[#708ca4]/40 focus:ring-[#b48001]"
                                        />
                                        {b.brandName}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-2 border-b border-[#708ca4]/20 pb-2 mt-4">
                            <h3 className="text-base font-bold text-[#19456d]">Location & Address</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div>
                                <label className={labelCls}>Country <span className="text-red-500">*</span></label>
                                <select required value={countryCode} onChange={(e) => { setCountryCode(e.target.value); setStateCode(""); setCity(""); }} className={inputCls}>
                                    <option value="">Select Country</option>
                                    {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>State <span className="text-red-500">*</span></label>
                                <select required disabled={!countryCode} value={stateCode} onChange={(e) => { setStateCode(e.target.value); setCity(""); }} className={inputCls}>
                                    <option value="">Select State</option>
                                    {states.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>City <span className="text-red-500">*</span></label>
                                <select required disabled={!stateCode} value={city} onChange={(e) => setCity(e.target.value)} className={inputCls}>
                                    <option value="">Select City</option>
                                    {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-2">
                            <div className="sm:col-span-2">
                                <label className={labelCls}>Address <span className="text-red-500">*</span></label>
                                <input type="text" name="address" required value={dealerForm.address} onChange={handleDealerChange} className={inputCls} placeholder="Street address" />
                            </div>
                            <div>
                                <label className={labelCls}>Pincode <span className="text-red-500">*</span></label>
                                <input type="text" name="pincode" required value={dealerForm.pincode} onChange={handleDealerChange} className={inputCls} placeholder="ZIP / Pincode" />
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ PROFILE IMAGE (Common) ═══ */}
                <div className="flex flex-col gap-5 bg-[#fafbf8] p-6 sm:p-8 rounded-2xl border border-[#708ca4]/20 shadow-sm">
                    <div className="mb-2 border-b border-[#708ca4]/20 pb-2 flex items-center gap-2">
                        <span className="text-lg">🖼️</span>
                        <h3 className="text-base font-bold text-[#19456d]">Profile Image (Optional)</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                        <div className={`shrink-0 w-32 h-32 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all ${imagePreview ? "border-[#19456d]" : "border-[#708ca4]/30 bg-white"}`}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl text-[#708ca4]">👤</span>
                            )}
                        </div>
                        <div className="flex-1 space-y-3 w-full">
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="w-full px-4 py-3 rounded-xl border border-[#708ca4]/40 bg-white text-[#19456d] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#19456d]/10 file:text-[#19456d] hover:file:bg-[#19456d]/20 cursor-pointer focus:outline-none"
                            />
                            {profileImage && (
                                <button type="button" onClick={() => { setProfileImage(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="text-red-500 hover:text-red-700 font-bold text-xs">
                                    ✕ Remove Image
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══ ACTIONS ═══ */}
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={handleReset} className="px-6 py-3 rounded-xl font-bold border-2 border-[#708ca4]/40 text-[#708ca4] hover:border-[#19456d] hover:text-[#19456d] transition-all">
                        Clear
                    </button>
                    <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl font-bold text-white bg-[#19456d] hover:bg-[#113150] shadow-lg transition-all min-w-[200px] disabled:opacity-70">
                        {loading ? "Saving..." : `Create ${accountType === 'user' ? 'User' : 'Dealer'}`}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUsers;