"use client";

import { Activity, Shield, AlertTriangle, Map, Terminal, Users, Lock, ChevronRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from "framer-motion";

const data = [
    { name: '0600', ai_threats: 4, opsec_leaks: 1 },
    { name: '0700', ai_threats: 3, opsec_leaks: 2 },
    { name: '0800', ai_threats: 15, opsec_leaks: 5 }, // Spike
    { name: '0900', ai_threats: 8, opsec_leaks: 3 },
    { name: '1000', ai_threats: 5, opsec_leaks: 1 },
    { name: '1100', ai_threats: 2, opsec_leaks: 0 },
    { name: '1200', ai_threats: 9, opsec_leaks: 2 },
];

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-slate-950 p-6 font-mono text-slate-300 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>

            {/* Header */}
            <header className="flex justify-between items-end border-b border-slate-800 pb-6 mb-8 relative z-10">
                <div>
                    <div className="flex items-center gap-2 text-teal-500 mb-1">
                        <Shield className="w-5 h-5" />
                        <span className="tracking-widest text-xs">HQ COMMAND</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">SENTINEL NET</h1>
                </div>
                <div className="flex gap-8 text-xs">
                    <div className="text-right">
                        <div className="text-slate-500">SYSTEM STATUS</div>
                        <div className="text-emerald-400 font-bold flex items-center justify-end gap-2">
                            OPERATIONAL <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-slate-500">ACTIVE NODES</div>
                        <div className="text-white font-bold">1,204</div>
                    </div>
                    <div className="text-right">
                        <div className="text-slate-500">THREAT DEFCON</div>
                        <div className="text-yellow-400 font-bold">LEVEL 4</div>
                    </div>
                </div>
            </header>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">

                {/* Main Chart Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-teal-500/20 transition-colors">
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-teal-500"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-teal-500"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-teal-500"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-teal-500"></div>

                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-teal-400" /> Threat Intelligence Feed
                        </h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorOpsec" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="ai_threats" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorAI)" name="AI Manipulation" />
                                    <Area type="monotone" dataKey="opsec_leaks" stroke="#2dd4bf" strokeWidth={2} fillOpacity={1} fill="url(#colorOpsec)" name="OPSEC Leaks" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" /> ACTIVE ALERTS
                            </h3>
                            <div className="space-y-3">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded hover:bg-red-500/10 cursor-pointer transition">
                                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                                        <div>
                                            <div className="text-white text-sm font-bold">OPSEC Leak Detected</div>
                                            <div className="text-xs text-red-300/60">Unit Alpha-4 • Keyword "Coordinates" • 2m ago</div>
                                        </div>
                                        <button className="ml-auto text-xs bg-red-500/20 hover:bg-red-500/40 text-red-400 px-2 py-1 rounded">
                                            Block
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                                <Map className="w-4 h-4 text-blue-500" /> GEOLOCATION RISK MAP
                            </h3>
                            <div className="h-[200px] w-full bg-slate-800/50 rounded flex items-center justify-center relative overflow-hidden group">
                                {/* Placeholder for map */}
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                                <div className="relative z-10 grid grid-cols-3 gap-8">
                                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e] animate-pulse"></div>
                                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_#ef4444] animate-ping"></div>
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_10px_#eab308]"></div>
                                </div>
                                <div className="absolute bottom-2 right-2 text-[10px] text-slate-500">LIVE SATELLITE FEED // SIMULATED</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-emerald-500" /> SYSTEM LOGS
                        </h3>
                        <div className="h-[400px] overflow-hidden relative text-xs font-mono space-y-2 opacity-80">
                            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="flex gap-2 text-slate-500">
                                    <span className="text-slate-700">14:02:{10 + i}</span>
                                    <span className={i % 3 === 0 ? "text-teal-500" : i % 3 === 1 ? "text-purple-400" : "text-slate-400"}>
                                        {i % 3 === 0 ? "[SECURE] Handshake established id_99" + i :
                                            i % 3 === 1 ? "[ROTATION] Group Key #882 Updated" :
                                                "Scanning packet bundle..."}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-5 h-5 text-indigo-400" />
                            <h3 className="font-bold text-indigo-100">Team Status</h3>
                        </div>
                        <div className="text-sm text-indigo-200/60 mb-4">
                            3 Units Deployed
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs items-center">
                                <span className="text-indigo-300">Alpha</span>
                                <span className="text-emerald-400 bg-emerald-400/10 px-1.5 rounded">Active</span>
                            </div>
                            <div className="flex justify-between text-xs items-center">
                                <span className="text-indigo-300">Bravo</span>
                                <span className="text-yellow-400 bg-yellow-400/10 px-1.5 rounded">Standby</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
