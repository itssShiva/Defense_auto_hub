import React, { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "../../auth/Api/auth.api";
import { toast } from "react-hot-toast";

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0">
        <span className="text-xs font-bold text-[#708ca4] uppercase tracking-wider w-28 shrink-0">{label}</span>
        <span className="text-sm text-[#19456d] font-medium text-right break-all">{value || "—"}</span>
    </div>
);

const UserModal = ({ user, onClose }) => {
    if (!user) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-linear-to-r from-[#19456d] to-[#2a6094] px-6 py-5 flex items-center gap-4">
                    <img
                        src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=19456d&color=fff&size=80`}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow"
                    />
                    <div>
                        <h3 className="text-xl font-extrabold text-white">{user.name}</h3>
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#b48001] text-white text-xs font-bold rounded-full">{user.role}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-auto w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-full text-lg font-bold transition"
                    >✕</button>
                </div>
                {/* Body */}
                <div className="px-6 py-4">
                    <DetailRow label="Email" value={user.email} />
                    <DetailRow label="Phone" value={user.phone} />
                    <DetailRow label="Role" value={user.role} />
                    <DetailRow label="User ID" value={user._id} />
                </div>
            </div>
        </div>
    );
};

const AllUsers = ({ handleEditClick }) => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        const res = await getAllUsers();
        if (res?.success) {
            setUsers(res.users);
        } else {
            toast.error(res?.message || "Failed to fetch users");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="font-semibold text-gray-800">Are you sure you want to delete this user?</p>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const toastId = toast.loading("Deleting user...");
                            const res = await deleteUser(id);
                            if (res?.success) {
                                toast.success("User deleted successfully!", { id: toastId });
                                setUsers((prev) => prev.filter((u) => u._id !== id));
                            } else {
                                toast.error(res?.message || "Failed to delete user", { id: toastId });
                            }
                        }}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg"
                    >Delete</button>
                    <button onClick={() => toast.dismiss(t.id)} className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg">Cancel</button>
                </div>
            </div>
        ), { duration: Infinity });
    };

    const filtered = users.filter((u) =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#19456d]">All Users</h2>
                    <p className="text-[#708ca4] text-sm mt-1">{users.length} registered user{users.length !== 1 ? "s" : ""}</p>
                </div>
                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#708ca4]">🔍</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#708ca4]/30 bg-[#fafbf8] focus:outline-none focus:ring-2 focus:ring-[#19456d]/30 focus:border-[#19456d] text-sm text-[#19456d] transition"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#19456d]"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-[#708ca4]">
                        <p className="text-4xl mb-3">👥</p>
                        <p className="font-semibold">{searchQuery ? "No users match your search." : "No users found."}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((user) => (
                                    <tr key={user._id} className="hover:bg-[#fafbf8] transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=19456d&color=fff&size=80`}
                                                    alt={user.name}
                                                    className="h-9 w-9 rounded-full object-cover border border-gray-200"
                                                />
                                                <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${user.role === "Admin" ? "bg-[#19456d]/10 text-[#19456d]" : "bg-gray-100 text-gray-600"}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(user._id, "user")}
                                                    className="px-3 py-1.5 bg-[#19456d]/10 hover:bg-[#19456d]/20 text-[#19456d] text-xs font-bold rounded-lg transition"
                                                >✏️ Edit</button>
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="px-3 py-1.5 bg-[#b48001]/10 hover:bg-[#b48001]/20 text-[#b48001] text-xs font-bold rounded-lg transition"
                                                >👁 View</button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition"
                                                >🗑 Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        </div>
    );
};

export default AllUsers;
