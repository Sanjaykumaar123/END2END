"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, AlertTriangle, UserPlus, Fingerprint } from "lucide-react";
import Link from "next/link";

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
                let errorMessage = "Registration Failed";
                try {
                    const data = await res.json();
                    errorMessage = data.detail || errorMessage;
                } catch {
                    // If JSON parse fails, it might be an HTML error page from Vercel
                    const text = await res.text();
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
