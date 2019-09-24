<template>
  <v-container>
    <v-card>
      <v-form v-model="valid">
        <v-row>
          <v-col cols="6">
            <v-col>
              <v-text-field
                v-model="cField.name"
                :error-messages="nameErrors"
                :counter="25"
                label="Name"
                @input="$v.cField.name.$touch()"
              ></v-text-field>
              <!-- <div>{{$v}}</div> -->
            </v-col>
            <v-col>
              <v-text-field v-model="cField.rank" label="Rank" required></v-text-field>
            </v-col>
            <!-- <v-col>
              <v-text-field v-model="cField.category.name" label="Category" required></v-text-field>
            </v-col> -->
            <v-col>
              <v-text-field v-model="cField.type" label="Custom field type" required></v-text-field>
              <v-select
                v-model="cField.type"
                :items="fieldtype"
                
                menu-props="auto"
                label="Select type"
                hide-details
                single-line
              ></v-select>
            </v-col>
            <v-col>
              <v-row>
                <v-col>
                  <v-radio-group v-model="cField.required" :mandatory="false">
                    <v-radio label="Radio 1" :value="true"></v-radio>
                    <v-radio label="Radio 2" :value="false"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col>
                  <v-checkbox v-model="cField.visible" class="mx-2" label="Visible"></v-checkbox>
                  <v-checkbox v-model="cField.editable" class="mx-2" label="Editable"></v-checkbox>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-btn small text @click="onCloseDialogHandler">Cancel</v-btn>
                <v-btn small color="primary" text @click="onSubmitHandler">Submit</v-btn>
              </v-row>
            </v-col>
          </v-col>
          <v-col cols="6">
            <PersonaDetailDialogRight></PersonaDetailDialogRight>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'
import PersonaDetailDialogRight from './PersonaDetailDialogRight'

export default {
  components:{
    PersonaDetailDialogRight
  },
  mixins: [validationMixin],
  validations: {
    cField: {
      name: { required }
    }
  },
  data() {
    return {
      dialog: null,
      valid: false,
      fieldtype: ['DROPDOWN LIST', 'IMAGE BANK', 'TEXT AREA', 'TEXT BOX'],
      selectedType:null
    }
  },
  props: ['cField'],

  created() {

  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},

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
    ...mapState({ persona: 'persona' }),
    nameErrors() {
      const errors = []
      if (!this.$v.cField.name.$dirty) return errors
      !this.$v.cField.name.maxLength &&
        errors.push('Name must be at most 10 characters long')
      !this.$v.cField.name.required && errors.push('Name is required.')
      return errors
    }
  }
}
</script>