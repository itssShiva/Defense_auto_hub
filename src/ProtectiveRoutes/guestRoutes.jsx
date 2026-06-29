import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * GuestRoute — only allows unauthenticated users (guests).
 * - While auth is still loading (initial getUserDetails call), shows a spinner.
 * - If logged in, redirects them away from login/register pages.
 *   - Dealer -> /dealer-dashboard
 *   - Admin -> /admin-dashboard
 *   - User -> /
 */
const GuestRoute = ({ children }) => {
    const { user, loading } = useSelector((state) => state.user);

    // Still fetching user details on first load
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafbf8]">
                <div className="flex flex-col items-center gap-4">
                    <svg
                        className="w-10 h-10 animate-spin text-[#19456d]"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    <p className="text-[#52602d] font-semibold text-sm tracking-wide">
                        Loading…
                    </p>
                </div>
            </div>
        );
    }

    // Authenticated -> redirect away from login/register
    if (user) {
        if (user.role === 'dealer') {
            return <Navigate to="/dealer-dashboard" replace />;
        } else if (user.role === 'Admin') {
            return <Navigate to="/admin-dashboard" replace />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    // Guest — render login/register page
    return children ? children : <Outlet />;
};

export default GuestRoute;
