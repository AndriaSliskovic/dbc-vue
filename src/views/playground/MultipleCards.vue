<template>
  <form id="form">
    <v-card-text>

      <!-- Image preview -->
      <v-row v-if="files.length > 0">
        <v-col v-for="(file, key) in files" cols="4" :key="key">
          <ImageCard :file='file' :br='key'></ImageCard>
        </v-col>
      </v-row>
      <!-- // Image preview -->
      <v-spacer></v-spacer>

      <v-row justify="space-around">
        <v-card-actions>
          <v-col>
            <template>
              <input
                type="file"
                id="files"
                ref="files"
                accept="image/*"
                multiple
                v-on:change="handleFilesUpload()"
                style="display:none"
              />
            </template>
            <v-btn color="primary" v-on:click="addFiles()">Add Files</v-btn>
          </v-col>
          <v-col class="large-12 medium-12 small-12 cell">
            <v-btn color v-on:click="submitFiles()">Submit</v-btn>
          </v-col>
        </v-card-actions>
      </v-row>
    </v-card-text>
  </form>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import ImageCard from './ImageCard'
export default {
  /*
      Defines the data used by the component
    */
  data() {
    return {
      files: [],
      selectedFile: null
    }
  },
  components:{
    ImageCard
  },

  /*
      Defines the method used by the component
    */
  methods: {
    setSelectedFile(key) {
      console.log(key, this.files[key])
      this.selectedFile = this.files[key]
    },
    uploadImage(key) {
      this.selectedFile = this.files[key]
      var form = document.getElementById('form')
      const formData = new FormData(form)
      formData.append('file', this.selectedFile)
      //store.dispatch('images/uploadImage',formData)
      this.uploadService(formData)
      this.getImagePreviews()
    },
    /*
        Adds a file
      */
    addFiles() {
      this.$refs.files.click()
    },
    /*
        Handles the uploading of files
      */
    handleFilesUpload() {
      /*
          Get the uploaded files from the input.
        */
      let uploadedFiles = this.$refs.files.files

      /*
          Adds the uploaded file to the files array
        */
      for (var i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i])
        //store.dispatch('images/addToImagesArray',uploadedFiles[i])
      }

      /*
          Generate image previews for the uploaded files
        */
      //this.getImagePreviews()
    },

    uploadService(formData) {
      var client = function(url) {
        var servis = axios.create({
          baseURL: url,
          withCredentials: false,
          headers: {
            'Content-Type': 'multipart/form-data'
            // 'type': 'image/png'
          },
          timeout: 5000
        })
        return servis
      }

      const apiGatewayUrl = 'https://microapi.fact.deluxebrand.com'
      const apiGatewayClient = client(
        apiGatewayUrl + '/api/admin/s3/uploadImage'
      )
      console.log('servis za upload', formData)
      apiGatewayClient
        .post('', formData)
        .then(res => (this.selectedFile.fileName = res.data.fileName))
        .then(() => (this.selectedFile.status = true))
    }
  },
  
}
</script>

<style>
input[type='file'] {
  position: absolute;
  top: -500px;
}
div.file-listing img {
  max-width: 90%;
}
</style>
