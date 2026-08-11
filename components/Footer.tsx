'use client'
import Link from "next/link";
import { useSiteSettingsStore } from '@/lib/stores';
import Logo from "@/components/Logo";
import React, { useState } from "react";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, MessageCircle, ChevronDown } from "lucide-react";

const Footer: React.FC = () => {
    const siteSettings = useSiteSettingsStore()

    // Accordion state for mobile (open by default on desktop)
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        catalogue: false,
        informations: false,
        support: false,
    })

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    const catalogLinks = [
        { text: "Smartphones", path: '/shop?search=Smartphones' },
        { text: "Ordinateurs & Laptops", path: '/shop?search=Laptops' },
        { text: "Casques & Écouteurs", path: '/shop?search=Casques' },
        { text: "Montres connectées", path: '/shop?search=Montres' },
        { text: "Gaming", path: '/shop?search=Gaming' },
        { text: "Accessoires", path: '/shop?search=Accessoires' },
    ]

    const infoLinks = [
        { text: "À propos de SenTech Plus", path: '/about' },
        { text: "Livraison & Expédition", path: '/pricing' },
        { text: "Wave & Orange Money", path: '/pricing' },
        { text: "Confidentialité", path: '/pricing' },
        { text: "Conditions générales", path: '/pricing' },
        { text: "Retours sous 7 jours", path: '/pricing' },
    ]

    const supportLinks = [
        { text: "Centre d'aide & FAQ", path: '/pricing' },
        { text: "WhatsApp 24/7", path: 'https://wa.me/221770000000', external: true },
        { text: "Contact", path: '/contact' },
        { text: "Suivi de commande", path: '/orders' },
    ]

    const socialLinks = [
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter / X" },
        { icon: MessageCircle, href: "https://wa.me/221770000000", label: "WhatsApp", external: true },
    ]

    const paymentBadges = [
        { icon: "🌊", label: "Wave" },
        { icon: "🟠", label: "Orange Money" },
        { icon: "💳", label: "Visa" },
        { icon: "💳", label: "Mastercard" },
        { icon: "💵", label: "Cash à la livraison" },
    ]

    return (
        <footer className="bg-[#F6F9FD] text-[#172033] border-t border-[#E1E8F0]">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-10 lg:gap-12 py-6 sm:py-12 lg:py-16 border-b border-[#E1E8F0]">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                        <Link href="/" className="inline-block">
                            <Logo isDark={false} />
                        </Link>

                        <p className="text-[#667085] text-xs sm:text-sm leading-relaxed max-w-xs font-normal">
                            La technologie qui simplifie votre quotidien. La boutique high-tech de référence au Sénégal.
                        </p>

                        <div className="space-y-2 text-xs sm:text-sm text-[#667085]">
                            <a href="tel:+221770000000" className="flex items-center gap-2 hover:text-[#1677FF] transition-colors">
                                <Phone size={14} className="text-[#1677FF] shrink-0" />
                                <span>{siteSettings?.phone && !siteSettings.phone.includes('+1-212') ? siteSettings.phone : "+221 77 000 00 00"}</span>
                            </a>
                            <a href="mailto:contact@sentechplus.sn" className="flex items-center gap-2 hover:text-[#1677FF] transition-colors">
                                <Mail size={14} className="text-[#1677FF] shrink-0" />
                                <span>{siteSettings?.email && !siteSettings.email.includes('sentechplus.com') ? siteSettings.email : "contact@sentechplus.sn"}</span>
                            </a>
                            <p className="flex items-start gap-2">
                                <MapPin size={14} className="text-[#1677FF] mt-0.5 shrink-0" />
                                <span>{siteSettings?.address && !siteSettings.address.includes('Francisco') ? siteSettings.address : "Avenue Cheikh Anta Diop, Dakar, Sénégal"}</span>
                            </p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-2 pt-1">
                            {socialLinks.map((social, i) => {
                                const Icon = social.icon
                                return (
                                    <a
                                        key={i}
                                        href={social.href}
                                        target={social.external ? "_blank" : undefined}
                                        rel={social.external ? "noopener noreferrer" : undefined}
                                        aria-label={social.label}
                                        className="size-8 rounded-xl bg-white hover:bg-[#1677FF] border border-[#E1E8F0] flex items-center justify-center text-[#667085] hover:text-white transition-all shadow-2xs"
                                    >
                                        <Icon size={14} />
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Catalogue */}
                    <div className="border-b border-[#E1E8F0] lg:border-none pb-3 lg:pb-0">
                        <button
                            onClick={() => toggleSection('catalogue')}
                            className="w-full flex items-center justify-between text-left lg:pointer-events-none"
                        >
                            <h3 className="text-xs font-bold tracking-widest text-[#172033] uppercase">CATALOGUE</h3>
                            <ChevronDown size={16} className={`text-[#667085] lg:hidden transition-transform duration-200 ${openSections.catalogue ? 'rotate-180' : ''}`} />
                        </button>
                        <ul className={`mt-2.5 lg:mt-3 space-y-2 text-xs sm:text-sm lg:block ${openSections.catalogue ? 'block' : 'hidden'}`}>
                            {catalogLinks.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.path} className="text-[#667085] hover:text-[#1677FF] transition-colors block py-0.5 font-normal">
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Informations */}
                    <div className="border-b border-[#E1E8F0] lg:border-none pb-3 lg:pb-0">
                        <button
                            onClick={() => toggleSection('informations')}
                            className="w-full flex items-center justify-between text-left lg:pointer-events-none"
                        >
                            <h3 className="text-xs font-bold tracking-widest text-[#172033] uppercase">INFORMATIONS</h3>
                            <ChevronDown size={16} className={`text-[#667085] lg:hidden transition-transform duration-200 ${openSections.informations ? 'rotate-180' : ''}`} />
                        </button>
                        <ul className={`mt-2.5 lg:mt-3 space-y-2 text-xs sm:text-sm lg:block ${openSections.informations ? 'block' : 'hidden'}`}>
                            {infoLinks.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.path} className="text-[#667085] hover:text-[#1677FF] transition-colors block py-0.5 font-normal">
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="border-b border-[#E1E8F0] lg:border-none pb-3 lg:pb-0">
                        <button
                            onClick={() => toggleSection('support')}
                            className="w-full flex items-center justify-between text-left lg:pointer-events-none"
                        >
                            <h3 className="text-xs font-bold tracking-widest text-[#172033] uppercase">SUPPORT</h3>
                            <ChevronDown size={16} className={`text-[#667085] lg:hidden transition-transform duration-200 ${openSections.support ? 'rotate-180' : ''}`} />
                        </button>
                        <ul className={`mt-2.5 lg:mt-3 space-y-2 text-xs sm:text-sm lg:block ${openSections.support ? 'block' : 'hidden'}`}>
                            {supportLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.path}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                        className="text-[#667085] hover:text-[#1677FF] transition-colors block py-0.5 font-normal"
                                    >
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <a
                            href={siteSettings.whatsappUrl || "https://wa.me/221770000000"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/25 text-[#25D366] rounded-xl px-3 py-2 transition-all group"
                        >
                            <MessageCircle size={15} />
                            <div>
                                <div className="text-[10px] font-bold">Réponse en &lt;5 min</div>
                                <div className="text-[9px] text-[#25D366] font-semibold">7j/7 sur WhatsApp</div>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <p className="text-[11px] sm:text-xs text-[#667085]">
                        © 2026 <span className="text-[#172033] font-bold">SenTechPLUS</span>. Tous droits réservés.
                    </p>

                    <p className="text-[11px] sm:text-xs text-[#667085] font-normal">
                        Made with ❤️ in Sénégal 🇸🇳
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1">
                        {paymentBadges.map((badge, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[#E1E8F0] text-[9px] sm:text-[10px] font-semibold text-[#172033] shadow-2xs"
                            >
                                <span>{badge.icon}</span>
                                <span>{badge.label}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
