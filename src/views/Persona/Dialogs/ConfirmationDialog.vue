<template>
  <v-card >
    <v-card-title class="headline">
      <h4>
        <slot name="header"></slot>
      </h4>
    </v-card-title>

    <v-card-text>
      <p>
        <slot name="body"></slot>
      </p>
    </v-card-text>

    <v-card-actions>
      <div class="flex-grow-1 "></div>

      <v-btn color="normal" class="red--text text--darken-3" text @click="onCloseDialogHandler">Cancel</v-btn>

      <v-btn color="normal"  class="teal--text text--darken-3" text @click="onSubmitHandler">Confirm</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  data() {
    return { dialog: false }
  },

  methods: {
    onCloseDialogHandler: function() {
      //Zatvaranje dialoga
      this.$emit('close', false)
    },
    onSubmitHandler: function() {
      //Potvrda akcije dialoga
      this.$emit('submit')
      //Zatvaranje dialoga
      this.$emit('close', false)
    }
  }
}
</script>