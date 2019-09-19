<template>
  <v-card>
  <v-form v-model="valid">
    <v-container>
      <v-col cols="12" md="6">
        <v-text-field 
        v-model="cField.name"
        :error-messages="nameErrors"
        :counter="25"
        label="Name"
        @input="$v.cField.name.$touch()"

        ></v-text-field>
        <!-- <div>{{$v}}</div> -->
      </v-col>
            <v-col cols="12" md="6">
        <v-text-field v-model="cField.rank" label="Rank" required></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="cField.category" label="Category" required></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="cField.type" label="Custom field type" required></v-text-field>
      </v-col>

      <v-btn color="green darken-1" text @click="onCloseDialogHandler">Cancel</v-btn>
      <v-btn color="green darken-1" text @click="onSubmitHandler">Submit</v-btn>
    </v-container>
  </v-form>
  </v-card>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'



export default {
  mixins: [validationMixin],
  validations: {
      cField: {
        name:{ required, maxLength: maxLength(25) }
      }
      
    },
  data() {
    return {
      dialog: null,
      valid: false,
    }
  },
   props: 
   ['cField'],
   
  created(){
 
  },
    beforeMount() {

  },
  mounted() {

  },
  beforeUpdate(){

  },

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
    nameErrors () {
        const errors = []
        if (!this.$v.cField.name.$dirty) return errors
        !this.$v.cField.name.maxLength && errors.push('Name must be at most 10 characters long')
        !this.$v.cField.name.required && errors.push('Name is required.')
        return errors
      },
  }
}
</script>