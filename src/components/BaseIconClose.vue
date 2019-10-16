<template>
  <v-btn fab dark small color="grey darken-3" class="my-2 mr-4" @click="onCloseDialogHandler">
    <v-icon>close</v-icon>
  </v-btn>
</template>
<script>
export default {
  methods: {
    onCloseDialogHandler: function() {
      this.$emit('close', false)
      //Reset validation
      if (this.$v) {
        this.$v.$reset()
      }
    }
  }
}
</script>