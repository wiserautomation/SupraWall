import React, { useState } from "react";

export interface PolicyEditorProps {
    agentId: string;
    apiKey: string;
    className?: string;
}

export const PolicyEditor: React.FC<PolicyEditorProps> = ({ agentId, apiKey, className = "" }) => {
    const [toolName, setToolName] = useState("");
    const [decision, setDecision] = useState<"ALLOW" | "DENY" | "REQUIRE_APPROVAL">("DENY");
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // Call suprawall API
        try {
            await fetch(\`https://api.suprawall.io/v1/agents/\${agentId}/policies\`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": \`Bearer \${apiKey}\`
                },
                body: JSON.stringify({ toolName, decision })
            });
            setToolName("");
            alert("Policy saved successfully.");
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    };

    return (
        <form onSubmit={handleSave} className={\`p-5 border border-gray-200 rounded-lg bg-white \${className}\`}>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Add Security Policy</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tool Pattern (Regex/Exact)</label>
                    <input 
                        required
                        value={toolName}
                        onChange={e => setToolName(e.target.value)}
                        placeholder="e.g. os.run or drop_*"
                        className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm border focus:ring-1 focus:ring-indigo-500 outline-none" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                    <select 
                        value={decision} 
                        onChange={e => setDecision(e.target.value as any)}
                        className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm border focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                        <option value="ALLOW">ALLOW execution</option>
                        <option value="DENY">DENY explicitly</option>
                        <option value="REQUIRE_APPROVAL">REQUIRE human approval</option>
                    </select>
                </div>
                <button type="submit" disabled={saving} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-sm transition-colors">
                    {saving ? "Saving..." : "Create Policy"}
                </button>
            </div>
        </form>
    );
};
