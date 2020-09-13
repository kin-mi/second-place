<template>
  <div class="container flex-col items-start">
    <h1 class="title">ランキング登録</h1>

    <input
      id="title"
      v-model="question.title"
      name="title"
      type="text"
      placeholder="タイトル"
      class="form-input mt-3 w-full max-w-sm mx-auto font-bold"
      :required="checked && question.title === ''"
    />
    <template v-for="(ranking, index) in question.rankings">
      <div :key="index" class="card mt-2">
        <div class="card-item">
          <input
            :id="index + 'title'"
            v-model="ranking.title"
            :name="index + 'title'"
            type="text"
            placeholder="ランキングタイトル"
            class="form-input w-full max-w-sm mx-auto"
            :required="checked && ranking.title === ''"
          />
          <input
            :id="index + 'description'"
            v-model="ranking.description"
            :name="index + 'description'"
            type="text"
            placeholder="解説（任意）"
            class="form-input source mt-1 w-full max-w-sm mx-auto"
          />
          <input
            :id="index + 'source'"
            v-model="ranking.source"
            :name="index + 'source'"
            type="text"
            placeholder="ソースURL（任意）"
            class="form-input source mt-1 w-full max-w-sm mx-auto"
          />
        </div>
        <div class="card-item">
          <div class="relative">
            <div class="form-wrapper">
              <div class="form-icon bg-green-600">
                <IconNo1 class="fill-current text-white" />
              </div>
            </div>

            <input
              :id="index + 'No1'"
              v-model="ranking.no1"
              :name="index + 'No1'"
              type="text"
              placeholder="1位"
              class="form-input ranking"
              :required="checked && ranking.no1 === ''"
            />
          </div>
        </div>
        <div class="card-item">
          <div class="relative">
            <div class="form-wrapper">
              <div class="form-icon bg-orange-600">
                <IconNo2 class="fill-current text-white" />
              </div>
            </div>

            <input
              :id="index + 'No2'"
              v-model="ranking.no2"
              :name="index + 'No2'"
              type="text"
              placeholder="2位"
              value=""
              class="form-input ranking"
              :required="checked && ranking.no2 === ''"
            />
          </div>
        </div>
        <div class="card-item">
          <div class="relative">
            <div class="form-wrapper">
              <div class="form-icon bg-green-600">
                <IconNo3 class="fill-current text-white" />
              </div>
            </div>

            <input
              :id="index + 'No3'"
              v-model="ranking.no3"
              :name="index + 'No3'"
              type="text"
              placeholder="3位"
              value=""
              class="form-input ranking"
              :required="checked && ranking.no3 === ''"
            />
          </div>
        </div>
      </div>
    </template>
    <div
      v-if="question.rankings.length < 10"
      class="flex justify-end items-end w-full max-w-sm mx-auto p-4"
    >
      <a
        role="button"
        class="inline-block w-10 h-10 bg-green-600 hover:bg-green-700 text-white text-3xl text-center leading-9 border rounded-full shadow-md"
        @click="addBlankRanking()"
      >
        +
      </a>
    </div>
    <a
      v-if="!processing"
      target="_blank"
      class="button--green"
      :class="question.rankings.length >= 10 ? 'mt-3' : ''"
      @click="register()"
    >
      登録
    </a>
    <div
      v-else
      class="py-3 px-6 w-40 border border-green-700 rounded-md bg-green-700"
      :class="question.rankings.length >= 10 ? 'mt-3' : ''"
    >
      <spinner class="bg-green-800" />
    </div>

    <p v-if="invlid" class="text-base text-red-600">未入力の項目があります</p>
    <template v-if="completed">
      <p class="text-base text-blue-600 font-bold">登録が完了しました</p>
      <p class="text-xs text-black">↓ Twitterでシェア ↓</p>
      <a
        href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        class="twitter-share-button"
        :data-text="`「${shareData.title}」を作成しました!!
      #2位じゃダメなんですか #web1week
      `"
        :data-url="`https://second-place.vercel.app/q/${shareData.id}`"
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
    <n-link to="/" class="mt-10 text-sm text-blue-800"> トップへ戻る </n-link>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { v4 as uuid } from 'uuid'

