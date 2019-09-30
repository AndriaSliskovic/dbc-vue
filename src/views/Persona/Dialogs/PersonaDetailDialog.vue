<template>
  <v-container>
    <v-card>
      <NotificationContainer />

      <v-form v-model="valid">

        <v-row class="grey lighten-5">

          <v-col cols="6">
            <v-col>
              <v-text-field
                v-model="cField.name"
                :error-messages="nameErrors"
                :counter="25"
                label="Name"
                @input="$v.cField.name.$touch()"
                @blur="$v.cField.name.$touch()"
              ></v-text-field>
              <!-- <div>{{$v}}</div> -->
            </v-col>
            <v-col cols="4">
              <v-text-field v-model="cField.rank" label="Rank" required type="number"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="cField.category" label="Category" required></v-text-field>
            </v-col>
            <v-col>
              <!-- <v-text-field v-model="cField.type" label="Custom field type" required></v-text-field> -->
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
                  <p>{{ 'REQUIRED :' || 'null' }}</p>
                  <v-radio-group v-model="cField.required" :mandatory="false">
                    <v-radio label="Yes" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col>
                  <p>STATUS :</p>
                  <v-checkbox v-model="cField.visible" class="mb-n2" label="Visible" ></v-checkbox>
                  <v-checkbox v-model="cField.editable" class="mt-n4" label="Editable"></v-checkbox>
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
          <!-- RIGHT DIALOG -->
          <v-col cols="6">
            <PersonaDetailDialogRight :selectedType='cField.type'></PersonaDetailDialogRight>
          </v-col>
          <!-- / RIGHT DIALOG -->
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
import NotificationContainer from '../../../components/NotificationContainer'

export default {
  components:{
    PersonaDetailDialogRight,
    NotificationContainer
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
      fieldtype: ['DROPDOWNLIST', 'IMAGEBANK', 'TEXTAREA', 'TEXTBOX'],
      selectedType:null,
      submitStatus: null
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
    onSubmitHandler: function({dispatch}) {
      //Logika za submitovanje forme
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log(`submitovanje forme ${this.nameErrors}`)
        const notification = {
          type: 'error',
          message: `Error on form : ${this.nameErrors}`
        }
        store.dispatch('notification/add', notification, { root: true })

      } else{
        console.log("sve je ok")

      }

      // this.dialog = false
      // this.$emit('closeDialog', this.dialog)
    }
  },
  computed: {
    ...mapState({ persona: 'persona' }),
    nameErrors() {
      const errors = []
      if (!this.$v.cField.name.$dirty) return errors
      !this.$v.cField.name.required && errors.push('Name is required.')
      return errors
    },


  }
}
</script>