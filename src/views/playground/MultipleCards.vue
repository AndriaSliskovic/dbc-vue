<template>
  <v-container fluid >


  <v-card>
  <form id="form">
    <!-- <v-card-title>{{cField.files}}</v-card-title> -->
    <v-card-text>
      <!-- Image preview -->
      <v-row v-if="files.length > 0">
        <v-col v-for="file in files" cols="4" :key="file.key">          
          <ImageCard :file="file" @removeElement="onRemoveHandler" @uploadedElement="onUploadedHandler"></ImageCard>
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
import ImageCard from './ImageCard'
export default {

  props:['files','dataSource'],

  components: {
    ImageCard
  },
  mounted(){

    console.log("mounted",this.files,this.dataSource)
  },
  methods: {
    addFiles() {
      this.$refs.files.click()
    },

    onRemoveHandler(key) {
      this.files = this.files.filter(el => el.key !== key)
      this.getImagePreviews()
    },
    onUploadedHandler(file){
      console.log("uploaded handler",file.key)
      const fajl= this.files.filter(e=>e.key===file.key).map(el=>el.uploaded=true)
      this.dataSource.push({display:file.fileName,value:file.fileName})
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
        const imageObject=this.makeImageObject(imageFiles[i])
        this.files.push(imageObject)
        //store.dispatch('images/addToImagesArray', fileObject)
      }
      console.log("image upload",this.files)
    },
    makeImageObject(imageFile){
      console.log(imageFile.name)
      const imageObject={
        file:imageFile,
        //Setting unique key
        key:Date.now()+imageFile.name.split('.').slice(0, -1).join('.'),
        uploaded:false,
        fileName:null
      }
      console.log(imageObject,this)
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

</style>
