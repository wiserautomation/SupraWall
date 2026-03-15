import { Code, Terminal, Key, Shield, Zap, Lock, Info, Activity } from "lucide-react";

export default function ApiDocsPage() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="space-y-4">
                <div className="inline-flex p-3 bg-emerald-500/10 rounded-full mb-2">
                    <Key className="w-8 h-8 text-emerald-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                    API Reference
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    Integrate SupraWall directly into your AI agents or platforms using our REST API.
                </p>
            </div>

            {/* Authentication */}
            <section className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <Lock className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-2xl font-bold text-white">Authentication</h2>
                </div>
                <p className="text-neutral-400">
                    All API requests must include an <code className="text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">apiKey</code> in the request body. 
                    You can find your API keys in the dashboard under "Connected Agents" or "Platform Connect".
                </p>
                <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6 space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg shrink-0">
                            <Info className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-1">Key Types</h4>
                            <ul className="text-sm text-neutral-400 space-y-2 list-disc list-inside">
                                <li><strong className="text-neutral-200">Agent Keys:</strong> Used for individual agents configured in the dashboard.</li>
                                <li><strong className="text-neutral-200">Connect Keys:</strong> Start with <code className="text-emerald-400">agc_</code>. Used for multi-tenant platform integrations.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Endpoints */}
            <section className="space-y-12 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <Terminal className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-2xl font-bold text-white">Endpoints</h2>
                </div>

                {/* Evaluate Endpoints */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">POST</span>
                        <h3 className="text-xl font-mono text-white">/api/v1/evaluate</h3>
                    </div>
                    <p className="text-neutral-400">
                        Evaluates a tool call against defined security policies. It performs zero-trust validation, injects secrets from the vault, and logs the action for auditing.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Request Body</h4>
                            <pre className="p-4 bg-black/40 border border-white/5 rounded-xl text-xs text-neutral-300 overflow-x-auto">
{`{
  "apiKey": "string",      // Required
  "toolName": "string",    // Required (e.g., 'read_file')
  "args": "object",        // Required (arguments for the tool)
  "agentRole": "string",   // Optional
  "sessionId": "string",   // Optional
  "model": "string"        // Optional (for cost estimation)
}`}
                            </pre>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Response</h4>
                            <pre className="p-4 bg-black/40 border border-white/5 rounded-xl text-xs text-neutral-300 overflow-x-auto">
{`{
  "decision": "ALLOW" | "DENY" | "REQUIRE_APPROVAL",
  "reason": "string",
  "resolvedArguments": "object", // If vault injected
  "vaultInjected": "boolean",
  "branding": "object",
  "estimated_cost_usd": "number"
}`}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Scrub Endpoints */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">POST</span>
                        <h3 className="text-xl font-mono text-white">/api/v1/scrub</h3>
                    </div>
                    <p className="text-neutral-400">
                        Helper utility to redact sensitive substrings from text. Primarily used to prevent LLMs from leaking secrets back to the user or logs.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Request Body</h4>
                            <pre className="p-4 bg-black/40 border border-white/5 rounded-xl text-xs text-neutral-300 overflow-x-auto">
{`{
  "text": "string",           // Required
  "secretValues": "string[]"  // Required (list of strings to redact)
}`}
                            </pre>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Response</h4>
                            <pre className="p-4 bg-black/40 border border-white/5 rounded-xl text-xs text-neutral-300 overflow-x-auto">
{`{
  "text": "string",     // Scrubbed text
  "scrubbed": "boolean" // Whether any changes were made
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Example */}
            <section className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-2xl font-bold text-white">Quick Example (Node.js)</h2>
                </div>
                <div className="p-1 bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="bg-black/40 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                        <span className="text-xs font-mono text-neutral-500">example.js</span>
                    </div>
                    <pre className="p-6 text-sm text-neutral-300 overflow-x-auto overflow-y-auto max-h-[400px]">
{`const response = await fetch("https://www.supra-wall.com/api/v1/evaluate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    apiKey: process.env.SUPRAWALL_API_KEY,
    toolName: "send_email",
    args: { to: "user@example.com", subject: "Hello" }
  })
});

const { decision, reason } = await response.json();

if (decision === "DENY") {
  throw new Error(\`Security Block: \${reason}\`);
}

// Proceed with tool call...`}
                    </pre>
                </div>
            </section>

            {/* Support */}
            <section className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-xl font-bold text-white">Need a custom integration?</h3>
                    <p className="text-neutral-400">Our enterprise team can help you build high-throughput security wrappers.</p>
                </div>
                <a href="mailto:support@suprawall.ai" className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors whitespace-nowrap">
                    Contact Support
                </a>
            </section>
        </div>
    );
}
