import Link from "next/link";
import { Shield, Lock, Eye, AlertTriangle, UserPlus, ChevronDown, Server, Fingerprint, Database, Cpu, Activity, CheckCircle, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 relative overflow-x-hidden bg-slate-950 text-white">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0 pointer-events-none"></div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none z-0"></div>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center w-full z-10 pt-20">
        <div className="absolute top-0 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12">
          <div className="fixed left-0 top-0 flex w-full justify-center border-b border-slate-800 bg-slate-950/50 backdrop-blur-2xl pb-6 pt-8 lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-slate-900/40 lg:p-4 z-50">
            <code className="text-teal-400 font-bold flex items-center gap-2">
              <Shield className="w-5 h-5" /> SENTINEL.NET // SECURE_PROTOCOL_V.1.0
            </code>
          </div>
          <div className="hidden lg:flex fixed bottom-0 left-0 h-48 w-full items-end justify-center bg-gradient-to-t from-slate-950 via-slate-950 dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <div className="flex gap-2 items-center text-slate-400">
              <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span>
              SYSTEM STATUS: OPERATIONAL
            </div>
          </div>
        </div>

        <div className="text-center space-y-6 max-w-2xl mt-10">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500 mb-4 drop-shadow-2xl">
            SENTINEL<span className="text-teal-500">NET</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
            AI-Defended Secure Communication & Threat Intelligence Platform.
            Protecting against <span className="text-rose-400">Deepfakes</span>, <span className="text-rose-400">Phishing</span>, and <span className="text-rose-400">OPSEC Leaks</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/login" className="group relative px-8 py-4 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/50 rounded-lg transition-all duration-300 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-teal-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative flex items-center gap-2 font-bold tracking-widest uppercase text-sm">
                <Lock className="w-4 h-4" /> Secure Login
              </span>
            </Link>

            <Link href="/register" className="group px-8 py-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg transition-all duration-300 backdrop-blur-sm">
              <span className="flex items-center gap-2 font-bold tracking-widest uppercase text-sm">
                <UserPlus className="w-4 h-4" /> Register Access
              </span>
            </Link>

            <Link href="/dashboard" className="group px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700 hover:border-slate-500 rounded-lg transition-all duration-300 backdrop-blur-sm">
              <span className="flex items-center gap-2 font-bold tracking-widest uppercase text-sm">
                <Eye className="w-4 h-4" /> HQ Command
              </span>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-6xl grid text-center md:grid-cols-3 md:text-left gap-6 mt-24">
          <Card
            title="E2E Encryption"
            desc="AES-256 + RSA-2048 encryption with forward secrecy per session."
            icon={<Lock className="w-8 h-8 text-teal-400 mb-4" />}
          />
          <Card
            title="AI Threat Scan"
            desc="Real-time detection of AI-generated content and social engineering attempts."
            icon={<Eye className="w-8 h-8 text-blue-400 mb-4" />}
          />
          <Card
            title="OPSEC Guardian"
            desc="Automated risk assessment for sensitive operational data leakage."
            icon={<AlertTriangle className="w-8 h-8 text-rose-400 mb-4" />}
          />
        </div>

        <div className="absolute bottom-4 animate-bounce text-slate-500 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-widest uppercase font-mono">Initiate Uplink</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* --- ARCHITECTURE SECTION --- */}
      <section className="relative w-full max-w-6xl py-32 z-10 border-t border-slate-800/50 mt-12">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-sm font-mono text-teal-500 tracking-widest mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> MILITARY-GRADE ARCHITECTURE
          </h2>
          <h3 className="text-4xl font-bold text-slate-200">Zero-Trust Infrastructure</h3>
          <p className="text-slate-400 max-w-2xl mt-4">
            SentinelNet operates on a strict zero-trust model. Every request is cryptographically verified, and all operational data is shredded post-session unless explicitly vaulted.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            title="Distributed Node Auth" 
            desc="Authentication payloads are split and verified across multiple independent geographic nodes."
            icon={<Server className="w-6 h-6 text-indigo-400" />}
          />
          <FeatureCard 
            title="Biometric Hashing" 
            desc="Client-side biometric hashes ensure only the physical operator can decrypt the payload."
            icon={<Fingerprint className="w-6 h-6 text-teal-400" />}
          />
          <FeatureCard 
            title="Ephemeral Storage" 
            desc="Data in transit is held in volatile memory and instantly overwritten upon delivery."
            icon={<Database className="w-6 h-6 text-purple-400" />}
          />
          <FeatureCard 
            title="Neural Threat Engine" 
            desc="On-device AI models pre-screen outgoing packets for OPSEC violations before transmission."
            icon={<Cpu className="w-6 h-6 text-rose-400" />}
          />
        </div>
      </section>

      {/* --- GLOBAL INTEL SECTION --- */}
      <section className="relative w-full py-24 z-10 bg-slate-900/40 border-y border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-sm font-mono text-rose-400 tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4" /> LIVE TELEMETRY
              </h2>
              <h3 className="text-4xl font-bold text-slate-200">Global Threat Intelligence</h3>
              <p className="text-slate-400">
                Our distributed network of sensors continuously analyzes intercepted phishing attempts, anomalous traffic patterns, and AI-generated social engineering to update the global blocklist in real-time.
              </p>
              
              <ul className="space-y-4 mt-8 font-mono text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span>Deepfake Signatures Updated: <strong className="text-white">v4.2.110</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span>OPSEC Heuristics: <strong className="text-white">Active</strong></span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span>Global Node Sync: <strong className="text-white">12ms latency</strong></span>
                </li>
              </ul>
            </div>
            
            <div className="flex-1 w-full grid grid-cols-2 gap-4">
               <StatBox label="Threats Mitigated" value="1.2M+" color="text-teal-400" />
               <StatBox label="Active Nodes" value="4,892" color="text-indigo-400" />
               <StatBox label="AI Inferences / sec" value="850k" color="text-purple-400" />
               <StatBox label="Uptime" value="99.999%" color="text-emerald-400" />
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA / FOOTER --- */}
      <footer className="relative w-full max-w-6xl py-12 z-10 mt-12 flex flex-col md:flex-row items-center justify-between border-t border-slate-800/50 text-slate-500 text-xs font-mono">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Shield className="w-4 h-4" />
          <span>&copy; {new Date().getFullYear()} SENTINEL.NET CORE SYSTEMS. ALL RIGHTS RESERVED.</span>
        </div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-teal-400 transition-colors">PROTOCOL DOCS</Link>
          <Link href="#" className="hover:text-teal-400 transition-colors">SYSTEM STATUS</Link>
          <Link href="#" className="hover:text-teal-400 transition-colors">PGP KEY</Link>
        </div>
      </footer>
    </main>
  );
}

// Sub-components

function Card({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="group rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-6 transition-all hover:border-teal-500/30 hover:bg-slate-800/80 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex flex-col items-center md:items-start relative z-10">
        {icon}
        <h2 className="mb-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-teal-200 transition-colors">
          {title}
        </h2>
        <p className="m-0 max-w-[30ch] text-sm opacity-60 text-slate-300">
          {desc}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-900/30 hover:bg-slate-900/80 transition-colors group">
      <div className="mb-4 p-3 bg-slate-950 rounded-lg inline-block border border-slate-800 group-hover:border-slate-600 transition-colors">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-slate-200 mb-2">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/50 flex flex-col items-center justify-center text-center">
      <span className={`text-3xl md:text-4xl font-black ${color} tracking-tighter mb-2`}>{value}</span>
      <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}
