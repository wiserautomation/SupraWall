import Link from "next/link";
import { Shield, BrickWall } from "lucide-react";

export default function ConnectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Connect sub-nav */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center">
                    <Link href="/dashboard" className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold py-3 pr-6 sm:border-r border-gray-200 sm:mr-4 shrink-0 transition-colors">
                        <BrickWall className="w-5 h-5" />
                        <span>SupraWall Connect</span>
                    </Link>
                    <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0">
                        {[
                            { label: "Overview", href: "/connect" },
                            { label: "Sub-Keys", href: "/connect/keys" },
                            { label: "Analytics", href: "/connect/analytics" },
                            { label: "Audit Log", href: "/connect/events" },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-4 py-3 text-sm font-medium text-gray-500
                  hover:text-gray-900 whitespace-nowrap border-b-2 border-transparent
                  hover:border-gray-300 transition-all"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
}
