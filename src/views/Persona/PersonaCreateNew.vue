<template>
  <v-container>
    <v-card>
      <v-card-title>Create new persona</v-card-title>
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
      <v-card-actions>
          <BaseSubmitGroup @close="onCloseCreatePersonaHandler" @submit="onSubmitCreatePersonaHandler"/>
      </v-card-actions>
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
      valid: false,
      name: ''
    }
  },
  validations: {
    name: { required }
  },
  props: ['companyId'],
  methods: {
    onCloseCreatePersonaHandler: function() {
      this.$emit('close', false)
      //Reset validation
      this.$v.$reset()
    },
    onSubmitCreatePersonaHandler: function() {
      //Submit validation
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log(`submitovanje forme ${this.nameErrors}`)
        const notification = {
          type: 'error',
          message: `Error on form : ${this.nameErrors}`
        }
        return store.dispatch('notification/add', notification, { root: true })
      }
      store.dispatch('persona/createNewPersona',this.dataObject)
      this.$emit('close', false)
      //Reset field name
      this.name=''
    }
  },
  computed: {
    ...mapState({ persona: 'persona' }),
    dataObject() {
      return {
        companyId: this.companyId,
        name: this.name,
        companyIdString:`?companyId=${this.companyId}`
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