<template>
  <v-container fluid >
    <v-row align="end" justify="end" class="grey lighten-4 ma-0px">
    <v-btn
      fab 
      dark 
      small 
      color="grey darken-3"
      class="mb-2"
      @click="onCloseDialogHandler"
    >
      <v-icon >close</v-icon>
    </v-btn>
    </v-row>
        <v-row align="end" justify="center" class="grey lighten-4" style="height: 550px;">
          <keep-alive >
            <component v-bind:is="selectedType" :cField="cField"></component>
          </keep-alive>
        </v-row>
  </v-container>
</template>
<script>
import DropDownDialog from './DialogType/DropDownDialog'
import ImagebankDialog from './DialogType/ImagebankDialog'
import TextareaDialog from './DialogType/TextareaDialog'
import TextBoxDialog from './DialogType/TextBoxDialog'
import { validationMixin } from 'vuelidate'

export default {
  components: {
    DROPDOWNLIST: DropDownDialog,
    IMAGEBANK: ImagebankDialog,
    TEXTAREA: TextareaDialog,
    TEXTBOX: TextBoxDialog,
  },
    mixins: [validationMixin],
  props: {
    cField:Object,
    selectedType: String
  },
  methods:{
    onCloseDialogHandler: function() {
      console.log(`close icon clicked`)
      this.$emit('close', false)
      //Resetovanje prethodne validacije
      //this.$v.$reset()
    },
  }
}
</script>