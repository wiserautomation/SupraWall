import React, { useEffect, useState } from "react";

export interface AuditLogStreamProps {
    agentId: string;
    apiKey: string;
    limit?: number;
    className?: string;
}

export const AuditLogStream: React.FC<AuditLogStreamProps> = ({ agentId, apiKey, limit = 50, className = "" }) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Poll SupraWall API (simulated for component scaffolding)
        const fetchLogs = async () => {
            try {
                const res = await fetch(\`https://api.suprawall.io/v1/agents/\${agentId}/logs?limit=\${limit}\`, {
                    headers: { "Authorization": \`Bearer \${apiKey}\` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setLogs(data.logs);
                }
            } catch (e) {
                console.error("Failed to fetch logs", e);
            }
            setLoading(false);
        };
        fetchLogs();
        const interval = setInterval(fetchLogs, 2000);
        return () => clearInterval(interval);
    }, [agentId, apiKey, limit]);

    if (loading) return <div className={\`animate-pulse bg-gray-100 p-4 rounded \${className}\`}>Loading secure audit stream...</div>;

    return (
        <div className={\`border border-gray-200 rounded-lg overflow-hidden bg-white \${className}\`}>
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">Live Audit Stream</h3>
            </div>
            <div className="max-h-96 overflow-y-auto p-4 space-y-2 font-mono text-xs">
                {logs.length === 0 ? (
                 <div className="text-gray-400">Waiting for agent activity...</div> 
                ) : logs.map((log, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={\`font-bold \${log.decision === 'ALLOW' ? 'text-green-600' : 'text-red-600'}\`}>{log.decision}</span>
                        <span className="text-gray-900">{log.toolName}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
