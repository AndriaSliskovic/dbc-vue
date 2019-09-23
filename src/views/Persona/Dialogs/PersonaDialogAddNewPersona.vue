<template>
  <v-container>
    <v-card>
      <v-form v-model="valid">
        <v-col>
          <v-text-field
            v-model="name"
            :error-messages="nameErrors"
            :counter="25"
            label="Name"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
          <p>{{companyId}}</p>
        </v-col>
      </v-form>
      <v-col>
        <v-row>
          <v-btn small text @click="onCloseDialogHandler">Cancel</v-btn>
          <v-btn small color="primary" text @click="onSubmitHandler">Submit</v-btn>
        </v-row>
      </v-col>
    </v-card>
  </v-container>
</template>
<script>
import NProgress from 'nprogress'
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      dialog: null,
      valid: false,
      name: ''
    }
  },
  validations: {
    name: { required }
  },
  props: ['companyId'],
  methods: {
    onCloseDialogHandler: function() {
      console.log('cancel button')
      this.dialog = false
      this.$emit('closeDialog', this.dialog)
    },
    onSubmitHandler: function() {
      //Logika za submitovanje forme

      //console.log(`submitovanje forme ${this.dataObject}`, this.dataObject)
      store.dispatch('persona/createNewPersona',this.dataObject)
      this.dialog = false
      this.$emit('closeDialog', this.dialog)
    }
  },
  computed: {
    ...mapState({ persona: 'persona' }),
    dataObject() {
      return {
        companyId: this.companyId,
        name: this.name
      }
    },
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    }
  }
}
</script>
<style scoped>
</style>