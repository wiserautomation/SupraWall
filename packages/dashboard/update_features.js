const fs = require('fs');
const path = require('path');

const snippet = `
             {/* ⚡ TRY IN 30 SECONDS */}
             <section className="py-24 px-6 bg-[#030303] border-t border-white/5 relative z-10 text-center">
                <div className="max-w-4xl mx-auto space-y-12">
                    <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-glow">
                        Try It In <span className="text-emerald-500 underline decoration-white/10">30 Seconds.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-neutral-400 font-medium italic max-w-2xl mx-auto">
                        No account required. Auto-detect your framework and wrap your agent with security in one command.
                    </p>
                    <div className="p-6 md:p-8 bg-[#0a0a0a] rounded-[2rem] border border-emerald-500/20 font-mono text-[13px] relative overflow-hidden group shadow-[0_0_80px_rgba(16,185,129,0.15)] text-left cursor-copy mx-auto max-w-2xl hover:border-emerald-500/50 transition-all" onClick={() => navigator.clipboard && navigator.clipboard.writeText('npx suprawall init')} title="Copy command">
                        <div className="absolute top-4 right-6 text-emerald-500/30 text-[10px] font-black uppercase tracking-widest italic group-hover:text-emerald-500 transition-colors">
                            CLICK TO COPY
                        </div>
                        <pre className="text-emerald-100/80 leading-loose">
$ npx suprawall init

? Detected: my-agent.ts — secure it? (Y/n) y

[✓] .env updated with SUPRAWALL_API_KEY
[✓] my-agent.ts wrapped with protect()

🛡️  Your agent is now armored.
                        </pre>
                    </div>
                </div>
            </section>
        </main>
`;

const featureFiles = [
    'FeaturesClient.tsx',
    'audit-trail/AuditTrailClient.tsx',
    'budget-limits/BudgetClient.tsx',
    'human-in-the-loop/HitlClient.tsx',
    'pii-shield/PiiShieldClient.tsx',
    'policy-engine/PolicyClient.tsx',
    'prompt-shield/PromptShieldClient.tsx',
    'vault/VaultClient.tsx'
];

const basePath = '/Users/alejandropeghin/Desktop/AntiG/SW-Private/SupraWall/packages/dashboard/src/app/[lang]/features';

for (const file of featureFiles) {
    const fullPath = path.join(basePath, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        if (!content.includes('TRY IN 30 SECONDS')) {
            // Replace the last </main> with the snippet
            content = content.replace(/(?:\s*)<\/main>\s*(?:\);?\s*}\s*)$/i, snippet + '\n    );\n}\n');
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Updated ${file}`);
        } else {
            console.log(`Already updated ${file}`);
        }
    } else {
        console.error(`File not found: ${fullPath}`);
    }
}
