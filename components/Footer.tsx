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
        { text: "Moyens de Paiement (Wave / OM)", path: '/pricing' },
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
        "Wave",
        "Orange Money",
        "Visa",
        "Mastercard",
        "Paiement à la Livraison"
    ];

    return (
        <footer className="bg-[#071126] text-white border-t border-slate-800 pt-16 sm:pt-20 pb-12">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                
                {/* Top 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-slate-800">
                    
                    {/* Brand Column (2 cols on lg) */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
                            <Logo isDark={true} />
                        </Link>
                        
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
                            Votre boutique high-tech au Sénégal pour découvrir les meilleurs gadgets et accessoires technologiques.
                        </p>

                        <div className="space-y-2 pt-1 text-xs text-slate-300">
                            <p className="flex items-center gap-2">
                                <Phone size={14} className="text-[#1769FF] shrink-0" />
                                <span>{siteSettings?.phone || "+221 77 000 00 00"}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail size={14} className="text-[#1769FF] shrink-0" />
                                <span>{siteSettings?.email || "contact@sentechplus.sn"}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <MapPin size={14} className="text-[#1769FF] shrink-0" />
                                <span>{siteSettings?.address || "Avenue Cheikh Anta Diop, Dakar, Sénégal"}</span>
                            </p>
                        </div>
                    </div>

                    {/* COLONNE CATALOGUE */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black tracking-wider text-white uppercase">
                            CATALOGUE
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            {catalogLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.path}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLONNE INFORMATIONS */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black tracking-wider text-white uppercase">
                            INFORMATIONS
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            {infoLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.path}
                                        className="text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLONNE SUPPORT */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black tracking-wider text-white uppercase">
                            SUPPORT
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            {supportLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.path}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                                    >
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar: Copyright & Payment Methods */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <p>
                        © 2026 SenTech Plus. Tous droits réservés.
                    </p>

                    {/* Payment Chips */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-400 mr-1">Paiements sécurisés :</span>
                        {paymentBadges.map((badge, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300"
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
