<template>
  <div>
    <v-btn
      color="normal"
      class="red--text text--darken-3"
      text
      @click="onClose"
      v-show="cancelVisible"
    >
      <slot>Cancel</slot>
    </v-btn>
    <v-btn color="normal" class="teal--text text--darken-3" text @click="onSubmit">
      <slot name="submit">Confirm</slot>
    </v-btn>
  </div>
</template>
<script>
export default {
  // data(){
  //   return {
  //     cancelVisible:true
  //   }
  // },
  props: {
    cancelVisible: {
      default: true,
      type: Boolean
    }
  },
  methods: {
    onClose() {
      this.$emit('close', false)
    },
    onSubmit() {
      this.$emit('submit')
      this.$emit('close', false)
    }
  }
}
</script>