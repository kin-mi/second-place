<template>
  <div>{{ id }}</div>
</template>
<script lang="ts">
import Vue from 'vue'
type dataType = {
  id: string
}
export default Vue.extend({
  asyncData({ params }) {
    // eslint-disable-next-line no-console
    console.log(params)
    return { id: params.id }
  },
  data(): dataType {
    return {
      id: '',
    }
  },
})
</script>
