"use client";

import { useState, useEffect } from "react";
import { Activity, Shield, AlertTriangle, Map as MapIcon, Terminal, Users, Lock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import clsx from "clsx";

interface DashboardStats {
    system_status: string;
    active_nodes: number;
    defcon: number;
    active_threats: number;
    trend_data: { time: string; value: number }[];
    alerts: {
        id: string;
        title: string;
        risk: string;
        time: string;
        details: string;
    }[];
    logs: {
        time: string;
        type: string;
        message: string;
    }[];
    geo_risks: { lat: number; lng: number; risk: string }[];
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers: any = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;

            // Use relative path for Vercel/Local compatibility
            const res = await fetch("/api/v1/dashboard/stats", { headers });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) {
            console.error("Dashboard poll failed", e);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, []);

    if (!stats) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-teal-500 font-mono gap-4">
            <div className="w-16 h-16 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
            <div className="animate-pulse">ESTABLISHING SECURE UPLINK...</div>
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-950 p-6 font-mono text-slate-300 relative overflow-hidden">
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
                        <div className={clsx(
                            "font-bold flex items-center justify-end gap-2",
                            stats.system_status === "OPERATIONAL" ? "text-emerald-400" : "text-rose-400"
                        )}>
                            {stats.system_status}
                            <span className={clsx(
                                "w-2 h-2 rounded-full animate-pulse",
                                stats.system_status === "OPERATIONAL" ? "bg-emerald-500" : "bg-rose-500"
                            )}></span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-slate-500">ACTIVE NODES</div>
                        <div className="text-white font-bold">{stats.active_nodes.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-slate-500">THREAT DEFCON</div>
                        <div className={clsx(
                            "font-bold",
                            stats.defcon <= 2 ? "text-red-500 animate-pulse" :
                                stats.defcon === 3 ? "text-orange-400" : "text-yellow-400"
                        )}>LEVEL {stats.defcon}</div>
                    </div>
                </div>
            </header>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">

                {/* Main Chart Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-teal-500/20 transition-colors">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-teal-400" /> Threat Intelligence Feed
                        </h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.trend_data}>
                                    <defs>
                                        <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorThreat)" name="Threat Events" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Active Alerts */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" /> ACTIVE ALERTS
                            </h3>
                            <div className="space-y-3">
                                {stats.alerts.length === 0 && <div className="text-emerald-500/50 text-sm">No Active Threats Detected.</div>}
                                {stats.alerts.map((alert, i) => (
                                    <motion.div
                                        key={alert.id + i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded hover:bg-red-500/10 cursor-pointer transition"
                                    >
                                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                                        <div>
                                            <div className="text-white text-sm font-bold">{alert.title}</div>
                                            <div className="text-xs text-red-300/60">{alert.details}</div>
                                            <div className="text-[10px] text-slate-500 mt-1">{new Date(alert.time).toLocaleTimeString()}</div>
                                        </div>
                                        <div className="ml-auto flex gap-1">
                                            <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold">HIGH</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Geolocation Map */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                                <MapIcon className="w-4 h-4 text-blue-500" /> GEOLOCATION RISK MAP
                            </h3>
                            <div className="h-[200px] w-full bg-slate-800/50 rounded flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                                {/* Simulated Map Nodes */}
                                <div className="relative w-full h-full">
                                    {stats.geo_risks.map((pt, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_#ef4444] animate-ping"
                                            style={{
                                                top: `${((pt.lat % 7) + 3) * 10}%`,
                                                left: `${((pt.lng % 7) + 3) * 10}%`
                                            }}
                                        ></div>
                                    ))}
                                    {stats.geo_risks.length === 0 && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-emerald-500">
                                            GLOBAL THREAT LEVEL: MINIMAL
                                        </div>
                                    )}
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
                        {/* Scrollable container for logs */}
                        <div className="h-[400px] overflow-y-auto relative text-xs font-mono space-y-2 opacity-80 pr-2 custom-scrollbar">
                            {stats.logs.map((log, i) => (
                                <div key={i} className="flex gap-2 text-slate-500 animate-in fade-in slide-in-from-right-2 duration-300">
                                    <span className="text-slate-700 whitespace-nowrap">{log.time}</span>
                                    <span className={clsx(
                                        "break-all",
                                        log.type.includes("WARN") ? "text-red-400" :
                                            log.type.includes("SYS") ? "text-slate-400" : "text-teal-500"
                                    )}>
                                        {log.type} {log.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
