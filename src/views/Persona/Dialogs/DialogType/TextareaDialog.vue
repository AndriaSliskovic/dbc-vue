<template>
  <v-container fluid>
    <v-textarea
      name="input-7-1"
      filled
      label="Default value"
      auto-grow
      :value="this.persona.selectedCustomField.defaultValue"
      required
      :error-messages="defaultValueErrors"
      @input="$v.defaultValue.$touch()"
      @blur="$v.defaultValue.$touch()"
    ></v-textarea>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  validations: {
    defaultValue: { required }
  },
  computed: {
    ...mapState({ persona: 'persona' }),
    defaultValue: {
      get: function() {
        return this.persona.selectedCustomField.defaultValue
      },
      set: function(newValue) {
        console.log(newValue)
        newValue
          ? (this.persona.selectedCustomField.defaultValue = newValue)
          : null
      }
    },
    defaultValueErrors() {
      const errors = []
      if (!this.$v.defaultValue.$dirty) return errors
      !this.$v.defaultValue.required &&
        errors.push('Default value is required.')
      return errors
    }
  }
}
</script>