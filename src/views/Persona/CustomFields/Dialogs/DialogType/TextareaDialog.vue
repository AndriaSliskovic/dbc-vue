<template>
  <v-container fluid>
    <v-textarea
      v-model="cField.defaultValue"
      label="Default value"
      auto-grow
      required
      outlined
     ></v-textarea>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'

export default {
  props: {
    cField: Object
  },
 
  computed: {
    ...mapState({ persona: 'persona' }),
    defaultValue: {
      get: function() {
        return this.cField.defaultValue
      },
      set: function(newValue) {
        console.log(newValue)
        newValue ? (this.cField.defaultValue = newValue) : null
      }
    },

  }
}
</script>