<template>
  <v-card class="mx-auto" height="188">
    <v-card-title class="py-0">

    </v-card-title>
    <v-card-text class="justify-center py-1" >
      <v-img
        :src="image"
        lazy-src="https://picsum.photos/id/11/100/60"
        aspect-ratio="1"
        max-height="120"
        contain
      >
      <template v-if="!notification.type">
      <!-- <template v-if="!file.uploaded"> -->
        <BaseIconClose @close="onDeleteImage" :small="false" :x_small="true" class=""/>
      </template>
            <!-- Error message -->
      <template v-else class="justify-center">
        <v-row justify="center">
        <ChipsNotification :type='notification.type' :close='false'>
          {{notification.msg}}
        </ChipsNotification>
        <!-- <v-alert :type="notification.type" dense class="pb-1 mb-0">{{notification.msg}}</v-alert> -->
        </v-row>
      </template>
      <!-- Placeholder -->
<template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
        </v-row>
      </template>
      </v-img>
    </v-card-text class="px-0 py-0">
    <v-card-actions>
      <!-- <template v-if="!notification.type">      -->
      <template v-if="!file.uploaded">
        <v-btn block color="blue-grey" dark @click="uploadImage" :disabled="file.uploaded">
          Upload
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </template>
      <!-- Server remove -->
      <template v-else>
        <v-btn block color="normal" dark @click="removeFromServer">
          Remove image
        </v-btn>
      </template>
    </v-card-actions>
  </v-card>
</template>
<script>
import uploadImageService from '../../../../services/imagesService'
import ChipsNotification from '../../../../components/chips/ChipsNotification'
export default {
  data() {
    return {
      image:"",
      selectedCard:null,
      fileName: null,
      uploaded: false,
      notification:{
        type:null,
        msg:null
      }
    }
  },
    props: {
    file: {
      type: Object,
      default: null
    },

  },
  components:{
    ChipsNotification
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
        .catch(()=>this.notification=this.getNotification("error"))
        .then(res => (this.file.fileName = res.data.fileName))
        .then(()=>this.notification=this.getNotification("success"))
        .then(() =>this.$emit('uploadedElement', this.file) )
    },
    getImagePreview() {
      if (/\.(jpe?g|png|gif)$/i.test(this.file.file.name)) {
        let reader = new FileReader()
        reader.addEventListener(
          'load',
          function() {
            this.image=reader.result

          }.bind(this),
          false
        )
        reader.readAsDataURL(this.file.file)
      }
    },
    getNotification(type){
      if (type==="success") {
        return {
          type:"success",
          msg:"Uploaded"
        }
      }
      return {
          type:"error",
          msg:"Unsuccessfully"
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