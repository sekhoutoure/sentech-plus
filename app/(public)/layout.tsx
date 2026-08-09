'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#FCFCFC] text-[#101828]">
            <div className="w-full">
                <Banner />
                <Navbar />
                <main id="main-content" className="w-full">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
