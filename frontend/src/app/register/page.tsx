"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, AlertTriangle, UserPlus, Fingerprint } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Security Protocol Violated: Passcodes Do Not Match");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    full_name: fullName
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                let errorMessage = "Registration Failed";
                try {
                    const data = JSON.parse(text);
                    errorMessage = data.detail || errorMessage;
                } catch {
                    errorMessage = text.slice(0, 100) || "Server Error (Non-JSON response)";
                }
                throw new Error(errorMessage);
            }

            // Redirect to login on success
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message || "Registration Denied: System Error");
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
                    <h1 className="text-2xl font-bold text-white tracking-widest">PERSONNEL REGISTRATION</h1>
                    <p className="text-slate-500 text-sm mt-2">Request Security Clearance</p>
                </div>

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

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                        <div className="relative">
                            <Fingerprint className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded pl-10 pr-4 py-3 focus:border-teal-500 outline-none transition-colors"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Officer Name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Service ID (Email)</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-3 focus:border-teal-500 outline-none transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="officer@sentinel.net"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-3 focus:border-teal-500 outline-none transition-colors"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3.5 rounded mt-4 transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                        {isLoading ? "Processing..." : <><UserPlus className="w-4 h-4" /> Grant Access</>}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Already have clearance?{' '}
                    <Link href="/login" className="text-teal-400 hover:text-teal-300 font-bold transition-colors">
                        Access Terminal
                    </Link>
                </div>
            </div>
        </div>
    );
}
