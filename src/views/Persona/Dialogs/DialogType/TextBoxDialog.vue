<template>
    <v-container fluid>
    <h3>Default value :</h3>
    <v-textarea
      name="input-7-1"
      filled
      label="Default value"
      auto-grow
      :value="this.persona.selectedCustomField.defaultValue"
    ></v-textarea>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
export default {
    computed: {
    ...mapState({ persona: 'persona' }),
    }
}
</script>