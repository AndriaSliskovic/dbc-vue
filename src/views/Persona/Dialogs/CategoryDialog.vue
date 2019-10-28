<template>
  <v-container>
    <v-card>
      <template>
        <BaseCardTitle @close="onCloseDialogHandler">Category for Custom field</BaseCardTitle>
      </template>

      <v-col cols="6">
        <v-card-title>Current category</v-card-title>
        <!-- category table -->
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
                  <td>{{ category.name }}</td>
                  <td>{{ category.sortOrder }}</td>
                  <td>
                    <template>
                      <v-icon small>{{category.icon}}</v-icon>
                    </template>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <!-- // category table -->
      </v-col>

      <v-col v-if="tempCategory">
        <v-col cols="6">
        <v-card-title>New selected category{{tempCategory.name}}</v-card-title>
        <!-- category table -->
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
                  <td>{{ tempCategory.name }}</td>
                  <td>{{ tempCategory.sortOrder }}</td>
                  <td>
                    <template>
                      <v-icon small>{{tempCategory.icon}}</v-icon>
                    </template>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <!-- // category table -->
      </v-col>
      </v-col>

      <v-card-text>
        <v-row align="center">
          <v-col cols="5">
            <v-dialog
              v-model="dialog.newCategory"
              persistent
              max-width="800px"
              :retain-focus="false"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  depressed
                  color="primary"
                  v-on="on"
                  @click="createNewCategoryObject"
                >Create new category for persona</v-btn>
              </template>
              <CreateNewCategoryDialog
                :category="newCategory"
                @close="()=>dialog.newCategory=false"
                @submit="setNewCategoryObject"
              />
            </v-dialog>
          </v-col>

          <!-- OR DIVIDER -->
          <v-row align="center" justify="center">
            <v-col cols="2" class="display-1 primary--text">
              <p>AND (OR)</p>
            </v-col>
          </v-row>

          <v-col cols="5">
            <!-- CATEGORIES LIST -->
            <v-row align="center">
              <v-card class="mx-auto grey lighten-4" max-width="400" tile>
                <v-card-title class="primary white--text my-0 py-1">Select existing category :</v-card-title>
                <v-list dense>
                  <v-list-item-group v-model="itemsData" color="primary">
                    <v-row no-gutters justify="space-around">
                      <v-subheader>Icon</v-subheader>
                      <v-subheader>Category</v-subheader>
                      <v-subheader>Sort order</v-subheader>
                    </v-row>
                    <v-list-item
                      v-for="(item,index) in itemsData"
                      v-bind:key="index"
                      input-value="true"
                      @click="setSelectedItem(item)"
                    >
                      <v-list-item-icon>
                        <v-icon v-text="item.icon"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-row>
                          <v-col cols="10" align-self="center">
                            <v-list-item-title v-text="item.name"></v-list-item-title>
                          </v-col>
                          <v-col>
                            <v-list-item-title v-text="item.sortOrder"></v-list-item-title>
                          </v-col>
                        </v-row>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="grey darken-2 mx-0 title-page">
        <v-row justify="center">
          <BaseSubmitGroup @close="onCloseDialogHandler" @submit="onSubmitHandler" />
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'
import CreateNewCategoryDialog from './CreateNewCategoryDialog'

export default {
  data() {
    return {
      tempCategory: null,
      newCategory: {
        type: Object,
        default: null
      },
      catSelected: false,
      dialog: {
        newCategory: false
      }
    }
  },
  components: {
    CreateNewCategoryDialog
  },
  props: {
    category: Object,
    name: String
  },
  mixins: [validationMixin],
  validations: {
    category: {
      name: { required },
      sortOrder: { required }
    }
  },
  methods: {
    onCloseDialogHandler() {
      this.catSelected = false
      this.$emit('close', false)
      //Resetovanje prethodne validacije
      this.$v.$reset()
    },
    onSubmitHandler() {
      this.catSelected = false
      console.log('on submit')
      this.category=this.tempCategory
      this.$emit('submit', false)
      this.$emit('close', false)
    },
    createNewCategoryObject() {
      this.newCategory.name = null
      this.newCategory.icon = null
      this.newCategory.sortOrder = null
    },
    setSelectedItem(catObject) {
    this.tempCategory = catObject
    },
    setNewCategoryObject() {
      console.log('nova kategorija')
      store.dispatch('persona/addNewCategory', this.newCategory)
      this.newCategory = null
    },
    createSelectedCategoryObject(obj) {
      this.tempCategory = obj
    }
  },

  computed: {
    ...mapState({ persona: 'persona' }),
    itemsData: {
      get: function() {
        if (this.persona.categories) {
          return this.persona.categories
        }
        //Must be array not null
        return []
      },
      set: function(newValue) {
        newValue ? this.persona.categories : null
      }
    },
    selectedObject(){
      return this.tempCategory
    },
    categoryErrors() {
      const errors = []
      if (!this.$v.category.name.$dirty) return errors
      !this.$v.category.name.required && errors.push('Category is required.')
      return errors
    },
    // categoryIconErrors() {
    //   const errors = []
    //   if (!this.$v.category.icon.$dirty) return errors
    //   !this.$v.category.icon.required &&
    //     errors.push('Icon for category is required.')
    //   return errors
    // },
    categorySortOrderErrors() {
      const errors = []
      if (!this.$v.category.sortOrder.$dirty) return errors
      !this.$v.category.sortOrder.required &&
        errors.push('Sort order number for category is required.')
      return errors
    }
  }
}
</script>