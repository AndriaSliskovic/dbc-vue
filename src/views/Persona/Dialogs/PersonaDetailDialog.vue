<template>
  <v-container>
    <v-card>
      <template v-if="dialogType==='edit'">
        <v-card-title>Edit {{cField.name}} custom field for {{persona.personaObject.name}} persona</v-card-title>
      </template>
      <template v-if="dialogType==='create'">
        <v-card-title>Create new custom field for {{persona.personaObject.name}} persona</v-card-title>
      </template>
      <v-form ref="form" v-model="valid">
        <v-card-text class="grey lighten-4">
          <v-row>
            <v-col cols="6">
              <v-col>
                <v-text-field
                  v-model="cField.name"
                  :error-messages="nameErrors"
                  label="Name"
                  @input="$v.cField.name.$touch()"
                  @blur="$v.cField.name.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="cField.rank"
                  :error-messages="rankErrors"
                  label="Rank"
                  required
                  type="number"
                  @input="$v.cField.rank.$touch()"
                  @blur="$v.cField.rank.$touch()"
                ></v-text-field>
              </v-col>
              <v-col>
                <!-- CATEGORY DIALOG -->
                <v-dialog v-model="dialogCategory" persistent max-width="800px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" v-on="on">Edit curent category</v-btn>
                  </template>
                  <CategoryDialog :category="cField.category" :name="cField.name" @close="()=>dialogCategory=false" @submit="onSubmitCategory">

                  </CategoryDialog>

                </v-dialog>
                <v-text-field
                  v-model="cField.category.name"
                  :error-messages="categoryErrors"
                  label="Category"
                  required
                  @input="$v.cField.category.name.$touch()"
                  @blur="$v.cField.category.name.$touch()"
                ></v-text-field>
              </v-col>

              <!-- // CATEGORY DIALOG -->
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
                    <v-checkbox v-model="cField.visible" class="mb-n2" label="Visible"></v-checkbox>
                    <v-checkbox v-model="cField.editable" class="mt-n4" label="Editable"></v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <!-- RIGHT DIALOG -->
            <v-col cols="6">
              <PersonaDetailDialogRight
                :selectedType="cField.type"
                @close="val=>$emit('close',val)"
                :cField="cField"
              ></PersonaDetailDialogRight>
            </v-col>
            <!-- / RIGHT DIALOG -->
          </v-row>
        </v-card-text>

        <!-- SUBMIT GROUP -->
        <v-card-actions>
          <v-row justify="center">
            <template v-if="dialogType==='create'">
              <BaseSubmitGroup @close="onCloseDialogHandler" @submit="onSubmitHandler">
                <template v-slot:submit>Submit</template>
              </BaseSubmitGroup>
            </template>
            <template v-if="dialogType==='edit'">
              <BaseSubmitGroup @close="onCloseDialogHandler" @submit="onUpdateHandler">
                <template v-slot:submit>Update</template>
              </BaseSubmitGroup>
            </template>
          </v-row>
        </v-card-actions>
        <!-- / SUBMIT GROUP -->
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
import CategoryDialog from './CategoryDialog'

export default {
  components: {
    PersonaDetailDialogRight,
    CategoryDialog
  },
  mixins: [validationMixin],
  validations: {
    cField: {
      name: { required },
      rank: { required },
      category: { name: { required } }
    }
  },
  data() {
    return {
      dialogCategory: null,
      valid: false,
      fieldtype: ['DROPDOWNLIST', 'IMAGEBANK', 'TEXTAREA', 'TEXTBOX'],
      selectedType: null,
      submitStatus: null
    }
  },
  props: ['cField', 'dialogType'],

  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  beforeDestroy() {
    this.$v.$reset()
  },

  methods: {

    onCloseDialogHandler: function() {
      this.$emit('close', false)
      //Resetovanje prethodne validacije
      this.$v.$reset()
    },
    onSubmitHandler: function({ dispatch }) {
      console.log('on submit')
      //Logika za submitovanje forme
      // console.log(this.cField)
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log(`submitovanje forme ${this.nameErrors}`)
        const notification = {
          type: 'error',
          message: `Error on form : ${this.nameErrors}`
        }
        store.dispatch('notification/add', notification, { root: true })
      }
      console.log(this.cField)
      //Setovanje tag fielda
      if (this.cField.name) {
        this.cField.tag = this.cField.name.trim().replace(/\s/g, '_')
      }

      //Slanje podataka posle validacije
      store.dispatch('persona/createNewCustomField', this.cField)
      // **RESITI NA DRUGI NACIN
      //store.dispatch('notification/reloadPage', {}, { root: true })
      this.$emit('close', false)
    },
    onUpdateHandler() {
      console.log(this.cField)
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log(`editovanje forme ${this.nameErrors}`)
        const notification = {
          type: 'error',
          message: `Error on form : ${this.nameErrors}`
        }
        store.dispatch('notification/add', notification, { root: true })
      }
      //Setovanje tag fielda
      if (this.cField.name) {
        this.cField.tag = this.cField.name.trim().replace(/\s/g, '_')
      }
      //Slanje podataka posle validacije
      store.dispatch('persona/updateCustomField', this.cField)
      store.dispatch('notification/reloadPage', {}, { root: true })
      this.$emit('close', false)
    },
    onSubmitCategory(){
      console.log("submitovana je kategorija")
    },
    resetValidation() {
      console.log(`tag field`, this.cField.tag)

      console.log(`novi tag field`, this.cField.tag)
      this.$v.$reset()
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
    categoryErrors() {
      const errors = []
      if (!this.$v.cField.category.name.$dirty) return errors
      !this.$v.cField.category.name.required &&
        errors.push('Category is required.')
      return errors
    },
    rankErrors() {
      const errors = []
      if (!this.$v.cField.rank.$dirty) return errors
      !this.$v.cField.rank.required && errors.push('Rank is required.')
      return errors
    }
  }
}
</script>