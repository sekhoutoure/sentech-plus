'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SidebarDock from "@/components/SidebarDock";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FCFCFC] text-[#101828] lg:grid lg:grid-cols-[76px_1fr]">
            
            {/* Desktop Left Dock / Mobile Bottom Dock */}
            <SidebarDock />

            {/* Main Content Column */}
            <div className="flex flex-col justify-between min-w-0 pb-16 lg:pb-0">
                <div>
                    <Banner />
                    <Navbar />
                    <main id="main-content" className="min-h-[75vh]">
                        {children}
                    </main>
                </div>
                <Footer />
            </div>

        </div>
    );
}
