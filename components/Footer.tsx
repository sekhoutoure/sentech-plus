'use client'
import Link from "next/link";
import { useSelector } from "react-redux";
import Logo from "@/components/Logo";
import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, ShieldCheck, Heart } from "lucide-react";

const Footer: React.FC = () => {
    const siteSettings = useSelector((state: any) => state.siteSettings)

    const linkSections = [
        {
            title: "CATALOGUE HIGH-TECH",
            links: [
                { text: "Casques & Écouteurs", path: '/shop?search=Casques' },
                { text: "Smartphones & Tablettes", path: '/shop?search=Smartphones' },
                { text: "PC Portables & Ordinateurs", path: '/shop?search=Laptops' },
                { text: "Montres & Bracelets Connectés", path: '/shop?search=Montres' },
                { text: "Enceintes & Audio", path: '/shop?search=Enceintes' },
            ]
        },
        {
            title: "INFORMATIONS & AIDE",
            links: [
                { text: "À propos de SenTech Plus", path: '/about' },
                { text: "Nos Engagements Qualité", path: '/pricing' },
                { text: "Devenir Vendeur Partenaire", path: '/create-store' },
                { text: "Politique de Confidentialité", path: '/pricing' },
                { text: "Conditions Générales de Vente", path: '/pricing' },
            ]
        },
        {
            title: "CONTACT & SUPPORT DAKAR",
            links: [
                { text: siteSettings?.phone || "+221 77 000 00 00", path: '/contact', icon: Phone },
                { text: siteSettings?.email || "contact@sentechplus.sn", path: '/contact', icon: Mail },
                { text: siteSettings?.address || "Avenue Cheikh Anta Diop, Dakar, Sénégal", path: '/contact', icon: MapPin }
            ]
        }
    ];

    const socialIcons = [
        { icon: Facebook, link: "https://facebook.com", label: "Facebook" },
        { icon: Instagram, link: "https://instagram.com", label: "Instagram" },
        { icon: Twitter, link: "https://twitter.com", label: "Twitter / X" },
        { icon: Linkedin, link: "https://linkedin.com", label: "LinkedIn" },
    ];

    const paymentMethods = [
        "Wave",
        "Orange Money",
        "Visa",
        "Mastercard",
        "Paiement à la Livraison"
    ];

    return (
        <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 sm:pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-slate-800/80">
                    
                    {/* Brand Column (2 cols on lg) */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
                            <Logo isDark={true} />
                        </Link>
                        
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                            SenTech Plus est la première plateforme e-commerce d'équipements intelligents et d'accessoires high-tech au Sénégal. Qualité certifiée, prix justes et service après-vente réactif.
                        </p>

                        {/* Status Indicator */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-bold">
                            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>Plateforme Opérationnelle 24/7</span>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-2.5 pt-2">
                            {socialIcons.map((item, idx) => {
                                const IconComponent = item.icon;
                                return (
                                    <Link
                                        key={idx}
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={item.label}
                                        className="size-9 rounded-full bg-slate-900 hover:bg-blue-600 border border-slate-800 hover:border-blue-500 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
                                    >
                                        <IconComponent size={16} />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {linkSections.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="text-xs font-black tracking-wider text-slate-200 uppercase">
                                {section.title}
                            </h3>
                            <ul className="space-y-2.5 text-xs sm:text-sm">
                                {section.links.map((link, i) => {
                                    const IconComponent = (link as any).icon;
                                    return (
                                        <li key={i}>
                                            <Link
                                                href={link.path}
                                                className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
                                            >
                                                {IconComponent && <IconComponent size={14} className="text-blue-500 shrink-0" />}
                                                <span>{link.text}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar with Payments & Copyright */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p className="flex items-center gap-1">
                        <span>© 2026 SenTech Plus. Conçu avec</span>
                        <Heart size={12} className="text-rose-500 fill-rose-500 inline" />
                        <span>à Dakar, Sénégal.</span>
                    </p>

                    {/* Payment Chips */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-400 mr-1">Paiements sécurisés :</span>
                        {paymentMethods.map((method, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300"
                            >
                                {method}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
