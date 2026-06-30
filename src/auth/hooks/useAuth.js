import {
    registerDealer,
    registerUser,
    loginUser,
    loginDealer,
    logoutUser as logoutUserApi,
    getUserDetails as getUserDetailsApi,
    updateDealer as updateDealerApi,
    updateDealerPassword as updateDealerPasswordApi,
} from "../Api/auth.api";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../../slices/userSlice";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.user);

    const registerNewUser = async (data) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await registerUser(data);
            if (response?.user || response?.dealer) {
                dispatch(setUser(response.user || response.dealer));
            }
            return response;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const registerNewDealer = async (data) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await registerDealer(data);
            if (response?.user || response?.dealer) {
                dispatch(setUser(response.user || response.dealer));
            }
            return response;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const loginExistingUser = async (data) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await loginUser(data);
            if (response?.user || response?.dealer) {
                dispatch(setUser(response.user || response.dealer));
            }
            return response;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const loginExistingDealer = async (data) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await loginDealer(data);
            if (response?.user || response?.dealer) {
                dispatch(setUser(response.user || response.dealer));
            }
            return response;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const logoutUser = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await logoutUserApi();
            dispatch(setUser(null));
            return response;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const getUserDetails = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await getUserDetailsApi();
            if (response?.user || response?.dealer || response?.Admin) {
                dispatch(setUser(response.user || response.dealer || response.Admin));
            } else {
                // Clear user if we fetch and get an error response (like unauthorized)
                dispatch(setUser(null));
            }
            return response;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updateDealerProfile = async (id, data) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await updateDealerApi(id, data);
            if (response?.dealer) {
                // Optionally update local store if the user is currently the updated dealer
                if (user?._id === id) {
                    dispatch(setUser(response.dealer));
                }
            }
            return response;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message));
            return { success: false, message: err.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updateDealerPassword = async (id, data) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await updateDealerPasswordApi(id, data);
            return response;
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message));
            return { success: false, message: err.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        registerNewUser,
        registerNewDealer,
        loginExistingUser,
        loginExistingDealer,
        logoutUser,
        getUserDetails,
        updateDealerProfile,
        updateDealerPassword,
        user,
        loading,
        error,
    };
};
