<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let className = "";
    
    let key = "";
    const dispatch = createEventDispatcher();

    function handleConnect() {
        if (key.startsWith("ag_")) {
            dispatch('validKey', key);
        } else {
            alert("Invalid format. Must start with ag_");
        }
    }
</script>

<div class="flex flex-col space-y-2 {className}">
    <label class="text-sm font-medium text-gray-700">AgentGate API Key</label>
    <div class="flex gap-2">
        <input 
            type="password"
            placeholder="ag_..."
            bind:value={key}
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-indigo-500 outline-none"
        />
        <button 
            on:click={handleConnect}
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-sm transition-colors"
        >
            Connect
        </button>
    </div>
</div>
