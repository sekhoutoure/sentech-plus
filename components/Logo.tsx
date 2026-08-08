import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";

interface LogoProps {
    className?: string;
    isDark?: boolean;
}

const Logo = ({ className = "", isDark = false }: LogoProps) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Image 
                src={assets.sentech_logo} 
                alt="SenTech Plus" 
                width={180} 
                height={50} 
                className={`h-9 sm:h-10 w-auto object-contain transition-transform hover:scale-105 ${
                    isDark ? 'brightness-0 invert' : 'mix-blend-multiply'
                }`} 
                priority 
            />
        </div>
    );
};

export default Logo;
