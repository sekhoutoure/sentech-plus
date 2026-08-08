import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";

interface LogoProps {
    className?: string;
    isDark?: boolean;
    variant?: "horizontal" | "square";
}

const Logo: React.FC<LogoProps> = ({ className = "", isDark = false, variant = "horizontal" }) => {
    return (
        <div className={`flex items-center select-none ${className}`}>
            <Image 
                src={assets.sentech_logo} 
                alt="SenTech PLUS" 
                width={220} 
                height={55} 
                className={`h-9 sm:h-10 w-auto object-contain transition-transform duration-200 hover:scale-105 ${
                    isDark ? 'drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)] brightness-110' : 'drop-shadow-xs'
                }`} 
                priority 
            />
        </div>
    );
};

export default Logo;
