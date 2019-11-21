<template>
  <v-container fluid style="overflow:auto">
        <v-row align="end" justify="center" class="grey lighten-4" style="height: 550px;">
          <keep-alive >
            <component v-bind:is="selectedType" :cField="cField"></component>
          </keep-alive>
        </v-row>
  </v-container>
</template>
<script>
import DropDownDialog from './Dialogs/DialogType/DropDownDialog'
//import ImagebankDialog from './Dialogs/DialogType/ImagebankDialog'
import ImageUpload from '../../../components/imageUpload/MultipleCards'
import TextareaDialog from './Dialogs/DialogType/TextareaDialog'
import TextBoxDialog from './Dialogs/DialogType/TextBoxDialog'
import { validationMixin } from 'vuelidate'

export default {
  components: {
    DROPDOWNLIST: DropDownDialog,
    //IMAGEBANK: ImagebankDialog,
    IMAGEBANK: ImageUpload,
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
    },
  }
}
</script>