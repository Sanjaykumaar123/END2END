"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";

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
