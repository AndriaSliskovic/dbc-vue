<template>
<v-dialog v-model="dialog" persistent>
  <v-card>
    <v-card-title class="headline">Delete custom field ?</v-card-title>

    <v-card-text>Are you sure you want to delete this custom field ?</v-card-text>

    <v-card-actions>
      <div class="flex-grow-1"></div>

      <v-btn color="green darken-1" text @click="onCloseDialogHandler">Cancel</v-btn>

      <v-btn color="green darken-1" text @click="onConfirmHandler">Agree</v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return { dialog: false }
  },

  methods: {
    onCloseDialogHandler: function() {
      this.dialog = false
    },
    onConfirmHandler: function() {
      this.dialog = false
    }
  }
}
</script>