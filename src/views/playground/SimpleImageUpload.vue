<template>
  <form id="form">
    <v-card-text>
      <v-col>
        <v-row align="end" justify="start">
          <v-col cols="4">
            <v-card class="mx-auto" max-width="344" v-if="showPreview">
              <v-img
                :src="imagePreview"
                lazy-src="https://picsum.photos/id/11/10/6"
                aspect-ratio="1"
                class="grey lighten-2"
                max-width="200"
                max-height="200"
              >
                <!-- IMAGE LOADER -->
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
                <!-- /IMAGE LOADER -->
              </v-img>
              <v-card-actions>
                <template v-if="disableUpload">
                  <v-alert type="success" dense class="pl-0 pb-1 mb-0">Image uploaded</v-alert>
                </template>
                <template v-else>
                  <v-btn block color="blue-grey" dark @click="onUpload" :disabled="disableUpload">
                    Upload
                    <v-icon right dark>mdi-cloud-upload</v-icon>
                  </v-btn>
                </template>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="8" v-if="itemsData.length>0">
            <v-card class="mx-auto" max-width="300" tile>
              <v-list dense>
                <v-list-item-group color="primary">
                  <v-list-item v-for="(item, i) in itemsData" :key="i">
                    <v-list-item-content>
                      <v-list-item-title v-text="item"></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-btn
                        fab
                        dark
                        x-small
                        color="grey darken-3"
                        class="my-2 mr-4"
                        @click="onDeleteHandler(i)"
                      >
                        <v-icon>close</v-icon>
                      </v-btn>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-card-text>
    <v-card-actions class="pt-0">
      <v-row justify="start" class="pl-3">
        <input style="display:none" type="file" @change="handleFileUpload" ref="file" />
        <v-btn color="primary" @click="$refs.file.click()">Pick image</v-btn>
      </v-row>
    </v-card-actions>
  </form>
</template>
<script>
import axios from 'axios'
import uploadImageService from '../../services/imagesService'
export default {
  data() {
    return {
      itemsData: [],
      file: '',
      showPreview: false,
      imagePreview: '',
      selectedFile: null,
      disableUpload: true
    }
  },
  methods: {
    onDeleteHandler(key) {
      console.log('close image', key)
      this.itemsData.splice(key, 1)
      this.showPreview = false
    },
    handleFileUpload() {
       this.file = this.$refs.file.files[0]
      let reader = new FileReader()
      reader.addEventListener(
        'load',
        function() {
          this.showPreview = true
          this.imagePreview = reader.result
        }.bind(this),
        false
      )
      if (this.file) {
         if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
          reader.readAsDataURL(this.file)
        }
      }
      this.disableUpload = false
    },
    onUpload() {
      var form = document.getElementById('form')
      const formData = new FormData(form)
      console.log(this.file)
      formData.append('file', this.file)
      this.uploadService(formData)
      this.disableUpload = true
      //this.itemsData.push(this.fileName)
    },

    uploadService(formData) {
      uploadImageService
        .uploadImage(formData)
        .then(res => {this.itemsData.push(res.data.fileName)})
    }
  }
}
</script>