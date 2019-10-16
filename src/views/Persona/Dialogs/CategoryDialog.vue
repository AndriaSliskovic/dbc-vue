<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h3>Category for {{name}} Custom field</h3>
      </v-card-title>
      <!-- CATEGORY NAME -->
      <v-card-text>
        <v-text-field
          v-model="category.name"
          :error-messages="categoryErrors"
          label="Category"
          required
          @input="$v.category.name.$touch()"
          @blur="$v.category.name.$touch()"
        ></v-text-field>
        <!-- ICON -->
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="category.icon"
              :error-messages="categoryIconErrors"
              label="Icon"
              required
              @input="$v.category.icon.$touch()"
              @blur="$v.category.icon.$touch()"
            ></v-text-field>
          </v-col>
          <v-col cols="3" justify="end">
            <v-row>
              <v-col class="text-right title">Icon preview :</v-col>
              <v-col cols="2">
                <v-icon large outlined>{{category.icon}}</v-icon>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- SORT ORDER -->
        <v-row class="mx-auto">
          <v-col cols="2">
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
          <v-spacer />
          <v-col cols="6">
            <v-card class="mx-auto grey lighten-4" max-width="400" tile >
              <v-card-title>Select existing category :</v-card-title>
              <v-list dense>
                <v-list-item-group v-model="itemsData" color="primary">
                  <v-list-item
                    v-for="(item,index) in itemsData"
                    v-bind:key="index"
                    input-value="true"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item" @click="setSelectedItem(key)"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
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
  props: {
    category: Object,
    name: String
  },
  mixins: [validationMixin],
  validations: {
    category: {
      name: { required },
      icon: { required },
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
    setSelectedItem(key) {
      console.log(`key : ${key}`)
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
    categoryIconErrors() {
      const errors = []
      if (!this.$v.category.icon.$dirty) return errors
      !this.$v.category.icon.required &&
        errors.push('Icon for category is required.')
      return errors
    },
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