type dataType = {
  checked: boolean
  invlid: boolean
  processing: boolean
  completed: boolean
  question: question
  shareData: { title: string; id: string }
}

const initialRanking: ranking = {
  id: '',
  title: '',
  description: '',
  source: '',
  no1: '',
  no2: '',
  no3: '',
}

export default Vue.extend({
  data(): dataType {
    return {
      checked: false,
      invlid: false,
      processing: false,
      completed: false,
      question: {
        id: uuid().replace(/-/g, ''),
        title: '',
        rankings: [
          {
            ...initialRanking,
            id: uuid().replace(/-/g, ''),
          },
        ],
      },
      shareData: { id: '', title: '' },
    }
  },
  methods: {
    reset(): void {
      this.question.id = uuid().replace(/-/g, '')
      this.question.title = ''
      this.question.rankings.splice(0, this.question.rankings.length)
      this.addBlankRanking()
    },
    addBlankRanking(): void {
      this.checked = false
      this.question.rankings.push({
        ...initialRanking,
        id: uuid().replace(/-/g, ''),
      })
    },
    async register(): Promise<void> {
      this.invlid = false
      this.completed = false
      this.removeBlankData()
      if (this.validate()) {
        this.processing = true
        await this.registerFirestore().then(() => {
          this.completed = true
          this.shareData.id = this.question.id
          this.shareData.title = this.question.title
          this.reset()
        })
        this.processing = false
      }
    },
    removeBlankData(): void {
      this.question.rankings.forEach((ranking, index) => {
        if (
          ranking.title === '' &&
          ranking.description === '' &&
          ranking.source === '' &&
          ranking.no1 === '' &&
          ranking.no2 === '' &&
          ranking.no3 === ''
        ) {
          this.question.rankings.splice(index, 1)
        }
      })
      if (this.question.rankings.length === 0) this.addBlankRanking()
    },
    validate(): boolean {
      this.checked = true
      this.question.rankings.forEach((ranking) => {
        if (
          ranking.title === '' ||
          ranking.no1 === '' ||
          ranking.no2 === '' ||
          ranking.no3 === ''
        ) {
          this.invlid = true
          return false
        }
      })
      return true
    },
    async registerFirestore(): Promise<void> {
      const batch = this.$firestore.batch()
      const questionRef = this.$firestore
        .collection('questions')
        .doc(this.question.id)
      batch.set(questionRef, {
        title: this.question.title,
        rankingSize: this.question.rankings.length,
        createUserId: this.$auth.currentUser.uid,
        createAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
      })
      this.question.rankings.forEach((ranking) => {
        const rankingRef = questionRef.collection('rankings').doc(ranking.id)
        batch.set(rankingRef, {
          title: ranking.title,
          description: ranking.description,
          source: ranking.source,
          no1: ranking.no1,
          no2: ranking.no2,
          no3: ranking.no3,
          correctCount: 0,
          incorrectCount: 0,
          createAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
        })
      })
      return await batch
        .commit()
        .then(() => {
          return Promise.resolve()
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e)
          throw new Error(e)
        })
    },
  },
})
</script>
<style scoped>
.card {
  @apply flex flex-col w-full max-w-sm mx-auto p-4 border border-gray-200 bg-white shadow;
}
.card-item {
  @apply flex flex-col mb-4;
}
.card-label {
  @apply mb-1 text-left text-xs tracking-wide text-gray-600;
}
.form-wrapper {
  @apply absolute flex border border-transparent left-0 top-0 h-full w-10;
}
.form-icon {
  @apply flex items-center justify-center rounded-tl rounded-bl z-10  text-lg h-full w-full;
}
.form-input {
  @apply text-sm relative w-full border rounded py-2 px-2;
}
.form-input::placeholder {
  @apply text-gray-400;
}
.form-input:focus {
  @apply border-indigo-400 outline-none;
}
.form-input:required {
  @apply border-red-500;
}
.source {
  @apply py-1 px-1 text-xs;
}
.ranking {
  @apply pl-12;
}

@screen sm {
  .card-label {
    @apply text-sm;
  }
  .form-input {
    @apply text-base;
  }
  .source {
    @apply text-xs;
  }
}
</style>
