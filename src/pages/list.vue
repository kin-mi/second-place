<template>
  <div class="container flex-col items-start">
    <n-link to="/" class="text-sm text-blue-800"> トップへ戻る </n-link>
    <div class="infinite-scroll">
      <ul class="infinite-scroll-list">
        <li
          v-for="(question, index) in questions"
          :key="index"
          class="infinite-scroll-list-item"
        >
          <p class="text-lg">{{ question.title }}</p>
          <p class="text-sm">（全 {{ question.rankingSize }}問）</p>
          <n-link
            class="w-full text-right font-bold text-green-800 underline"
            to="/"
          >
            挑戦する
          </n-link>
        </li>
      </ul>
      <infinite-loading
        ref="infiniteLoading"
        spinner="spiral"
        @infinite="infiniteHandler"
      >
        <span slot="no-results" />
        <span slot="no-more" />
      </infinite-loading>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { firestore } from 'firebase'
const GET_COUNT_LIMIT: number = 5

type questionDocData = question & {
  rankingSize: number
  createAt: firestore.Timestamp | undefined
}
type dataType = {
  questions: questionDocData[]
}

export default Vue.extend({
  data(): dataType {
    return {
      questions: [],
    }
  },
  methods: {
    infiniteHandler($state: any): void {
      const startAfterDate: Date | undefined =
        this.questions.length > 0
          ? this.questions.slice(-1)[0].createAt?.toDate()
          : this.$dayjs().add(1, 'month').toDate()
      const query = this.$firestore
        .collection('question')
        .orderBy('createAt', 'desc')
        .startAfter(startAfterDate)
        .limit(GET_COUNT_LIMIT)
      query.get().then((snap) => {
        if (snap.empty) {
          $state.complete()
        }
        snap.docs.forEach((doc) => {
          const data = doc.data()
          this.questions.push({
            id: data.id,
            title: data.title,
            rankings: [],
            rankingSize: data.rankingSize | 0,
            createAt: data.createAt,
          })
        })
        $state.loaded()
      })
    },
  },
})
</script>
<style scoped>
.infinite-scroll {
  @apply w-full max-w-sm;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.infinite-scroll-list-item {
  @apply flex flex-col w-full max-w-sm mx-auto mt-2 p-4 border border-gray-200 bg-white shadow;
}
</style>
