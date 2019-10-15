<template>
  <v-card>
    <v-card-title class="headline">
        <slot name="header"></slot>
    </v-card-title>
    <v-card-text>
        <slot name="body"></slot>
    </v-card-text>
    <v-card-actions>
        <BaseSubmitGroup @close="onCloseDialogHandler" @submit="onSubmitHandler" />
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  methods: {
    onCloseDialogHandler: function() {
      this.$emit('close', false)
    },
    onSubmitHandler: function() {
      this.$emit('submit')
      this.$emit('close', false)
    }
  }
}
</script>