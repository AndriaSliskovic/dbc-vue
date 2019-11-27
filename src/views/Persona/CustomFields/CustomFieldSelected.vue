<template>
  <v-container fluid>
    <v-card>
      <!-- EDIT -->
      <template v-if="dialogType==='edit'">
        <BaseCardTitle
          @close="onCloseDialogHandler"
        >Edit {{cField.name}} custom field for {{persona.personaObject.name}} persona</BaseCardTitle>
      </template>
      <!-- CREATE -->
      <template v-if="dialogType==='create'">
        <BaseCardTitle
          @close="onCloseDialogHandler"
        >Create new custom field for {{persona.personaObject.name}} persona</BaseCardTitle>
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
                <!-- EDIT CATEGORY -->
                <template v-if="dialogType==='edit'">
                  <v-card class="grey lighten-4">
                    <v-card-title>
                      <v-row justify="center">Curent category</v-row>
                    </v-card-title>
                    <!-- CATEGORY TABLE -->
                    <v-card-text>
                      <v-simple-table dense class="grey lighten-3">
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">Category name</th>
                              <th class="text-left">Sort order</th>
                              <th class="text-left">Icon</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{{ cField.category.name }}</td>
                              <td>{{ cField.category.sortOrder }}</td>
                              <td>
                                <template>
                                  <v-icon small>{{cField.category.icon}}</v-icon>
                                </template>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-card-text>

                    <v-card-actions>
                      <template>
                        <v-dialog
                          v-model="dialog.category"
                          persistent
                          max-width="1200px"
                          :retain-focus="false"
                          @keydown.esc="dialog.category = false"
                        >
                          <template v-slot:activator="{ on }">
                            <v-row justify="center">
                              <v-btn small depressed color="primary" v-on="on">Edit curent category</v-btn>
                            </v-row>
                          </template>
                          <CategoryDialog
                            :category="cField.category"
                            :name="cField.name"
                            @close="()=>dialog.category=false"
                            @submit="onSubmitCategory"
                          ></CategoryDialog>
                        </v-dialog>
                      </template>
                    </v-card-actions>
                  </v-card>
                </template>
                <!-- //CATEGORY TABLE -->
                <!-- CREATE CATEGORY -->
                <template v-if="dialogType==='create'">
                  <v-dialog
                    v-model="dialog.category"
                    persistent
                    max-width="1200px"
                    :retain-focus="false"
                    @keydown.esc="dialog.category = false"
                  >
                    <template v-slot:activator="{ on }">
                      <v-row justify="center" v-if="cField.category.name">
                        <v-btn color="primary" v-on="on">Edit category</v-btn>
                      </v-row>
                      <v-row justify="center" v-else>
                        <v-btn color="primary" v-on="on">Create category</v-btn>
                      </v-row>
                    </template>
                    <CategoryDialog
                      :category="cField.category"
                      :name="cField.name"
                      @close="()=>dialog.category=false"
                      @submit="onSubmitCategory"
                    ></CategoryDialog>
                  </v-dialog>
                </template>
              </v-col>

              <!-- // CATEGORY DIALOG -->
              <v-col>
                <v-row>
                  <BaseTooltip>{{tooltips.selectType}}</BaseTooltip>
                  <v-select
                    v-model="cField.type"
                    :items="fieldtype"
                    menu-props="auto"
                    label="Select type"
                    hide-details
                    single-line
                  ></v-select>
                </v-row>
              </v-col>
              <v-col>
                <v-row>
                  <v-col>
                    <v-row class="mb-n8">
                      <v-col cols="1">
                        <BaseTooltip>{{tooltips.reqiured}}</BaseTooltip>
                      </v-col>
                      <v-col>
                        <p>{{ 'REQUIRED :' || 'null' }}</p>
                      </v-col>
                    </v-row>
                    <v-radio-group v-model="cField.required" :mandatory="false">
                      <v-radio label="Yes" :value="true"></v-radio>
                      <v-radio label="No" :value="false" class="mb-n8"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col>
                    <v-row class="mb-n8">
                      <v-col cols="1">
                        <BaseTooltip>{{tooltips.status}}</BaseTooltip>
                      </v-col>
                      <v-col>
                        <p>STATUS :</p>
                      </v-col>
                    </v-row>
                    <v-checkbox v-model="cField.visible" class="mb-n2" label="Visible"></v-checkbox>
                    <v-checkbox v-model="cField.editable" class="mt-n4 mb-n8" label="Editable"></v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
            </v-col>
            <!-- RIGHT DIALOG -->
            <v-col cols="6">
              <CustomFieldSelectedContainer
                :selectedType="cField.type"
                @close="val=>$emit('close',val)"
                :cField="cField"
              ></CustomFieldSelectedContainer>
            </v-col>
            <!-- / RIGHT DIALOG -->
          </v-row>
        </v-card-text>

        <!-- SUBMIT GROUP -->
        <v-card-actions>
        <BasePageFooter>
          <template v-if="dialogType==='create'">
            <BaseSubmitGroup
              @close="onCloseDialogHandler"
              @submit="onSubmitHandler"
              :closeOnSubmit="closeOnSubmit"
              :disabledSubmit="!valid"
            >
              <template v-slot:submit>Submit</template>
            </BaseSubmitGroup>
          </template>
          <template v-if="dialogType==='edit'">
            <BaseSubmitGroup
              @close="onCloseDialogHandler"
              @submit="onUpdateHandler"
              :closeOnSubmit="closeOnSubmit"
            >
              <template v-slot:submit>Update</template>
            </BaseSubmitGroup>
          </template>
        </BasePageFooter>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'
