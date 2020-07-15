<template>
  <div>
    <p>If you have suggestion for this game, please tell me</p>
    <form @submit.prevent="submitSuggestion">
      <input type="textarea" v-model="suggestion" placeholder="write your suggestion here" required/>
    </form>
  </div>
</template>

<script>
export default {
  name: "Suggestion Box",
  data() {
    return {
      suggestion: ""
    }
  },
  methods: {
    submitSuggestion() {
      console.log("suggest", this.suggestion);
    }
  }
}
</script>

<style lang="scss" scoped></style>
