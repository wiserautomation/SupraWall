<script lang="ts">
    export let agentId: string;
    export let className = "";
</script>

<div class="p-4 border border-gray-200 rounded-lg bg-white flex items-center justify-between {className}">
    <div>
        <h4 class="text-sm font-bold text-gray-900 border-b pb-1">Agent Health</h4>
        <p class="text-xs text-gray-500 font-mono mt-1">{agentId}</p>
    </div>
    <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        <span class="text-sm font-medium text-green-700">Secured</span>
    </div>
</div>
