import React, { useEffect, useState } from "react";
import { useLeads } from "../../leads/hooks/useLeads";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, Calendar, Trash2, X, MessageSquare, Car, Loader2, Building2 } from "lucide-react";
import { format } from "date-fns";

const LeadManage = () => {
    const { leads, loading, fetchLeads, removeLead } = useLeads();
    const [viewLead, setViewLead] = useState(null);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead?")) return;

        const success = await removeLead(id);
        if (success && viewLead && viewLead._id === id) {
            setViewLead(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-[#fafbf8]">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-[#19456d] mb-2 flex items-center gap-2">
                    <User className="w-8 h-8 text-[#b48001]" /> Manage Leads
                </h2>
                <p className="text-[#708ca4]">View and manage customer inquiries for your used vehicles.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 text-[#19456d] animate-spin" />
                </div>
            ) : leads.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[#708ca4]/15 shadow-sm">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-10 h-10 text-[#19456d]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#19456d] mb-2">No Leads Yet</h3>
                    <p className="text-[#708ca4] max-w-md mx-auto">
                        When customers are interested in your vehicles and fill out the contact form, their inquiries will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leads.map(lead => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={lead._id}
                            className="bg-white rounded-2xl border border-[#708ca4]/20 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                        >
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#19456d] line-clamp-1">{lead.name}</h3>
                                        <p className="text-xs text-[#708ca4] flex items-center gap-1 mt-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {format(new Date(lead.createdAt), 'MMM dd, yyyy - h:mm a')}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-50 text-[#19456d] text-[10px] font-extrabold uppercase tracking-wider rounded-full shrink-0">
                                        {lead.status}
                                    </span>
                                </div>

                                <div className="space-y-3 mt-2 bg-[#fafbf8] p-4 rounded-xl border border-[#708ca4]/10">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-[#b48001] shrink-0" />
                                        <span className="text-[#19456d] font-semibold">{lead.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4 text-[#b48001] shrink-0" />
                                        <span className="text-[#19456d] line-clamp-1">{lead.email}</span>
                                    </div>
                                    {lead.carId && (
                                        <div className="flex items-center gap-2 text-sm pt-2 border-t border-[#708ca4]/10">
                                            <Car className="w-4 h-4 text-[#b48001] shrink-0" />
                                            <span className="text-[#19456d] font-medium line-clamp-1">
                                                {lead.carId.brandName} {lead.carId.modelName}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5 flex gap-3">
                                    <button
                                        onClick={() => setViewLead(lead)}
                                        className="flex-1 py-2.5 bg-[#19456d] text-white font-bold text-sm rounded-xl hover:bg-[#b48001] transition-colors"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleDelete(lead._id)}
                                        className="w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                                        title="Delete Lead"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* View Details Modal */}
            <AnimatePresence>
                {viewLead && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
                        >
                            <div className="bg-linear-to-r from-[#19456d] to-[#1a3a5c] p-6 text-white relative">
                                <button
                                    onClick={() => setViewLead(null)}
                                    className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-extrabold">{viewLead.name}</h3>
                                        <p className="text-white/70 text-xs mt-1">
                                            Submitted on {format(new Date(viewLead.createdAt), 'MMMM dd, yyyy - h:mm a')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 space-y-8">
                                {/* Customer Info */}
                                <div>
                                    <h4 className="text-sm font-bold text-[#b48001] uppercase tracking-wider mb-4 border-b pb-2">Customer Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 p-4 bg-[#fafbf8] rounded-xl border border-[#708ca4]/15">
                                            <Phone className="w-5 h-5 text-[#b48001] mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold text-[#708ca4] uppercase tracking-wider">Phone</p>
                                                <p className="text-sm font-bold text-[#19456d]">{viewLead.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 bg-[#fafbf8] rounded-xl border border-[#708ca4]/15">
                                            <Mail className="w-5 h-5 text-[#b48001] mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold text-[#708ca4] uppercase tracking-wider">Email</p>
                                                <p className="text-sm font-bold text-[#19456d] break-all">{viewLead.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Inquiry Details */}
                                <div>
                                    <h4 className="text-sm font-bold text-[#b48001] uppercase tracking-wider mb-4 border-b pb-2">Inquiry Details</h4>
                                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 mb-4">
                                        <p className="text-[10px] font-bold text-[#708ca4] uppercase tracking-wider mb-1">Reason for Contact</p>
                                        <p className="text-base font-semibold text-[#19456d]">
                                            {viewLead.reason || "No specific reason provided"}
                                        </p>
                                    </div>

                                    {viewLead.carId ? (
                                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#708ca4]/20 shadow-sm">
                                            {viewLead.carId.carImages?.[0] ? (
                                                <img src={viewLead.carId.carImages[0]} alt="Car" className="w-20 h-14 object-cover rounded-lg" />
                                            ) : (
                                                <div className="w-20 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Car className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-[10px] font-bold text-[#708ca4] uppercase tracking-wider">Vehicle of Interest</p>
                                                <p className="text-sm font-bold text-[#19456d]">
                                                    {viewLead.carId.brandName} {viewLead.carId.modelName} ({viewLead.carId.year})
                                                </p>
                                                <p className="text-xs font-bold text-[#b48001] mt-0.5">
                                                    ₹{viewLead.carId.ExShowroomPrice?.toLocaleString('en-IN') || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">Vehicle information not available</p>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4 border-t gap-3">
                                    <button
                                        onClick={() => handleDelete(viewLead._id)}
                                        className="px-6 py-3 bg-white border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors"
                                    >
                                        Delete Lead
                                    </button>
                                    <button
                                        onClick={() => setViewLead(null)}
                                        className="px-8 py-3 bg-[#19456d] text-white font-bold rounded-xl hover:bg-[#b48001] transition-colors shadow-md"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LeadManage;
