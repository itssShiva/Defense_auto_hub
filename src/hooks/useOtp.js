import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useOtp = () => {
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpSending, setOtpSending] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        let timer;
        if (resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendTimer]);

    const sendOtp = async (phone) => {
        if (!phone || phone.length !== 10) {
            toast.error("Please enter a valid 10-digit phone number");
            return false;
        }

        try {
            setOtpSending(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/otp/send-otp`, { phone });
            
            if (response.data.success) {
                toast.success("OTP sent successfully");
                setOtpSent(true);
                setResendTimer(60); // 60 seconds timer
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
            return false;
        } finally {
            setOtpSending(false);
        }
    };

    const resendOtp = async (phone) => {
        if (resendTimer > 0) return false;
        
        try {
            setOtpSending(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/otp/resend-otp`, { phone });
            
            if (response.data.success) {
                toast.success("OTP resent successfully");
                setResendTimer(60); // Reset timer
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
            return false;
        } finally {
            setOtpSending(false);
        }
    };

    const verifyOtp = async (phone, otp) => {
        if (!otp || otp.length < 4) {
            toast.error("Please enter a valid OTP");
            return false;
        }

        try {
            setOtpVerifying(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/otp/verify-otp`, { phone, otp });
            
            if (response.data.success) {
                toast.success("Phone number verified successfully");
                setOtpVerified(true);
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
            return false;
        } finally {
            setOtpVerifying(false);
        }
    };

    const resetOtpState = () => {
        setOtpSent(false);
        setOtpVerified(false);
        setOtpSending(false);
        setOtpVerifying(false);
        setResendTimer(0);
    };

    return {
        otpSent,
        otpVerified,
        otpSending,
        otpVerifying,
        resendTimer,
        sendOtp,
        resendOtp,
        verifyOtp,
        resetOtpState
    };
};
