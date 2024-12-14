<script setup>
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  border-radius: 12px;
}

@media screen and (max-width: 768px) {
  .main {
    margin: 0;
  }
}
</style>
