import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "White-Label Partner Program | Supra-wall",
    description:
        "EU AI Act consulting firms and compliance platforms: rebrand Supra-wall as your own tool. Revenue share, sub-accounts, custom domain. Serve your clients with a SaaS compliance stack.",
};

export default function PartnerPage() {
    const benefits = [
        {
            icon: "🏷️",
            title: "Full White-Label",
            desc: "Your logo, your colors, your domain. Clients never see Supra-wall branding (or optionally 'Powered by Supra-wall').",
        },
        {
            icon: "💰",
            title: "Revenue Share",
            desc: "70% of subscription revenue to you, 30% to Supra-wall. You set your own pricing to clients.",
        },
        {
            icon: "👥",
            title: "Sub-Account Management",
            desc: "Manage compliance for all your clients from one partner portal. Separate audit logs, policies, and reporting per client.",
        },
        {
            icon: "📊",
            title: "Partner Analytics",
            desc: "See usage, compliance scores, and activity across all client accounts in one dashboard.",
        },
        {
            icon: "🔧",
            title: "Custom Domain",
            desc: "compliance.yourfirm.com — fully branded experience on your subdomain or custom domain.",
        },
        {
            icon: "🎯",
            title: "Case Studies & Co-Marketing",
            desc: "We help you close enterprise clients by co-authoring case studies and compliance materials.",
        },
    ];

    const targetPartners = [
        { type: "EU AI Act Consultancies", example: "Firms advising clients on AI Act compliance strategy" },
        { type: "GDPR/Privacy Law Firms", example: "Legal firms adding technical AI compliance to their practice" },
        { type: "GRC Platforms", example: "Governance, risk, and compliance software vendors" },
        { type: "AI Governance Consultants", example: "Boutique firms specializing in AI ethics and governance" },
        { type: "System Integrators", example: "SI firms deploying AI for enterprise clients" },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Navbar */}
            <nav className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <span className="font-bold text-white">Supra-wall</span>
                </Link>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-20">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs font-semibold text-violet-400 mb-6">
                        Partner Program · Limited spots available
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5">
                        The technical enforcement layer
                        <br />
                        <span className="text-violet-400">your clients need.</span>
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto mb-8">
                        You have the client relationships. We built the compliance infrastructure.
                        White-label Supra-wall for your EU AI Act practice — your brand, your pricing, our technology.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <a
                            href="mailto:partners@suprawall.ai?subject=Partner Program Inquiry"
                            className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-colors"
                        >
                            Apply to Partner Program →
                        </a>
                        <Link
                            href="/pricing"
                            className="px-8 py-3.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-neutral-300 rounded-xl font-medium transition-colors"
                        >
                            View Pricing
                        </Link>
                    </div>
                </div>

                {/* How it works */}
                <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-8 mb-10">
                    <h2 className="text-xl font-bold text-white mb-6">How the program works</h2>
                    <div className="space-y-4">
                        {[
                            { step: "1", title: "You sign up as a partner", desc: "Apply via email. We onboard 10 partners per quarter to ensure quality support." },
                            { step: "2", title: "Get your white-label tenant", desc: "We set up compliance.yourfirm.com with your logo, colors, and client sub-accounts." },
                            { step: "3", title: "Onboard your clients", desc: "Each client gets their own sub-account with isolated audit logs, policies, and compliance reports." },
                            { step: "4", title: "Collect revenue", desc: "You bill clients at your own rate. We invoice you at partner pricing. You keep the margin." },
                        ].map(({ step, title, desc }) => (
                            <div key={step} className="flex gap-4">
                                <div className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center text-violet-400 text-xs font-bold shrink-0 mt-0.5">
                                    {step}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                                    <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Benefits grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {benefits.map(({ icon, title, desc }) => (
                        <div key={title} className="bg-black/30 border border-white/[0.05] rounded-xl p-5">
                            <div className="text-2xl mb-3">{icon}</div>
                            <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                            <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>

                {/* Target partners */}
                <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-8 mb-10">
                    <h2 className="text-lg font-bold text-white mb-5">Who this is for</h2>
                    <div className="space-y-3">
                        {targetPartners.map(({ type, example }) => (
                            <div key={type} className="flex items-start gap-3">
                                <svg className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <div>
                                    <span className="text-sm font-medium text-white">{type}</span>
                                    <span className="text-xs text-neutral-500 ml-2">{example}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-3">Ready to build a compliance practice?</h2>
                    <p className="text-neutral-400 text-sm mb-6 max-w-lg mx-auto">
                        August 2026 is the EU AI Act enforcement deadline. Your clients are looking for technical solutions right now.
                    </p>
                    <a
                        href="mailto:partners@suprawall.ai?subject=Partner Program Inquiry&body=I'm interested in the Supra-wall white-label partner program. My firm: [name]. Type of clients: [description]. Expected volume: [estimate]."
                        className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-lg transition-colors"
                    >
                        Apply Now — partners@suprawall.ai
                    </a>
                </div>
            </div>
        </div>
    );
}
