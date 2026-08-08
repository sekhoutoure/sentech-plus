'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col justify-between">
            <div>
                <Banner />
                <Navbar />
                <main id="main-content" className="pb-16 sm:pb-0">
                    {children}
                </main>
            </div>
            <Footer />
            <MobileBottomNav />
        </div>
    );
}
