<template>
  <v-card class="mx-auto" height="270">
    <v-card-title class="py-0 mx-1">
            <template v-if="!file.uploaded">
      <BaseIconClose @close="onDeleteImage" :small="false" :x_small="true" />
      <span>{{file.uploaded}}</span>
            </template>
            <template v-else>
        <v-btn block color="normal" dark @click="removeFromServer">
          Remove image
                  </v-btn>
            </template>
    </v-card-title>
    <v-card-text class="justify-center">
      <v-img
        v-bind:ref="imageName"
        aspect-ratio="1"
        max-height="150"
        contain
      />
    </v-card-text class="px-0 py-0">
    <v-card-actions>
      <template v-if="!file.uploaded">
        <v-btn block color="blue-grey" dark @click="uploadImage" :disabled="file.uploaded">
          Upload
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </template>
      <template v-else class="justify-center">
        <v-row justify="center">
        <v-alert type="success" dense class="pb-1 mb-0">Image uploaded</v-alert>
        </v-row>
      </template>
    </v-card-actions>
  </v-card>
</template>
<script>
import uploadImageService from '../../services/imagesService'
export default {
  data() {
    return {
      selectedCard:null,
      fileName: null,
      uploaded: false
    }
  },
    props: {
    file: {
      type: Object,
      default: null
    },

  },
  mounted() {
    console.log(this.file.key)
    this.getImagePreview()

  },
  updated(newValue,oldValue) {
    console.log('updated', this.file,)
    this.getImagePreview()
  },

  methods: {

    onDeleteImage(key) {
      console.log('image key je :', this.file.key)
      this.$emit('removeElement', this.file.key)
    },
    uploadImage() {
      console.log('upload image')
      var form = document.getElementById('form')
      const formData = new FormData(form)
      formData.append('file', this.file.file)
      this.uploadService(formData)
    },
    removeFromServer(){
      console.log("remove from server")
    },
    uploadService(formData) {
      uploadImageService
        .uploadImage(formData)
        //.then((res)=>console.log("izvsen upload",res.data.fileName))
        .then(res => (this.fileName = res.data.fileName))
        .then(() =>this.$emit('uploadedElement', this.file.key) )
    },
    getImagePreview() {
      if (/\.(jpe?g|png|gif)$/i.test(this.file.file.name)) {
        let reader = new FileReader()
        reader.addEventListener(
          'load',
          function() {
            //this.$refs['image' + parseInt(this.file.key)].src = reader.result
            this.$refs[this.imageName].src = reader.result
          }.bind(this),
          false
        )
        reader.readAsDataURL(this.file.file)
      }
    }
  },
  computed:{
    imageName:function(){
      return ('image' + parseInt(this.file.key))
    }
  },

}
</script>