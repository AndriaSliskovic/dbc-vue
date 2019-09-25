<template>
  <v-container>
    <v-row>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row align="baseline">
          <v-col cols="6">
            <v-text-field v-model="name" label="Enter a name"></v-text-field>
          </v-col>
          <v-col>
            <v-btn small color="primary" @click="addCustomField">Add</v-btn>
          </v-col>
          <v-col>
            <v-btn small color="primary">remove</v-btn>
          </v-col>
        </v-row>
        <v-col>
          <!-- {{dataSource}} -->
          <ul>
            <li v-for="field in this.persona.selectedCustomField.dataSource">{{field.display}}</li>
          </ul>
        </v-col>
      </v-form>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
export default {
  data() {
    return {
      valid: true,
      name: '',
      dataSource: null
    }
  },
  mounted() {
    console.log(`dialog selektovan CF ${this.persona.selectedCustomField}`)
  },
  methods: {
    addCustomField: function() {
        store.dispatch('persona/addPersonaDataSourceItem', this.name)
        console.log("kliknuto add")
    }
  },
  computed: {
    ...mapState({ persona: 'persona' })
  }
}
</script>