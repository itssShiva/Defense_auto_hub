import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getDealerLeads, deleteLead as deleteLeadApi, createLead as createLeadApi } from '../Api/leads.api';

export const useLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getDealerLeads();
            if (res.success) {
                setLeads(res.leads || []);
            } else {
                toast.error(res.message || "Failed to fetch leads");
            }
        } catch (error) {
            toast.error("Error fetching leads");
        } finally {
            setLoading(false);
        }
    }, []);

    const removeLead = async (id) => {
        try {
            const res = await deleteLeadApi(id);
            if (res.success) {
                toast.success("Lead deleted successfully");
                setLeads(prevLeads => prevLeads.filter(lead => lead._id !== id));
                return true;
            } else {
                toast.error(res.message || "Failed to delete lead");
                return false;
            }
        } catch (error) {
            toast.error("Error deleting lead");
            return false;
        }
    };

    const submitLead = async (formData) => {
        setLoading(true);
        try {
            const res = await createLeadApi(formData);
            if (res.success) {
                toast.success('Message sent successfully!');
                return res;
            } else {
                toast.error(res.message || 'Failed to send message.');
                return res;
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again later.');
            return { success: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        leads,
        loading,
        fetchLeads,
        removeLead,
        submitLead
    };
};
