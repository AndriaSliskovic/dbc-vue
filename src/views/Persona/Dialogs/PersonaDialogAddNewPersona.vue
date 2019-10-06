<template>
  <v-container>
    <v-card>
      <v-form v-model="valid">
        <v-col>
          <v-text-field
            v-model="name"
            :error-messages="nameErrors"
            label="Name"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
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
      this.$emit('close', false)
    },
    onSubmitHandler: function() {
      //Validacija pri submitu
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log(`submitovanje forme ${this.nameErrors}`)
        const notification = {
          type: 'error',
          message: `Error on form : ${this.nameErrors}`
        }
        return store.dispatch('notification/add', notification, { root: true })
      }
      //console.log(`submitovanje forme ${this.dataObject}`, this.dataObject)
      store.dispatch('persona/createNewPersona',this.dataObject)
      // this.dialog = false
      this.$emit('close', false)
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