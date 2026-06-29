import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();

    // ── Two-way bound state variables ──────────────────────────────────────────
    const [role, setRole] = useState('user');           // 'user' | 'dealer'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { loginExistingUser, loginExistingDealer } = useAuth();

    // ── Handlers ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = { email, password };
            const response = role === 'dealer'
                ? await loginExistingDealer(payload)
                : await loginExistingUser(payload);

            if (response?.success) {

                setError(response?.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafbf8] px-4 py-12">
            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

                {/* ── Header strip ──────────────────────────────────────────────────── */}
                <div className="bg-[#19456d] px-8 py-8 text-center relative overflow-hidden">
                    {/* Decorative circles */}
                    <span className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-[#b48001]/20 block" />
                    <span className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-[#708ca4]/30 block" />

                    <Link to="/" className="inline-block mb-4">
                        <h1 className="text-3xl font-extrabold tracking-wider text-white">
                            Fouji<span className="text-[#b48001]">Mart</span>
                        </h1>
                    </Link>
                    <p className="text-[#708ca4] text-sm font-medium">
                        Welcome back! Sign in to continue.
                    </p>
                </div>

                {/* ── Form body ─────────────────────────────────────────────────────── */}
                <div className="px-8 py-8">

                    {/* Role toggle */}
                    <div className="flex rounded-xl overflow-hidden border-2 border-[#19456d]/20 mb-7">
                        {['user', 'dealer'].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => { setRole(r); setError(''); }}
                                className={`flex-1 py-2.5 text-sm font-bold capitalize transition-all duration-300 ${role === r
                                    ? 'bg-[#19456d] text-white shadow-inner'
                                    : 'bg-transparent text-[#19456d] hover:bg-[#19456d]/10'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email field */}
                        <div className="group">
                            <label
                                htmlFor="email"
                                className="block text-xs font-bold text-[#52602d] uppercase tracking-widest mb-1.5"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#708ca4]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#708ca4]/40 bg-[#fafbf8] text-[#19456d] placeholder-[#708ca4]/60 text-sm font-medium focus:outline-none focus:border-[#19456d] focus:bg-white transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="group">
                            <label
                                htmlFor="password"
                                className="block text-xs font-bold text-[#52602d] uppercase tracking-widest mb-1.5"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#708ca4]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-[#708ca4]/40 bg-[#fafbf8] text-[#19456d] placeholder-[#708ca4]/60 text-sm font-medium focus:outline-none focus:border-[#19456d] focus:bg-white transition-all duration-200"
                                />
                                {/* Toggle show/hide */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#708ca4] hover:text-[#19456d] transition-colors duration-200"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password */}
                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-xs font-semibold text-[#b48001] hover:text-[#19456d] transition-colors duration-200 underline underline-offset-2"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full overflow-hidden py-3.5 rounded-xl font-bold text-white bg-[#19456d] group hover:shadow-[0_0_20px_rgba(25,69,109,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <span className="absolute inset-0 bg-[#b48001] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Signing in…
                                    </>
                                ) : (
                                    `Sign in as ${role === 'dealer' ? 'Dealer' : 'User'}`
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <span className="flex-1 h-px bg-[#708ca4]/30" />
                        <span className="text-xs text-[#708ca4] font-semibold">OR</span>
                        <span className="flex-1 h-px bg-[#708ca4]/30" />
                    </div>

                    {/* Register link */}
                    <p className="text-center text-sm text-[#52602d]">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-bold text-[#19456d] hover:text-[#b48001] transition-colors duration-200"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
