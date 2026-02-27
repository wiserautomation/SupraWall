import React, { useState } from "react";

export const APIKeyInput: React.FC<{ onValidKey: (key: string) => void; className?: string; }> = ({ onValidKey, className = "" }) => {
    const [key, setKey] = useState("");

    return (
        <div className={\`flex flex-col space-y-2 \${className}\`}>
            <label className="text-sm font-medium text-gray-700">SupraWall API Key</label>
            <div className="flex gap-2">
                <input 
                    type="password"
                    placeholder="ag_..."
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                />
                <button 
                    onClick={() => {
                        if (key.startsWith("ag_")) onValidKey(key);
                        else alert("Invalid format. Must start with ag_");
                    }} 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-sm transition-colors"
                >
                    Connect
                </button>
            </div>
        </div>
    );
}
