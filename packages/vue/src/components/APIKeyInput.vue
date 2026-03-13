<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  className?: string;
}>();

const emit = defineEmits<{
  (e: 'validKey', key: string): void
}>();

const key = ref("");

const handleConnect = () => {
    if (key.value.startsWith("ag_")) emit("validKey", key.value);
    else alert("Invalid format. Must start with ag_");
};
</script>

<template>
  <div :class="['flex flex-col space-y-2', className]">
    <label class="text-sm font-medium text-gray-700">SUPRA-WALL API Key</label>
    <div class="flex gap-2">
      <input 
        type="password"
        placeholder="ag_..."
        v-model="key"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-indigo-500 outline-none"
      />
      <button 
        @click="handleConnect"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-sm transition-colors"
      >
        Connect
      </button>
    </div>
  </div>
</template>
