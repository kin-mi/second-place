<template>
  <div class="container">
    <div>
      <h1 class="title">2位じゃダメなんですか？</h1>
      <h2 class="subtitle transform -translate-y-20">
        2位を当てるクイズサイト
      </h2>
      <div class="links">
        <n-link to="/list" class="button--green"> 2位を当てる </n-link>
        <n-link to="/register" class="button--gray"> 問題を作る </n-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  mounted(): void {
    this.$auth.signInAnonymously()
  },
  methods: {
    async add(): Promise<void> {
      await this.$firestore.collection('test').add({ test: 1 })
    },
  },
})
</script>

<style>
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
.title {
  @apply font-sans block font-bold text-3xl text-gray-800;
}
.subtitle {
  @apply font-sans block text-xl text-gray-700;
}

.links {
  @apply flex flex-col justify-center items-center;
}
.links a {
  @apply mt-2;
}
</style>
