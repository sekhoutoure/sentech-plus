'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SidebarDock from "@/components/SidebarDock";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#F3F7FC] text-[#182230]">
            <div className="w-full">
                <Banner />
                <Navbar />
                {/* Safe padding-bottom for fixed mobile dock navigation bar */}
                <main id="main-content" className="w-full pb-[85px] lg:pb-0">
                    {children}
                </main>
            </div>
            <Footer />
            {/* Fixed Mobile Dock Navigation Bar */}
            <SidebarDock />
        </div>
    );
}
