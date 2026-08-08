import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { Zap } from "lucide-react";

interface LogoProps {
    className?: string;
    isDark?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", isDark = false }) => {
    return (
        <div className={`flex items-center gap-2.5 select-none ${className}`}>
            {/* High-Tech Vector Mark */}
            <div className="size-9 sm:size-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
                <Zap size={20} className="fill-white" />
            </div>

            {/* Brand Typography */}
            <div className="flex flex-col">
                <div className="flex items-center gap-1 leading-none">
                    <span className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Sen<span className="text-blue-600">Tech</span>
                    </span>
                    <span className="text-[11px] font-black px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 text-white tracking-widest uppercase shadow-2xs">
                        PLUS
                    </span>
                </div>
                <span className={`text-[9px] font-bold tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    High-Tech Dakar
                </span>
            </div>
        </div>
    );
};

export default Logo;
