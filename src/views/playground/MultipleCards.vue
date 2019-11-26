<template>
  <v-container fluid>
    <v-card>
      <form id="form">
        <!-- <v-card-title>{{cField.files}}</v-card-title> -->
        <v-card-text>
          <!-- Image preview -->
          <v-row v-if="cField.files.length > 0">
            <v-col v-for="file in cField.files" cols="4" :key="file.key">
              <ImageCardBlob
                :file="file"
                @removeElement="onRemoveHandler"
                @uploadedElement="onUploadedHandler"
              ></ImageCardBlob>
            </v-col>
          </v-row>
          <!-- // Image preview -->
          <v-spacer></v-spacer>
          <v-row justify="space-around">
            <v-card-actions>
              <v-row justify="center">
                <template>
                  <input
                    type="file"
                    id="files"
                    ref="files"
                    accept="image/*"
                    multiple
                    v-on:change="handleUploadPreview()"
                    style="display:none"
                  />
                </template>
                <v-btn color="primary" v-on:click="addFiles()">Pick image</v-btn>
              </v-row>
            </v-card-actions>
          </v-row>
        </v-card-text>
      </form>
    </v-card>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import ImageCardBlob from './ImageCardBlob'

export default {
  props: ['cField'],

  components: {
    ImageCardBlob,
   },
  mounted() {
    this.getImagePreviews()
    console.log('mounted', this.cField.files, this.cField.dataSource)
  },
  methods: {
    addFiles() {
      this.$refs.files.click()
    },

    onRemoveHandler(key) {
      this.cField.files = this.cField.files.filter(el => el.key !== key)
      this.getImagePreviews()
    },
    onUploadedHandler(file) {
      console.log('uploaded handler', file.key)
      const fajl = this.cField.files
        .filter(e => e.key === file.key)
        .map(el => (el.uploaded = true))
      this.cField.dataSource.push({
        display: file.fileName,
        value: file.fileName,
        id:file.fileName.split('.').slice(0, -1).join('.')
      })
    },
    /*
        Handles the uploading of files
      */
    handleUploadPreview() {
      /* Get the uploaded files from the input. */
      let imageFiles = this.$refs.files.files

      /* Adds the uploaded file to the files array*/
      for (var i = 0; i < imageFiles.length; i++) {
        const imageObject = this.makeImageObject(imageFiles[i])
        this.cField.files.push(imageObject)
        //store.dispatch('images/addToImagesArray', fileObject)
      }
      console.log('image upload', this.cField.files)
    },
    makeImageObject(imageFile) {
      console.log(imageFile.name)
      const imageObject = {
        file: imageFile,
        //Setting unique key
        key:
          Date.now() +
          imageFile.name
            .split('.')
            .slice(0, -1)
            .join('.'),
        uploaded: false,
        fileName: null
      }
      console.log(imageObject, this)
      return imageObject
    },
    getImagePreviews() {
      /* Get images from server*/
      // if (this.cField.dataSource.length > 0) {
      //   // const path='/personafiles/globalformupload/'
      //   const path = 'img/'
      //   for (let img of this.cField.dataSource) {
      //     const src = path + img.value
      //     let reader = new FileReader()
      //     reader.readAsDataURL(src)
      //   }
      // }
      console.log('ucitava slike', this.cField.files)
      /*
          Iterate over all of the files and generate an image preview for each one.
        */
      for (let i = 0; i < this.cField.files.length; i++) {
        /*
            Ensure the file is an image file
          */
        if (/\.(jpe?g|png|gif)$/i.test(this.cField.files[i].name)) {
          /*
              Create a new FileReader object
            */
          let reader = new FileReader()
          reader.readAsDataURL(this.cField.files[i])
        }
      }
    }
  },
  computed: {
    ...mapState(['images'])
  }
}
</script>

<style>
input[type='file'] {
  position: absolute;
  top: -500px;
}
</style>
