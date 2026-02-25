<script lang="ts">
    export let agentId: string;
    export let apiKey: string;
    export let className = "";

    let toolName = "";
    let decision = "DENY";
    let saving = false;

    async function handleSave(e: Event) {
        e.preventDefault();
        saving = true;
        try {
            await fetch(\`https://api.agentgate.io/v1/agents/\${agentId}/policies\`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": \`Bearer \${apiKey}\`
                },
                body: JSON.stringify({ toolName, decision })
            });
            toolName = "";
            alert("Policy saved successfully.");
        } catch (err) {
            console.error(err);
        }
        saving = false;
    }
</script>

<form on:submit={handleSave} class="p-5 border border-gray-200 rounded-lg bg-white {className}">
    <h3 class="text-base font-semibold text-gray-900 mb-4">Add Security Policy</h3>
    <div class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tool Pattern (Regex/Exact)</label>
            <input 
                required
                bind:value={toolName}
                placeholder="e.g. os.run or drop_*"
                class="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm border focus:ring-1 focus:ring-indigo-500 outline-none" 
            />
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select 
                bind:value={decision}
                class="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm border focus:ring-1 focus:ring-indigo-500 outline-none"
            >
                <option value="ALLOW">ALLOW execution</option>
                <option value="DENY">DENY explicitly</option>
                <option value="REQUIRE_APPROVAL">REQUIRE human approval</option>
            </select>
        </div>
        <button type="submit" disabled={saving} class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-sm transition-colors">
            {saving ? "Saving..." : "Create Policy"}
        </button>
    </div>
</form>
