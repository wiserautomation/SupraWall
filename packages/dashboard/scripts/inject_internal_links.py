import os
import re

base_dir = "/Users/alejandropeghin/Desktop/AntiG/SW-Private/SupraWall/packages/dashboard/src/app/[lang]/learn"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'Internal Linking Cluster' in content:
        return

    linking_block = """
            {/* Internal Linking Cluster */}
            <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-20 bg-black">
                <h2 className="text-3xl font-black italic text-white flex items-center gap-4 mb-8">
                    Explore Agent Security Clusters
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href={`/${lang}/learn`} className="group p-6 rounded-[2rem] bg-neutral-900 border border-white/5 hover:border-emerald-500/30 transition-all">
                        <h4 className="text-sm font-black uppercase italic text-white group-hover:text-emerald-400 transition-colors">AI Agent Security Hub</h4>
                        <p className="text-xs text-neutral-500 mt-2 font-bold uppercase tracking-tight">Browse the complete library of agent guardrails.</p>
                    </Link>
                    <Link href={`/${lang}/gdpr`} className="group p-6 rounded-[2rem] bg-neutral-900 border border-white/5 hover:border-purple-500/30 transition-all">
                        <h4 className="text-sm font-black uppercase italic text-white group-hover:text-purple-400 transition-colors">GDPR AI Compliance</h4>
                        <p className="text-xs text-neutral-500 mt-2 font-bold uppercase tracking-tight">Protect PII across all agent tool calls.</p>
                    </Link>
                    <Link href={`/${lang}/for-compliance-officers`} className="group p-6 rounded-[2rem] bg-neutral-900 border border-white/5 hover:border-blue-500/30 transition-all">
                        <h4 className="text-sm font-black uppercase italic text-white group-hover:text-blue-400 transition-colors">EU AI Act Readiness</h4>
                        <p className="text-xs text-neutral-500 mt-2 font-bold uppercase tracking-tight">Automate Article 12 audit trails for agents.</p>
                    </Link>
                </div>
            </div>
"""

    # Look for the last </div> before );
    parts = content.rsplit('</div>', 1)
    if len(parts) == 2:
        new_content = parts[0] + linking_block + '        </div>' + parts[1]
        
        # ensure Link is imported
        if 'import Link ' not in new_content:
            new_content = new_content.replace('import { Navbar }', 'import Link from "next/link";\nimport { Navbar }')
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Injected cluster links to {filepath}")

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file == 'page.tsx':
            filepath = os.path.join(root, file)
            # Skip the main hub page to avoid linking to itself redundantly in this block
            if 'learn/page.tsx' in filepath:
                continue
            process_file(filepath)

print("Internal linking injection complete.")
