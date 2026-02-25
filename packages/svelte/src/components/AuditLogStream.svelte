<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    export let agentId: string;
    export let apiKey: string;
    export let limit = 50;
    export let className = "";

    let logs: any[] = [];
    let loading = true;
    let intervalId: any;

    async function fetchLogs() {
        try {
            const res = await fetch(\`https://api.agentgate.io/v1/agents/\${agentId}/logs?limit=\${limit}\`, {
                headers: { "Authorization": \`Bearer \${apiKey}\` }
            });
            if (res.ok) {
                const data = await res.json();
                logs = data.logs;
            }
        } catch (e) {
            console.error(e);
        }
        loading = false;
    }

    onMount(() => {
        fetchLogs();
        intervalId = setInterval(fetchLogs, 2000);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });
</script>

{#if loading}
    <div class="animate-pulse bg-gray-100 p-4 rounded {className}">Loading secure audit stream...</div>
{:else}
    <div class="border border-gray-200 rounded-lg overflow-hidden bg-white {className}">
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 class="text-sm font-semibold text-gray-700">Live Audit Stream</h3>
        </div>
        <div class="max-h-96 overflow-y-auto p-4 space-y-2 font-mono text-xs">
            {#if logs.length === 0}
                <div class="text-gray-400">Waiting for agent activity...</div> 
            {:else}
                {#each logs as log}
                    <div class="flex items-center gap-3">
                        <span class="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span class="font-bold {log.decision === 'ALLOW' ? 'text-green-600' : 'text-red-600'}">{log.decision}</span>
                        <span class="text-gray-900">{log.toolName}</span>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
{/if}
