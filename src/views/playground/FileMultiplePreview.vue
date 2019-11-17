<template>
  <form id="form">
    <v-card-text>

      <!-- Image preview -->
      <v-row v-if="files.length > 0">
        <v-col v-for="(file, key) in files" cols="4" :key="key">
          <v-card>
            <v-card-title>
              <!-- IF IMAGE IS UPLOADED - BADGE -->
              <BaseIconClose @close="onCloseHandler(key)" :small="false" :x_small="true" />
              <span>{{file.status}}</span>
            </v-card-title>
            <v-card-text>
              <img v-bind:ref="'image' + parseInt(key)" />
            </v-card-text>
            <v-card-actions>
              <v-btn block color="normal" dark @click="uploadImage(key)">Upload</v-btn>
            </v-card-actions>
          </v-card>
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
      this.getImagePreviews()
    },

    /*
        Gets the preview image for the file.
      */
    getImagePreviews() {
      console.log('ucitava slike', this.selectedFile)
      /*
          Iterate over all of the files and generate an image preview for each one.
        */
      for (let i = 0; i < this.files.length; i++) {
        /*
            Ensure the file is an image file
          */
        if (/\.(jpe?g|png|gif)$/i.test(this.files[i].name)) {
          /*
              Create a new FileReader object
            */
          let reader = new FileReader()

          /*
              Add an event listener for when the file has been loaded
              to update the src on the file preview.
            */
          reader.addEventListener(
            'load',
            function() {
              this.$refs['image' + parseInt(i)][0].src = reader.result
            }.bind(this),
            false
          )

          /*
              Read the data for the file in through the reader. When it has
              been loaded, we listen to the event propagated and set the image
              src to what was loaded from the reader.
            */
          if (this.files[i].fileName) {
            this.files[i].status = true
          } else {
            this.files[i].status = false
          }

          reader.readAsDataURL(this.files[i])
        }
      }
    },
    onCloseHandler(key) {
      console.log('close image', key)
      this.selectedFile = this.files[key]
      console.log(this.selectedFile.name)

      //store.dispatch('images/removeImage',key)
      this.files = this.remove(this.files, this.selectedFile)
      this.getImagePreviews()
    },
    remove(array, element) {
      return array.filter(el => el !== element)
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
  computed: {
    ...mapState(['images']),
    items: {
      get() {
        return this.images.images
      }
    },
    status: {
      get() {
        return this.files.status
      },
      set(newValue) {
        this.files.status = newValue
      }
    }
  },
  watch: {
    files: function(newValue, oldValue) {
      for (let x of this.files) {
        if (x.status != newValue.status) {
          return console.log('Promenio se stattus')
        }
      }
      console.log(newValue)
      return newValue
    }
  }
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
