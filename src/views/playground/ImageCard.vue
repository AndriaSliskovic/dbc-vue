<template>
  <v-card>
    <v-card-title>
      <BaseIconClose @close="onCloseHandler(br)" :small="false" :x_small="true" />
      <span>{{uploaded}}</span>
    </v-card-title>
    <v-card-text>
      <img v-bind:ref="'image' + parseInt(br)" />
    </v-card-text>
    <v-card-actions>
      <v-btn block color="normal" dark @click="uploadImage">Upload</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import axios from 'axios'
export default {
    data(){
        return {
            fileName:null,
            uploaded:false
        }
    },
    mounted(){
        console.log(this.br)
        this.getImagePreview()
    },
    props:{
        file:{
            type:File,
            default:null
        },
        br:{
            type:Number,
            default:null
        }
    },
    methods:{
        onCloseHandler(key){
            console.log("key je :",key)
        },
        uploadImage(){
            console.log("upload image")
            var form = document.getElementById('form')
            const formData = new FormData(form)
            formData.append('file', this.file)
            this.uploadService(formData)
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
      apiGatewayClient
        .post('', formData)
        .then(res => (this.fileName = res.data.fileName))
        .then(() => (this.uploaded = true))
    },
    getImagePreview() {
        if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
          let reader = new FileReader()
          reader.addEventListener(
            'load',
            function() {
              this.$refs['image' + parseInt(this.br)].src = reader.result
            }.bind(this),
            false
          )
          reader.readAsDataURL(this.file)
        }
    },

    }
}
</script>