<template>
  <v-container fluid>
    <v-select
      v-model="mask"
      :items="this.persona.selectedCustomField.dataSource"
      item-text="display"
      item-value="display"
      label="Pick mask"
      outlined
      dense
    ></v-select>
    <v-text-field v-model="defaultValue" label="Default value" required></v-text-field>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
export default {
  data(){
    return {
      mask:null
    }
  },
    computed: {
    ...mapState({ persona: 'persona' }),
    defaultValue: {
      get: function() {
        return this.persona.selectedCustomField.defaultValue
      },
      set: function(newValue) {
        newValue ? this.persona.selectedCustomField.defaultValue : null
      }
    }
  }
}
</script>