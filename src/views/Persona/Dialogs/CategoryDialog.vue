<template>
  <v-container>
    <v-card>
      <template>
        <BaseCardTitle
          @close="onCloseDialogHandler"
        >Category for Custom field</BaseCardTitle>
      </template>

      <v-card-text>
        <v-col cols="6">
          <v-card-title class="primary white--text my-0 py-1">Edit curent category :</v-card-title>
        </v-col>

        <!-- CATEGORY NAME -->
        <v-col cols="6">
          <v-text-field
            v-model="category.name"
            :error-messages="categoryErrors"
            label="Category name"
            required
            dence
            @input="$v.category.name.$touch()"
            @blur="$v.category.name.$touch()"
          ></v-text-field>
        </v-col>

        <!-- CENTRAL CONTAINER -->
        <v-row>
          <!-- LEFT CONTAINER -->
          <v-col cols="4">
            <!-- ICON -->
            <v-col>
              <v-text-field v-model="category.icon" label="Icon" dense></v-text-field>
            </v-col>
            <v-col>
              <v-row>
                <v-col class="title" cols="8">Icon preview :</v-col>
                <v-col cols="2">
                  <v-icon large outlined>{{category.icon}}</v-icon>
                </v-col>
              </v-row>
            </v-col>

            <!-- SORT ORDER -->
            <v-col cols="5">
              <v-text-field
                v-model="category.sortOrder"
                :error-messages="categorySortOrderErrors"
                label="Sort order"
                type="number"
                required
                @input="$v.category.sortOrder.$touch()"
                @blur="$v.category.sortOrder.$touch()"
              ></v-text-field>
            </v-col>
          </v-col>
          <v-row align="center" justify="center">
            <v-col cols="2" class="display-1 primary--text">
              <p>OR</p>
            </v-col>
          </v-row>

          <!-- CATEGORIES LIST -->
          <v-col cols="6">
            <v-row align="center">
              <v-card class="mx-auto grey lighten-4" max-width="400" tile>
                <v-card-title class="primary white--text my-0 py-1">Select existing category :</v-card-title>
                <v-list dense>
                  <v-list-item-group v-model="itemsData" color="primary">
                    <v-row no-gutters justify="space-around">
                      <v-subheader >Icon</v-subheader>
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

export default {
  data() {
    return {
      tempCategory: {
        type: Object,
        default: null
      }
    }
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
      this.$emit('close', false)
      //Resetovanje prethodne validacije
      this.$v.$reset()
    },
    onSubmitHandler() {
      console.log('on submit')
      this.$emit('submit', false)
      this.$emit('close', false)
    },
    setSelectedItem(catObject) {
      console.log(`name is : ${catObject.name}`)
      const tempCat = this.createSelectedCategoryObject(catObject)
      console.log('temp category :', tempCat)
    },
    createSelectedCategoryObject(obj) {
      this.category.name = obj.name
      this.category.icon = obj.icon
      this.category.sortOrder = obj.sortOrder
      return this.category
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