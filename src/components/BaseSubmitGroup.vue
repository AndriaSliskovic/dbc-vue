<template>
<div>
    <v-btn color="normal" class="red--text text--darken-3" text @click="onClose">Cancel</v-btn>
    <v-btn color="normal" class="teal--text text--darken-3" text @click="onSubmit">Confirm</v-btn>
</div>


</template>
<script>
export default {
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