import CustomFieldSelectedContainer from './CustomFieldSelectedContainer'
import CategoryDialog from './Dialogs/CategoryDialog'

export default {
  components: {
    CustomFieldSelectedContainer,
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
      valid: false,
      fieldtype: ['DROPDOWNLIST', 'IMAGEBANK', 'TEXTAREA', 'TEXTBOX'],
      selectedType: null,
      submitStatus: null,
      closeOnSubmit: false,
      tooltips: {
        selectType: 'Select type of custom field',
        reqiured: 'Is custom field required ?',
        status: 'check status for custom field.'
      },
      dialog: {
        category: false
      }
    }
  },
  props: ['cField', 'dialogType'],

  created() {},
  beforeMount() {
    if (this.cField.type="IMAGE") {
      this.cField.type="IMAGEBANK"
    }
  },
  mounted() {
        console.log("mounted cf create")
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {
    console.log("beforedestroy cf create")
    this.$v.$reset()
  },
  destroyed() {
        console.log("destroy cf create")
    this.valid = false
  },
  methods: {
    onCloseDialogHandler: function() {
      this.$emit('close', false)
      //Resetovanje prethodne validacije
      this.$v.$reset()
    },
    onSubmitHandler: function() {
      console.log('on submit')
      //Submit form logic
      // console.log(this.cField)
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log(`submitovanje forme ${this.categoryErrors}`)
        const notification = {
          type: 'error',
          message: `Error on form : ${this.categoryErrors}`
        }
        console.log('not valid')
        return store.dispatch('notification/add', notification, { root: true })
      }
      console.log('poslati podaci', this.cField)
      //Setting tag field
      if (this.cField.name) {
        this.cField.tag = this.cField.name.trim().replace(/\s/g, '_')
      }
      //Slanje podataka posle validacije
      if (this.cField.type==="IMAGEBANK") {
        console.log("image on submit",this.cField.type)
        this.cField.type="IMAGE"
      }
      store.dispatch('persona/createNewCustomField', this.cField)
      this.$emit('close', false)
    },
    onUpdateHandler() {
      console.log(this.cField)
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log(`edit form error : ${this.nameErrors}`)
        const notification = {
          type: 'error',
          message: `Error on form : ${this.nameErrors}`
        }
        console.log('invalid data')
        return store.dispatch('notification/add', notification, { root: true })
      }
      //Setovanje tag fielda
      if (this.cField.name) {
        this.cField.tag = this.cField.name.trim().replace(/\s/g, '_')
      }
      //Setovanje IMAGE type 
      if (this.cField.type==="IMAGEBANK") {
        console.log("image on update",this.cField.type)
        this.cField.type="IMAGE"
      }
      store.dispatch('persona/updateCustomField', this.cField)
      this.$emit('close', false)
      this.valid = false
    },
  onSubmitCategory(newCategory) {
    console.log('submitovana je kategorija', newCategory)
    this.cField.category = newCategory
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