"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Form URL Encoded for OAuth2
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const res = await fetch("/api/v1/auth/login/access-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                let errorMessage = "Invalid credentials";
                try {
                    const data = JSON.parse(text);
                    errorMessage = data.detail || errorMessage;
                } catch {
                    errorMessage = text.slice(0, 100) || "Server Error (Non-JSON response)";
                }
                throw new Error(errorMessage);
            }

            const data = await res.json();
            localStorage.setItem("token", data.access_token);
            if (data.role) localStorage.setItem("role", data.role);
            router.push("/chat");
        } catch (err: any) {
            setError(err.message || "Access Denied: Invalid Certification Credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>

            <div className="w-full max-w-md p-8 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl relative z-10">
                <div className="mb-8 text-center">
                    <Shield className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white tracking-widest">SENTINEL ACCESS</h1>
                    <p className="text-slate-500 text-sm mt-2">Secure Gateway Login</p>
                </div>

                {registered && (
                    <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Clearance Granted. Please Authenticate.
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {/* 🔵 Google Sign In Button */}
                <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/chat" })}
                    className="w-full bg-gradient-to-r from-teal-400 to-cyan-500 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] text-slate-900 font-bold py-3.5 rounded transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="px-4 text-xs font-bold text-slate-500 tracking-widest uppercase">OR</span>
                    <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Service ID (Email)</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-3 focus:border-teal-500 outline-none transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Passcode</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-3 focus:border-teal-500 outline-none transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3.5 rounded mt-4 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Verifying..." : <><Lock className="w-4 h-4" /> Authenticate</>}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-600">
                    Unauthorized access is a punishable offense.
                    <br />
                    System monitored by AI Sentinel.
                </div>

                <div className="mt-6 text-center text-sm text-slate-500 border-t border-slate-800 pt-4">
                    New Personnel?{' '}
                    <Link href="/register" className="text-teal-400 hover:text-teal-300 font-bold transition-colors">
                        Register Clearance
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-teal-500">Initializing Secure Gateway...</div>}>
            <LoginForm />
        </Suspense>
    );
}
