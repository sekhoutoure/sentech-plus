'use client'
import Link from "next/link";
import { useSelector } from "react-redux";
import Logo from "@/components/Logo";
import React, { useState } from "react";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, MessageCircle, ChevronDown } from "lucide-react";

const Footer: React.FC = () => {
    const siteSettings = useSelector((state: any) => state.siteSettings)

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
        <footer className="bg-[#071426] text-white border-t border-[#0B2342]">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-10 lg:gap-12 py-6 sm:py-12 lg:py-16 border-b border-[#0B2342]">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-5">
                        <Link href="/" className="inline-block">
                            <Logo isDark={true} />
                        </Link>

                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xs font-normal">
                            La technologie qui simplifie votre quotidien. La boutique high-tech de référence au Sénégal.
                        </p>

                        <div className="space-y-2 text-xs sm:text-sm text-slate-400">
                            <a href="tel:+221770000000" className="flex items-center gap-2 hover:text-white transition-colors">
                                <Phone size={14} className="text-[#007BFF] shrink-0" />
                                <span>{siteSettings?.phone && !siteSettings.phone.includes('+1-212') ? siteSettings.phone : "+221 77 000 00 00"}</span>
                            </a>
                            <a href="mailto:contact@sentechplus.sn" className="flex items-center gap-2 hover:text-white transition-colors">
                                <Mail size={14} className="text-[#007BFF] shrink-0" />
                                <span>{siteSettings?.email && !siteSettings.email.includes('sentechplus.com') ? siteSettings.email : "contact@sentechplus.sn"}</span>
                            </a>
                            <p className="flex items-start gap-2">
                                <MapPin size={14} className="text-[#007BFF] mt-0.5 shrink-0" />
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
                                        className="size-8 rounded-lg bg-[#0B2342] hover:bg-[#007BFF] border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                                    >
                                        <Icon size={14} />
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Catalogue (Accordéon Mobile / Toujours ouvert Desktop) */}
                    <div className="border-b border-slate-800/80 lg:border-none pb-3 lg:pb-0">
                        <button
                            onClick={() => toggleSection('catalogue')}
                            className="w-full flex items-center justify-between text-left lg:pointer-events-none"
                        >
                            <h3 className="text-xs font-black tracking-widest text-white uppercase">CATALOGUE</h3>
                            <ChevronDown size={16} className={`text-slate-400 lg:hidden transition-transform duration-200 ${openSections.catalogue ? 'rotate-180' : ''}`} />
                        </button>
                        <ul className={`mt-2.5 lg:mt-3 space-y-2 text-xs sm:text-sm lg:block ${openSections.catalogue ? 'block' : 'hidden'}`}>
                            {catalogLinks.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.path} className="text-slate-400 hover:text-white transition-colors block py-0.5">
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Informations (Accordéon Mobile / Toujours ouvert Desktop) */}
                    <div className="border-b border-slate-800/80 lg:border-none pb-3 lg:pb-0">
                        <button
                            onClick={() => toggleSection('informations')}
                            className="w-full flex items-center justify-between text-left lg:pointer-events-none"
                        >
                            <h3 className="text-xs font-black tracking-widest text-white uppercase">INFORMATIONS</h3>
                            <ChevronDown size={16} className={`text-slate-400 lg:hidden transition-transform duration-200 ${openSections.informations ? 'rotate-180' : ''}`} />
                        </button>
                        <ul className={`mt-2.5 lg:mt-3 space-y-2 text-xs sm:text-sm lg:block ${openSections.informations ? 'block' : 'hidden'}`}>
                            {infoLinks.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.path} className="text-slate-400 hover:text-white transition-colors block py-0.5">
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support (Accordéon Mobile / Toujours ouvert Desktop) */}
                    <div className="border-b border-slate-800/80 lg:border-none pb-3 lg:pb-0">
                        <button
                            onClick={() => toggleSection('support')}
                            className="w-full flex items-center justify-between text-left lg:pointer-events-none"
                        >
                            <h3 className="text-xs font-black tracking-widest text-white uppercase">SUPPORT</h3>
                            <ChevronDown size={16} className={`text-slate-400 lg:hidden transition-transform duration-200 ${openSections.support ? 'rotate-180' : ''}`} />
                        </button>
                        <ul className={`mt-2.5 lg:mt-3 space-y-2 text-xs sm:text-sm lg:block ${openSections.support ? 'block' : 'hidden'}`}>
                            {supportLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.path}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                        className="text-slate-400 hover:text-white transition-colors block py-0.5"
                                    >
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <a
                            href="https://wa.me/221770000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 flex items-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] rounded-xl px-3 py-2 transition-all group"
                        >
                            <MessageCircle size={15} />
                            <div>
                                <div className="text-[10px] font-black">Réponse en &lt;5 min</div>
                                <div className="text-[9px] text-[#25D366]/70 font-medium">7j/7 sur WhatsApp</div>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <p className="text-[11px] sm:text-xs text-slate-500">
                        © 2026 <span className="text-slate-300 font-bold">SenTech Plus</span>. Tous droits réservés.
                    </p>

                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                        Made with ❤️ in Sénégal 🇸🇳
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1">
                        {paymentBadges.map((badge, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] sm:text-[10px] font-bold text-slate-300"
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
