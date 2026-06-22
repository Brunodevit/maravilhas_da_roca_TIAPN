<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import HeaderComum from './components/cabecalho.vue';      
import HeaderAdmin from './components/cabecalhoAdmin.vue'; 

const route = useRoute();

const isAdmin = computed(() => {
  const role = localStorage.getItem('user_role');
  const path = route?.path || '';
  return role === 'admin' || path.startsWith('/admin');
});

const hideHeader = computed(() => {
  return route?.meta?.hideHeader === true;
});
</script>

<template>
  <div>
    <HeaderAdmin v-if="!hideHeader && isAdmin" />
    <HeaderComum v-else-if="!hideHeader && !isAdmin" />

    <router-view />
  </div>
</template>