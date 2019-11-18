<template>
  <v-card class="mx-auto"  height="270">
    <v-card-title class="py-0 mx-0">
            <template v-if="!uploaded">
      <BaseIconClose @close="onDeleteImage" :small="false" :x_small="true" />
      <span>{{uploaded}}</span>
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
      <template v-if="!uploaded">
        <v-btn block color="blue-grey" dark @click="uploadImage" :disabled="uploaded">
          Upload
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </template>
      <template v-else class="justify-center">
        <v-alert type="success" dense class="pl-0 pb-1 mb-0">Image uploaded</v-alert>
      </template>
    </v-card-actions>
  </v-card>
</template>
<script>
import uploadImageService from '../../services/imagesService'
export default {
  data() {
    return {
      fileName: null,
      uploaded: false
    }
  },
  mounted() {
    console.log(this.index)
    this.getImagePreview()
  },
  updated() {
    console.log('updated', this.file)
    this.getImagePreview()
  },
  props: {
    file: {
      type: File,
      default: null
    },
    index: {
      type: String,
      default: null
    }
  },
  methods: {
    onDeleteImage(key) {
      console.log('image key je :', this.index)
      this.$emit('removeElement', this.index)
    },
    uploadImage() {
      console.log('upload image')
      var form = document.getElementById('form')
      const formData = new FormData(form)
      formData.append('file', this.file)
      this.uploadService(formData)
    },
    uploadService(formData) {
      uploadImageService
        .uploadImage(formData)
        //.then((res)=>console.log("izvsen upload",res.data.fileName))
        .then(res => (this.fileName = res.data.fileName))
        .then(() => (this.uploaded = true))
    },
    getImagePreview() {
      if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
        let reader = new FileReader()
        reader.addEventListener(
          'load',
          function() {
            // this.$refs['image' + parseInt(this.index)].src = reader.result
            this.$refs[this.imageName].src = reader.result
          }.bind(this),
          false
        )
        reader.readAsDataURL(this.file)
      }
    }
  },
  computed:{
    imageName:function(){
      return ('image' + parseInt(this.index))
    }
  },
  watch:{
    index:function(newValue){
      return newValue
    }
  }
}
</script>