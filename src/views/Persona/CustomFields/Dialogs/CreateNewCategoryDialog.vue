<template>
  <v-card>
    <v-card-title>Create new category for persona</v-card-title>
    <!-- EDITED OBJECT -->
    <v-card-text>
      <!-- CATEGORY NAME -->
      <v-col>
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
      <!-- // CATEGORY NAME -->
      <v-row>
        <v-col cols="6">
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
      </v-row>
      <!-- SORT ORDER -->
      <v-row>
        <v-col cols="3">
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
        <v-spacer/>
        <v-col cols="6">
            <v-btn class="ma-2" outlined color="indigo" href="https://fontawesome.com/icons?from=io" target="blank">FA-Icons</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <BasePageFooter>
      <BaseSubmitGroup @close="onCloseDialogHandler" @submit="onSubmitHandler" />
    </BasePageFooter>
  </v-card>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      category: {
        name: null,
        icon: null,
        sortOrder: null
      }
    }
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
      this.$v.$reset()
    },
    onSubmitHandler() {
      this.catSelected = false
      this.$v.$touch()
      if (this.$v.$invalid) {
        const notification = {
          type: 'error',
          message: `Error on form : ${this.nameErrors}`
        }
        return store.dispatch('notification/add', notification, { root: true })
      }
      this.$emit('submit', this.category)
      this.$emit('close', false)
      this.$v.$reset()
    }
  },
  computed: {
    ...mapState({ persona: 'persona' }),
    categoryErrors() {
      const errors = []
      if (!this.$v.category.name.$dirty) return errors
      !this.$v.category.name.required && errors.push('Category is required.')
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