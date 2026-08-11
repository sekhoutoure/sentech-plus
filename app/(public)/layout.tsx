'use client'
import dynamic from "next/dynamic";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const SidebarDock = dynamic(() => import("@/components/SidebarDock"), { ssr: false });

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#F6F9FD] text-[#172033]">
            <div className="w-full">
                <Banner />
                <Navbar />
                {/* Safe padding-bottom for fixed mobile dock navigation bar */}
                <main id="main-content" className="w-full pb-[calc(90px+env(safe-area-inset-bottom))] lg:pb-0">
                    {children}
                </main>
            </div>
            <Footer />
            {/* Fixed Mobile Dock Navigation Bar */}
            <SidebarDock />
        </div>
    );
}
