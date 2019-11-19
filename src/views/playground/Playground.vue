<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <v-card>
              <MultipleCards></MultipleCards>
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card>
              <MultipleCardsWithStore></MultipleCardsWithStore>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import axios from 'axios'
import Result from './Result'
import ImageUpload from './ImageUpload'
import FileMultiplePreview from './FileMultiplePreview'
import UploadAcademind from './UploadAcademind'
import SimpleImageUpload from './SimpleImageUpload'
import MultipleCards from './MultipleCards'
import MultipleCardsWithStore from './MultipleCardsWithStore'


export default {
  components: {
    Result,
    //ImageUpload,
    FileMultiplePreview,
    Result,
    SimpleImageUpload,
    MultipleCards,
    MultipleCardsWithStore
  },
  data() {
    return {}
  },

  computed: {
    ...mapState(['images'])
  }
}
</script>