<template>
  <form id="form">
    <v-card-text>
      <!-- Image preview -->
      <v-row v-if="files.length > 0">
        <v-col v-for="file in files" cols="4" :key="file.key">
          
          <ImageCardStore :file="file" @removeElement="onRemoveHandler" @uploadedElement="onUploadedHandler"></ImageCardStore>
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
</template>

<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import ImageCardStore from './ImageCardStore'
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
    ImageCardStore
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
      this.files = this.files.filter(el => el.key !== key)
      this.getImagePreviews()
    },
    onUploadedHandler(key){
      console.log("uploaded handler",key)
      const fajl= this.files.filter(e=>e.key===key).map(el=>el.uploaded=true)
    },
    /*
        Handles the uploading of files
      */
    handleUploadPreview() {
      /*
          Get the uploaded files from the input.
        */
      let imageFiles = this.$refs.files.files

      /*
          Adds the uploaded file to the files array
        */
      for (var i = 0; i < imageFiles.length; i++) {
        //Setting unique key
        const imageObject=this.makeImageObject(imageFiles[i])
        this.files.push(imageObject)
        //store.dispatch('images/addToImagesArray', fileObject)
      }
      console.log("image upload",this.files)
    },
    makeImageObject(imageFile){
      const imageObject={
        file:imageFile,
        key:imageFile.lastModified+imageFile.name.split('.').slice(0, -1).join('.'),
        uploaded:false,
        fileName:null
      }
      console.log(imageObject)
      return imageObject
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
  computed:{
        ...mapState(['images']),

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
