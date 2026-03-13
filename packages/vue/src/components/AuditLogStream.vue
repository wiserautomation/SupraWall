<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  agentId: string;
  apiKey: string;
  limit?: number;
  className?: string;
}>();

const logs = ref<any[]>([]);
const loading = ref(true);
let interval: any;

const fetchLogs = async () => {
  try {
    const res = await fetch(\`https://api.suprawall.io/v1/agents/\${props.agentId}/logs?limit=\${props.limit || 50}\`, {
      headers: { "Authorization": \`Bearer \${props.apiKey}\` }
    });
    if (res.ok) {
      const data = await res.json();
      logs.value = data.logs;
    }
  } catch (e) {
    console.error("Failed to fetch logs", e);
  }
  loading.value = false;
};

onMounted(() => {
  fetchLogs();
  interval = setInterval(fetchLogs, 2000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div v-if="loading" :class="['animate-pulse bg-gray-100 p-4 rounded', className]">Loading secure audit stream...</div>
  <div v-else :class="['border border-gray-200 rounded-lg overflow-hidden bg-white', className]">
    <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
      <h3 class="text-sm font-semibold text-gray-700">Live Audit Stream</h3>
    </div>
    <div class="max-h-96 overflow-y-auto p-4 space-y-2 font-mono text-xs">
      <div v-if="logs.length === 0" class="text-gray-400">Waiting for agent activity...</div> 
      <div v-else v-for="(log, i) in logs" :key="i" class="flex items-center gap-3">
        <span class="text-gray-500">{{ new Date(log.timestamp).toLocaleTimeString() }}</span>
        <span :class="['font-bold', log.decision === 'ALLOW' ? 'text-green-600' : 'text-red-600']">{{ log.decision }}</span>
        <span class="text-gray-900">{{ log.toolName }}</span>
      </div>
    </div>
  </div>
</template>
