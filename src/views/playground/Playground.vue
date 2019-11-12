<template>
  <v-container>
    <form id="form">
      <v-row>
        <v-col cols="6">
          <v-card>
            <UploadAcademind></UploadAcademind>
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card>

          </v-card>
        </v-col>
      </v-row>
    </form>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import axios from 'axios'
import Result from './Result'
import ImageUpload from './ImageUpload'
import FileMultiplePreview from './FileMultiplePreview'
import UploadAcademind from './UploadAcademind'


export default {
  components: {
    Result,
    //ImageUpload,
    //FileMultiplePreview,
    UploadAcademind
  },
  data() {
    return {
      selectedFile: null
    }
  },

  computed: {
    ...mapState(['images'])
  }
}
</script>