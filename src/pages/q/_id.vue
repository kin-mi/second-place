<template>
  <div class="container flex-col">
    <h1 id="title" class="title w-full max-w-sm break-words">{{ title }}</h1>
    <template v-if="answered">
      <p id="answer" class="text-lg text-green-800 font-bold">
        <span class="text-xl text-red-800">{{ correctCount }}</span> /
        {{ rankings.length }} 問正解！！
      </p>
      <p class="text-xs text-black">↓ 結果をTwitterでシェア ↓</p>
      <a
        href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        class="twitter-share-button"
        :data-text="`「${title}」で ${correctCount}/${rankings.length}問 正解しました！
      #2位じゃダメなんですか
      `"
        :data-url="`https://second-place.vercel.app/q/${id}`"
        data-lang="ja"
        >Tweet</a
      >
      <div
        is="script"
        async
        src="https://platform.twitter.com/widgets.js"
        charset="utf-8"
      />
    </template>

    <section
      v-for="(ranking, rankingIndex) in rankings"
      :key="ranking.itemId"
      class="card"
    >
      <h1 class="w-full max-w-sm p-1 rounded-sm bg-gray-200 break-words">
        {{ ranking.title
        }}<span class="text-xs"
          >（正解率：{{
            ranking.correct + ranking.incorrect === 0
              ? 0
              : Math.round(
                  (ranking.correct / (ranking.correct + ranking.incorrect)) *
                    100
                )
          }}%）</span
        >
      </h1>
      <template v-if="answered">
        <p
          v-if="ranking.items[answers[rankingIndex]] === ranking.no2"
          class="text-3xl text-blue-800"
        >
          正解!!
        </p>
        <p v-else class="text-3xl text-red-800">不正解…</p>
      </template>
      <div
        v-if="answered && (ranking.description || ranking.source)"
        class="w-full pt-1 pb-2 px-2 mt-1 border border-gray-400 bg-gray-100 rounded"
      >
        <p class="w-full text-xs font-bold">解説</p>
        <p v-if="ranking.description" class="w-full text-left break-words">
          {{ ranking.description }}
        </p>
        <a
          v-if="ranking.source"
          target="_blank"
          :href="ranking.source"
          class="text-xs text-blue-800 underline"
          >{{ ranking.source }}</a
        >
      </div>
      <div v-for="(item, index) in ranking.items" :key="ranking.itemId + index">
        <label
          class="w-full inline-flex justify-start items-center mt-3 p-2 rounded-md"
          :class="labelClass(rankingIndex, index)"
        >
          <input
            v-model="answers[rankingIndex]"
            type="radio"
            class="form-radio h-5 w-5"
            :class="radioClass(rankingIndex, index)"
            :name="ranking.itemId"
            :value="index"
            :disabled="answered"
          />
          <span class="ml-2 text-gray-700">
            {{ item }}
          </span>
        </label>
      </div>
    </section>
    <a
      v-scroll-to="'#title'"
      role="button"
      class="button--green mt-3"
      @click="result"
    >
      採点する
    </a>
    <n-link to="/list" class="mt-10 text-sm text-blue-800"> 一覧へ戻る </n-link>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

type rankingItem = {
  itemId: string
  title: string
  description: string
  source: string
  correct: number
  incorrect: number
  no1: string
  no2: string
  no3: string
  items: string[]
}
type dataType = {
  id: string
  title: string
  rankings: rankingItem[]
  answers: number[]
  answered: boolean
  correctCount: number
}

export default Vue.extend({
  async asyncData({ app, params, redirect }) {
    const questionRef = app.$firestore.collection('questions').doc(params.id)
    const question = await questionRef.get()
    const rankingRef = questionRef.collection('rankings')
    const rankingSnap = await rankingRef.get()
    if (rankingSnap.empty) redirect('/')
    return {
      id: params.id,
      title: question.data()?.title,
      rankings: rankingSnap.docs.map((doc) => {
        const data = doc.data()
        const baseArr = [1, 2, 3]
        const randArr = [
          baseArr.splice(Math.round(Math.random() * 2), 1)[0],
          baseArr.splice(Math.round(Math.random() * 1), 1)[0],
          baseArr[0],
        ]
        return {
          itemId: doc.id,
          title: data.title,
          description: data.description,
          source: data.source,
          correct: data.correctCount,
          incorrect: data.incorrectCount,
          no1: data.no1,
          no2: data.no2,
          no3: data.no3,
          items: [
            data['no' + randArr[0]],
            data['no' + randArr[1]],
            data['no' + randArr[2]],
          ],
        } as rankingItem
      }),
      answers: Array(rankingSnap.docs.length).fill(0),
    }
  },
  data(): dataType {
    return {
      id: '',
      title: '',
      rankings: [],
      answers: [],
      answered: false,
      correctCount: 0,
    }
  },
  methods: {
    labelClass(rankingIndex: number, itemIndex: number): string[] {
      const ret = []

      if (this.answered) {
        if (
          this.rankings[rankingIndex].no2 ===
          this.rankings[rankingIndex].items[itemIndex]
        ) {
          ret.push('border-2')
          ret.push('border-blue-800')
          ret.push('text-blue-800')
          ret.push('bg-blue-200')
        } else if (itemIndex === this.answers[rankingIndex]) {
          ret.push('border-2')
          ret.push('border-red-800')
          ret.push('text-red-800')
          ret.push('bg-red-200')
        }
      } else if (itemIndex === this.answers[rankingIndex]) {
        ret.push('bg-green-200')
        ret.push('text-green-600')
      }
      return ret
    },
    radioClass(rankingIndex: number, itemIndex: number): string[] {
      const ret = []

      if (this.answered) {
        if (
          this.rankings[rankingIndex].no2 ===
          this.rankings[rankingIndex].items[itemIndex]
        ) {
          ret.push('text-blue-600')
        } else if (itemIndex === this.answers[rankingIndex]) {
          ret.push('text-red-600')
        }
      } else if (itemIndex === this.answers[rankingIndex]) {
        ret.push('text-green-600')
      }
      return ret
    },
    result(): void {
      if (this.answered) return
      const questionRef = this.$firestore.collection('questions').doc(this.id)
      const batch = this.$firestore.batch()
      this.answers.forEach((itemIndex, rankingIndex) => {
        const rankingRef = questionRef
          .collection('rankings')
          .doc(this.rankings[rankingIndex].itemId)
        if (
          this.rankings[rankingIndex].no2 ===
          this.rankings[rankingIndex].items[itemIndex]
        ) {
          batch.update(rankingRef, {
            correctCount: this.$firebase.firestore.FieldValue.increment(1),
            updateAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
          })
          this.correctCount++
        } else {
          batch.update(rankingRef, {
            incorrectCount: this.$firebase.firestore.FieldValue.increment(1),
            updateAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
          })
        }
      })
      batch.commit()
      this.answered = true
    },
  },
})
</script>
<style scoped>
.card {
  @apply flex flex-col w-full max-w-sm mx-auto mt-2 px-5 py-4 border border-gray-200 bg-white shadow;
}
.card-item {
  @apply flex flex-col mb-4;
}
.card-label {
  @apply mb-1 text-left text-xs tracking-wide text-gray-600;
}
</style>
