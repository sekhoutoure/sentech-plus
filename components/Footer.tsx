'use client'
import Link from "next/link";
import { useSelector } from "react-redux";
import Logo from "@/components/Logo";
import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, MessageCircle } from "lucide-react";

const Footer: React.FC = () => {
    const siteSettings = useSelector((state: any) => state.siteSettings)

    const catalogLinks = [
        { text: "Smartphones", path: '/shop?search=Smartphones' },
        { text: "Ordinateurs", path: '/shop?search=Laptops' },
        { text: "Casques & Écouteurs", path: '/shop?search=Casques' },
        { text: "Montres connectées", path: '/shop?search=Montres' },
        { text: "Gaming", path: '/shop?search=Gaming' },
        { text: "Accessoires", path: '/shop?search=Accessoires' },
    ];

    const infoLinks = [
        { text: "À propos de SenTech Plus", path: '/about' },
        { text: "Livraison & Expédition", path: '/pricing' },
        { text: "Moyens de Paiement", path: '/pricing' },
        { text: "Politique de confidentialité", path: '/pricing' },
        { text: "Conditions générales", path: '/pricing' },
        { text: "Retours & Échanges sous 7j", path: '/pricing' },
    ];

    const supportLinks = [
        { text: "Centre d'aide & FAQ", path: '/pricing' },
        { text: "Assistance WhatsApp 24/7", path: 'https://wa.me/221770000000', external: true },
        { text: "Page de Contact", path: '/contact' },
        { text: "Suivi de commande", path: '/orders' },
    ];

    const paymentBadges = [
        { label: "Wave", emoji: "🌊" },
        { label: "Orange Money", emoji: "🟠" },
        { label: "Visa", emoji: "💳" },
        { label: "Mastercard", emoji: "💳" },
        { label: "Cash on Delivery", emoji: "📦" }
    ];

    const socialLinks = [
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: MessageCircle, href: "#", label: "WhatsApp" },
    ];

    return (
        <footer className="bg-[#071126] text-white border-t border-slate-800 pt-16 sm:pt-24 pb-8 overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
            
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
                
                {/* Top 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/10">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-block transition-transform hover:scale-[1.02] active:scale-95 duration-300">
                            <Logo isDark={true} />
                        </Link>
                        
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-normal [text-wrap:pretty]">
                            Votre boutique high-tech au Sénégal pour découvrir les meilleurs gadgets et accessoires technologiques.
                        </p>

                        <div className="space-y-3 pt-2 text-sm text-slate-300">
                            <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#1769FF]/20 group-hover:border-[#1769FF]/30 group-hover:text-[#1769FF] transition-colors">
                                    <Phone size={14} className="shrink-0" />
                                </div>
                                <span>{siteSettings?.phone || "+221 77 000 00 00"}</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#1769FF]/20 group-hover:border-[#1769FF]/30 group-hover:text-[#1769FF] transition-colors">
                                    <Mail size={14} className="shrink-0" />
                                </div>
                                <span>{siteSettings?.email || "contact@sentechplus.sn"}</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#1769FF]/20 group-hover:border-[#1769FF]/30 group-hover:text-[#1769FF] transition-colors">
                                    <MapPin size={14} className="shrink-0" />
                                </div>
                                <span>{siteSettings?.address || "Avenue Cheikh Anta Diop, Dakar, Sénégal"}</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-4">
                            {socialLinks.map((social, idx) => {
                                const Icon = social.icon;
                                return (
                                    <Link key={idx} href={social.href} aria-label={social.label} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all hover:scale-110 active:scale-95">
                                        <Icon size={18} />
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* COLONNE CATALOGUE */}
                    <div className="lg:col-span-2 space-y-6 lg:ml-auto">
                        <h3 className="text-sm font-black tracking-widest text-white uppercase">
                            Catalogue
                        </h3>
                        <ul className="space-y-3.5 text-sm">
                            {catalogLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.path}
                                        className="text-slate-400 hover:text-[#1769FF] transition-colors inline-block hover:translate-x-1 transform duration-200"
                                    >
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLONNE INFORMATIONS */}
                    <div className="lg:col-span-3 space-y-6 lg:ml-auto">
                        <h3 className="text-sm font-black tracking-widest text-white uppercase">
                            Informations
                        </h3>
                        <ul className="space-y-3.5 text-sm">
                            {infoLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.path}
                                        className="text-slate-400 hover:text-[#1769FF] transition-colors inline-block hover:translate-x-1 transform duration-200"
                                    >
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLONNE SUPPORT */}
                    <div className="lg:col-span-3 space-y-6 lg:ml-auto">
                        <h3 className="text-sm font-black tracking-widest text-white uppercase">
                            Support
                        </h3>
                        <ul className="space-y-3.5 text-sm">
                            {supportLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.path}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                        className="text-slate-400 hover:text-[#1769FF] transition-colors inline-flex items-center gap-2 hover:translate-x-1 transform duration-200"
                                    >
                                        {link.text}
                                        {link.external && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-sm">↗</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar: Copyright & Payment Methods */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
                    <p className="flex items-center gap-2">
                        © {new Date().getFullYear()} SenTech Plus.
                        <span className="hidden sm:inline">|</span> 
                        <span className="text-slate-400">Made in Sénégal 🇸🇳</span>
                    </p>

                    {/* Payment Chips */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {paymentBadges.map((badge, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors cursor-default"
                                title={badge.label}
                            >
                                <span>{badge.emoji}</span>
                                <span>{badge.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
