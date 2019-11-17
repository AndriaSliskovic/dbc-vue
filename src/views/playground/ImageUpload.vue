<template>
  <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <label>
        File Preview
        <input
          type="file"
          id="file"
          ref="file"
          accept="image/*"
          v-on:change="handleFileUpload()"
        />
      </label>
      <img v-bind:src="imagePreview" v-show="showPreview" />
      <button v-on:click="submitFile()">Submit</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      file: '',
      showPreview: false,
      imagePreview: ''
    }
  },
  methods: {
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
    submitFile() {
      /*
    Initialize the form data
  */
      let formData = new FormData()

      /*
    Add the form data we need to submit
  */
      formData.append('file', this.file)
      console.log('submit', formData)
      /*
    Make the request to the POST /single-file URL
  */
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
      apiGatewayClient
        .post('', formData)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }
}
</script>