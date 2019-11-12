<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-card>
          <v-card-title>Playground</v-card-title>
          <v-card-text>

              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <input type="file" @change="onFileChanged" />
                  <v-btn @click="onUpload">Upload!</v-btn> 
                </v-flex>
              </v-layout>

          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card>
          <result></result>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import Result from './Result'

export default {
  components: {
    Result
  },
  data() {
    return {
      selectedFile: null
    }
  },
  methods: {
    onFileChanged(event) {
      console.log(event.target.files[0])
      this.selectedFile = event.target.files[0]
      //const file = event.target.files[0]
    },
    onUpload() {
      const formData = new FormData()
      console.log(this.selectedFile)
      formData.append('fileName', this.selectedFile, this.selectedFile.name)
    const res=formData
    console.log(formData.entries())
      store.dispatch('images/uploadImage',formData)
      //axios.post('my-domain.com/file-upload', formData)
    }
  },
  computed: {
    ...mapState(['images'])
  }
}
</script>