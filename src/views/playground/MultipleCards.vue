<template>
  <form id="form">
    <v-card-text>
      <!-- Image preview -->
      <v-row v-if="files.length > 0">
        <v-col v-for="(file, key) in files" cols="4" :key="key">
          <ImageCard :file="file" :index="file.tempName" @removeElement="onRemoveHandler"></ImageCard>
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
                v-on:change="handleFilesUpload()"
                style="display:none"
              />
            </template>
            <v-btn color="primary" v-on:click="addFiles()">Pick image</v-btn>
          </v-row>
        </v-card-actions>
      </v-row>
    </v-card-text>
  </form>
</template>

<script>
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
  components: {
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
    addFiles() {
      this.$refs.files.click()
    },
    onRemoveHandler(key) {
      this.files = this.removeImage(this.files, key)
    },
    removeImage(array, key) {
      console.log("element",key)
      return array.filter(el => el.tempName !== key)
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
        //Setting unique key
        uploadedFiles[i].tempName=uploadedFiles[i].lastModified+uploadedFiles[i].name.split('.').slice(0, -1).join('.')
        this.files.push(uploadedFiles[i])
      }
      console.log("image upload",this.files)
    },
    getImagePreviews() {
      console.log('ucitava slike', this.files)
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
          reader.readAsDataURL(this.files[i])
        }
      }
    },
  },
  // watch:{
  //   files:function(val){
  //     console.log('watch new value',val)
  //     return val
  //   }
  // }
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
