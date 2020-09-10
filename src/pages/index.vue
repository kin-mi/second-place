<template>
  <div class="container">
    <div>
      <h1 class="title">2位じゃダメなんですか？</h1>
      <h2 class="transform -translate-y-20">2位を当てるクイズサイト</h2>
      <div class="links">
        <a
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
          @click="add"
        >
          問題を解く
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          問題を作る
        </a>
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

/* .title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
} */

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
