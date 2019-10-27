<template>
  <v-card dark>
    <v-row class="grey darken-2 mx-0 title-page" justify="space-between" align="center">
      <v-col cols="5">
        <v-card-title class="pl-4 title">
          <slot></slot>
        </v-card-title>
      </v-col>
      <v-col cols="6">
        <BaseNotificationContainer />
      </v-col>
      <v-col cols="1">
        <BaseIconClose @close="onCloseDialogHandler"/>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  methods: {
    onCloseDialogHandler() {
      this.$emit('close', false)
    },
  }
}
</script>
    <style scoped>

</style>