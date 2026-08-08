'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-slate-50">
            <div>
                <Banner />
                <Navbar />
                <main id="main-content">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}
