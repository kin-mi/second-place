<template>
  <div>
    <Nuxt />
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.container {
  @apply w-full max-w-sm min-h-screen flex justify-center items-center text-center mx-auto;
}
.title {
  @apply font-sans block font-bold text-3xl text-gray-800;
}
.subtitle {
  @apply font-sans block text-xl text-gray-700;
}

.button--green {
  @apply inline-block w-40;
  @apply py-3 px-6;
  @apply border border-green-700 rounded-md;
  @apply text-green-700 no-underline;
}

.button--green:hover {
  @apply text-white bg-green-700;
  @apply cursor-pointer;
}

.button--gray {
  @apply inline-block w-40;
  @apply py-3 px-6;
  @apply border border-blue-900 rounded-md;
  @apply text-blue-900 no-underline;
}

.button--gray:hover {
  @apply text-white bg-blue-900;
  @apply cursor-pointer;
}
</style>
