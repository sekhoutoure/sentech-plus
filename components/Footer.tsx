'use client'
import Link from "next/link";
import { useSelector } from "react-redux";
import Logo from "@/components/Logo";
import React from "react";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";

const Footer: React.FC = () => {
    const siteSettings = useSelector((state: any) => state.siteSettings)

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
        <footer className="bg-[#071126] text-white border-t border-slate-800/60">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 py-14 sm:py-16 border-b border-slate-800/60">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-5">
                        <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
                            <Logo isDark={true} />
                        </Link>

                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-normal" style={{ textWrap: 'pretty' } as React.CSSProperties}>
                            La technologie qui simplifie votre quotidien. La boutique high-tech de référence au Sénégal.
                        </p>

                        <div className="space-y-2.5 text-sm text-slate-400">
                            <a href={`tel:${siteSettings?.phone || '+221770000000'}`} className="flex items-center gap-2.5 hover:text-white transition-colors group">
                                <Phone size={15} className="text-[#1769FF] group-hover:scale-110 transition-transform shrink-0" />
                                <span>{siteSettings?.phone || "+221 77 000 00 00"}</span>
                            </a>
                            <a href={`mailto:${siteSettings?.email || 'contact@sentechplus.sn'}`} className="flex items-center gap-2.5 hover:text-white transition-colors group">
                                <Mail size={15} className="text-[#1769FF] group-hover:scale-110 transition-transform shrink-0" />
                                <span>{siteSettings?.email || "contact@sentechplus.sn"}</span>
                            </a>
                            <p className="flex items-start gap-2.5">
                                <MapPin size={15} className="text-[#1769FF] mt-0.5 shrink-0" />
                                <span>{siteSettings?.address || "Avenue Cheikh Anta Diop, Dakar, Sénégal"}</span>
                            </p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-2.5 pt-1">
                            {socialLinks.map((social, i) => {
                                const Icon = social.icon
                                return (
                                    <a
                                        key={i}
                                        href={social.href}
                                        target={social.external ? "_blank" : undefined}
                                        rel={social.external ? "noopener noreferrer" : undefined}
                                        aria-label={social.label}
                                        className="size-9 rounded-xl bg-slate-800 hover:bg-[#1769FF] border border-slate-700 hover:border-[#1769FF] flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                                    >
                                        <Icon size={16} />
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Catalogue */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black tracking-widest text-white uppercase">CATALOGUE</h3>
                        <ul className="space-y-2.5">
                            {catalogLinks.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.path} className="text-slate-400 hover:text-white text-sm transition-colors hover:pl-1 duration-200 block">
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Informations */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black tracking-widest text-white uppercase">INFORMATIONS</h3>
                        <ul className="space-y-2.5">
                            {infoLinks.map((link, i) => (
                                <li key={i}>
                                    <Link href={link.path} className="text-slate-400 hover:text-white text-sm transition-colors hover:pl-1 duration-200 block">
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black tracking-widest text-white uppercase">SUPPORT</h3>
                        <ul className="space-y-2.5">
                            {supportLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.path}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                        className="text-slate-400 hover:text-white text-sm transition-colors hover:pl-1 duration-200 block"
                                    >
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* WhatsApp CTA Card */}
                        <a
                            href="https://wa.me/221770000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 flex items-center gap-2.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] rounded-xl px-3.5 py-2.5 transition-all duration-200 group"
                        >
                            <MessageCircle size={16} className="group-hover:scale-110 transition-transform" />
                            <div>
                                <div className="text-[11px] font-black">Réponse en &lt;5 min</div>
                                <div className="text-[10px] text-[#25D366]/70 font-medium">7j/7 sur WhatsApp</div>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        © 2026 <span className="text-slate-300 font-bold">SenTech Plus</span>. Tous droits réservés.
                    </p>

                    <p className="text-xs text-slate-500 font-medium">
                        Made with ❤️ in Sénégal 🇸🇳
                    </p>

                    {/* Payment Methods */}
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                        {paymentBadges.map((badge, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300"
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
