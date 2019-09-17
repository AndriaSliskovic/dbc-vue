<template>
  <v-card>
  <v-form v-model="valid">
    <v-container>
      <v-col cols="12" md="4">
        <v-text-field v-model="cField.name" label="Custom field name" required></v-text-field>
      </v-col>
            <v-col cols="12" md="4">
        <v-text-field v-model="cField.rank" label="Custom field rank" required></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="cField.category" label="Custom field category" required></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field v-model="cField.type" label="Custom field type" required></v-text-field>
      </v-col>

      <v-btn color="green darken-1" text @click="onCloseDialogHandler">Cancel</v-btn>
      <v-btn color="green darken-1" text @click="onSubmitHandler">Submit</v-btn>
    </v-container>
  </v-form>
  </v-card>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
export default {
  data() {
    return {
      dialog: null,
      valid: false
    }
  },
  props: ['cField', 'text'],
  mounted() {},
  beforeMount() {

  },
  methods: {
    onCloseDialogHandler: function() {
      console.log('cancel button')
      this.dialog = false
      this.$emit('closeDialog', this.dialog)
    },
    onSubmitHandler: function() {
      //Logika za submitovanje forme
      console.log('submitovanje forme')
      this.dialog = false
      this.$emit('closeDialog', this.dialog)
    }
  },
  computed: {
    ...mapState({ persona: 'persona' })
  }
}
</script>