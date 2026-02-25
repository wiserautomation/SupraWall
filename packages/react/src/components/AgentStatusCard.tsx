import React from "react";

export interface AgentStatusCardProps {
    agentId: string;
    apiKey: string;
    className?: string;
}

export const AgentStatusCard: React.FC<AgentStatusCardProps> = ({ agentId, className = "" }) => {
    return (
        <div className={\`p-4 border border-gray-200 rounded-lg bg-white flex items-center justify-between \${className}\`}>
            <div>
                <h4 className="text-sm font-bold text-gray-900 border-b pb-1">Agent Health</h4>
                <p className="text-xs text-gray-500 font-mono mt-1">{agentId}</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-700">Secured</span>
            </div>
        </div>
    );
};
