<template>
  <v-container>
    <v-card>
      <template>
        <BaseCardTitle @close="onCloseCreatePersonaHandler">Create new persona</BaseCardTitle>
      </template>
      <v-card-text>
        <v-form v-model="valid">
          <v-col cols="6">
            <v-text-field
              v-model="name"
              :error-messages="nameErrors"
              label="Name"
              required
              @input="$v.name.$touch()"
              @blur="$v.name.$touch()"
            ></v-text-field>
          </v-col>
          <v-row>
            <v-col>
              <v-checkbox v-model="allowShare" label="Allow share"></v-checkbox>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="activeLimit" type="number" label="Active limits"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="grey darken-2 mx-0 title-page">
        <v-row justify="center">
          <BaseSubmitGroup
            @close="onCloseCreatePersonaHandler"
            @submit="onSubmitCreatePersonaHandler"
          >
          <template v-slot:submit>Submit</template>
          </BaseSubmitGroup>
        </v-row>
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
      name: '',
      allowShare: false,
      activeLimit: 0
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
      store.dispatch('persona/createNewPersona', this.dataObject)
      this.$v.$reset()
      this.$emit('close', false)
      //Reset field name
      this.name = ''
    }
  },
  computed: {
    ...mapState({ persona: 'persona' }),
    dataObject() {
      return {
        companyId: this.companyId,
        name: this.name,
        allowShare:this.allowShare,
        activeLimit:this.activeLimit,
        companyIdString: `companyId=${this.companyId}`
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