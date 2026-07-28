'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap, Globe } from 'lucide-react';

export const AuthIllustration: React.FC = () => {
  return (
    <div className="relative hidden lg:flex flex-col justify-between h-full p-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Background Glowing Orbs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Section */}
      <div className="relative z-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" /> SenTech Plus Platform v2.0
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          La marketplace SaaS nouvelle génération au Sénégal & Afrique.
        </h2>
      </div>

      {/* Center Animated Graphic */}
      <div className="relative z-10 my-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Sécurité de Niveau Bancaire</h4>
                <p className="text-xs text-slate-300">NextAuth v5, Bcrypt Salt 12, Upstash Rate Limiting</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Performance Instantanée</h4>
                <p className="text-xs text-slate-300">Next.js 15 App Router, React 19 Streaming & Server Actions</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Globe className="h-4 w-4 text-emerald-400" /> Infrastructure multi-régions Vercel
        </span>
        <span>© 2026 SenTech Plus</span>
      </div>
    </div>
  );
};
