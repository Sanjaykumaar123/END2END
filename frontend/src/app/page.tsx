import Link from "next/link";
import { Shield, Lock, Eye, AlertTriangle, UserPlus } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-950 text-white">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none z-0"></div>

      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-slate-800 bg-slate-950/50 backdrop-blur-2xl pb-6 pt-8 lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-slate-900/40 lg:p-4">
          <code className="text-teal-400 font-bold flex items-center gap-2">
            <Shield className="w-5 h-5" /> SENTINEL.NET // SECURE_PROTOCOL_V.1.0
          </code>
        </div>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-slate-950 via-slate-950 dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="flex gap-2 items-center text-slate-400">
            <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span>
            SYSTEM STATUS: OPERATIONAL
          </div>
        </div>
      </div>

      <div className="relative flex place-items-center z-10">
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500 mb-4 drop-shadow-2xl">
            SENTINEL<span className="text-teal-500">NET</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
            AI-Defended Secure Communication & Threat Intelligence Platform.
            Protecting against <span className="text-rose-400">Deepfakes</span>, <span className="text-rose-400">Phishing</span>, and <span className="text-rose-400">OPSEC Leaks</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/login" className="group relative px-8 py-4 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/50 rounded-lg transition-all duration-300 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-teal-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative flex items-center gap-2 font-bold tracking-widest uppercase">
                <Lock className="w-4 h-4" /> Secure Login
              </span>
            </Link>

            <Link href="/register" className="group px-8 py-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg transition-all duration-300 backdrop-blur-sm">
              <span className="flex items-center gap-2 font-bold tracking-widest uppercase">
                <UserPlus className="w-4 h-4" /> Register Access
              </span>
            </Link>

            <Link href="/dashboard" className="group px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700 hover:border-slate-500 rounded-lg transition-all duration-300 backdrop-blur-sm">
              <span className="flex items-center gap-2 font-bold tracking-widest uppercase">
                <Eye className="w-4 h-4" /> HQ Command
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-6 mt-20 z-10">
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
    </main>
  );
}

function Card({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="group rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-6 transition-all hover:border-teal-500/30 hover:bg-slate-800/80 backdrop-blur-sm">
      <div className="flex flex-col items-center lg:items-start">
        {icon}
        <h2 className={`mb-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-teal-200 transition-colors`}>
          {title}
        </h2>
        <p className={`m-0 max-w-[30ch] text-sm opacity-60 text-slate-300`}>
          {desc}
        </p>
      </div>
    </div>
  );
}
