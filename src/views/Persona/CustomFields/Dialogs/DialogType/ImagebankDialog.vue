<template>
  <v-container>
    <v-row align="start">
      <v-col cols="4">
        Preview
        </v-col>
    </v-row>
    <v-file-input
      accept="image/png, image/jpeg, image/bmp"
      placeholder="Pick an image"
      prepend-icon="mdi-camera"
      label="Image"
      small-chips
      multiple
      @change="onFileSelected"
      
    ></v-file-input>
    <v-btn @click="onUpload" color="primary">Upload</v-btn>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
export default {
  data (){
    return{
      selectedFile:null
    }
  },
  methods:{
    onFileSelected(event){
      console.log("file is selected",event,event[0])
      this.selectedFile=event[0]
    },
    onUpload(){
      const formData = new FormData()
      formData.append('myFile', this.selectedFile)
  //axios.post('my-domain.com/file-upload', formData)
      console.log(this.selectedFile,formData)
      //store.dispatch('images/uploadImage', this.selectedFile)
    }
  },
  computed:{
        ...mapState(['images']),
  }
  
}
</script>