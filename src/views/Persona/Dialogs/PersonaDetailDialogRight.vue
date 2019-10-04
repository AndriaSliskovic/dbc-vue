<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-row align="end" justify="center" class="grey lighten-5" style="height: 550px;">
          <v-row align="end">
            <NotificationContainer />
            Container {{selectedType}}
          </v-row>
          <!-- <v-col v-if="selectedType==='IMAGE1'">
              <ImagebankDialog></ImagebankDialog>
          </v-col>-->

          <keep-alive>
            <component v-bind:is="selectedType"></component>
          </keep-alive>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import DropDownDialog from './DialogType/DropDownDialog'
import ImagebankDialog from './DialogType/ImagebankDialog'
import TextareaDialog from './DialogType/TextareaDialog'
import TextBoxDialog from './DialogType/TextBoxDialog'
import NotificationContainer from '../../../components/NotificationContainer'

export default {
  components: {
    DROPDOWNLIST: DropDownDialog,
    IMAGEBANK: ImagebankDialog,
    TEXTAREA: TextareaDialog,
    TEXTBOX: TextBoxDialog,
    NotificationContainer
  },
  props: {
    selectedType: String
  }
}
</script>