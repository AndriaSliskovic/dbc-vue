<template>
  <v-container fluid>
    <v-card class="grey lighten-4">
    <v-select
      v-model="maskId"
      :items="this.persona.masks"
      item-text="Value"
      item-value="Id"
      label="Pick mask"
      persistent-hint
      outlined
      dense
    ></v-select>
    <v-text-field
      v-model="cField.defaultValue"
      label="Default value"
      required
      :error-messages="defaultValueErrors"
      @input="$v.defaultValue.$touch()"
      @blur="$v.defaultValue.$touch()"
    ></v-text-field>
    </v-card>

  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default {
  data() {
    return {}
  },
    props: {
    cField:Object,
  },
  validations: {
    defaultValue: { required }
  },
  computed: {
    ...mapState({ persona: 'persona' }),
    defaultValue: {
      get: function() {
        return this.cField.defaultValue
      },
      set: function(newValue) {
        console.log(newValue)
        newValue
          ? (this.cField.defaultValue = newValue)
          : null
      }
    },
    maskId: {
      get: function() {
        return this.persona.selectedCustomField.maskId
      },
      set: function(nV) {
        nV ? (this.persona.selectedCustomField.maskId = nV) : null
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