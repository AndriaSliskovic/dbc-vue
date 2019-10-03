<template>

  <v-card>
    <v-card-title class="headline"><slot name="header"></slot></v-card-title>

    <v-card-text>
      <slot name="body"></slot>
    </v-card-text>

    <v-card-actions>
      <div class="flex-grow-1"></div>

      <v-btn color="green darken-1" text @click="onCloseDialogHandler">Cancel</v-btn>

      <v-btn color="green darken-1" text @click="onSubmitHandler">Confirm</v-btn>
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