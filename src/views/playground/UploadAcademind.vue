<template>
  <form id="form">
    <v-card-text>
          <v-col>
            <v-row align="end" justify="start">
              <v-col cols="3">
              <v-img
                :src="imagePreview"
                lazy-src="https://picsum.photos/id/11/10/6"
                aspect-ratio="1"
                class="grey lighten-2"
                max-width="150"
                max-height="150"
              ></v-img>
              </v-col>
              <v-col cols="9">
                            <v-card class="mx-auto" max-width="400" tile>
              <v-list dense>
                <v-list-item-group v-model="itemsData" color="primary">
                  <v-list-item v-for="item in itemsData" v-bind:key="item.id" input-value="true">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.display" @click="setSelectedItem(item.id)"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
              </v-col>

            </v-row>
          </v-col>
          <v-row>
            <v-col>
              <input style="display:none" type="file" @change="handleFileUpload" ref="file" />
              <v-btn color="error" @click="$refs.file.click()">Pick image</v-btn>
            </v-col>
            <v-col>
              <v-btn @click="onUpload">Upload!</v-btn>
            </v-col>
          </v-row>
    </v-card-text>
  </form>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      itemsData: [],
      file: '',
      showPreview: false,
      imagePreview: ''
    }
  },
  methods: {
    // onFileChanged(event) {
    //   console.log(event.target.files[0])
    //   // this.selectedFile = event.target.files[0]
    // },
    handleFileUpload() {
      /*
      Set the local file variable to what the user has selected.
    */
      this.file = this.$refs.file.files[0]

      /*
      Initialize a File Reader object
    */
      let reader = new FileReader()

      /*
      Add an event listener to the reader that when the file
      has been loaded, we flag the show preview as true and set the
      image to be what was read from the reader.
    */
      reader.addEventListener(
        'load',
        function() {
          this.showPreview = true
          this.imagePreview = reader.result
        }.bind(this),
        false
      )

      /*
      Check to see if the file is not empty.
    */
      if (this.file) {
        /*
        Ensure the file is an image file.
      */
        if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
          /*
          Fire the readAsDataURL method which will read the file in and
          upon completion fire a 'load' event which we will listen to and
          display the image in the preview.
        */
          reader.readAsDataURL(this.file)
        }
      }
    },
    onUpload() {
      var form = document.getElementById('form')
      const formData = new FormData(form)
      console.log(this.file)
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
      console.log('servis za upload', formData)
      apiGatewayClient.post('', formData).then(res => console.log(res))
    }
  }
}
</script>