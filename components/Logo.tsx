import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";

interface LogoProps {
    className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
    return (
        <div className={`flex items-center ${className}`}>
            <Image 
                src={assets.sentech_logo} 
                alt="SenTech Plus" 
                width={200} 
                height={55} 
                className="h-10 sm:h-11 w-auto object-contain mix-blend-multiply contrast-[1.2] drop-shadow-sm transition-transform hover:scale-105" 
                priority 
            />
        </div>
    );
};

export default Logo;
