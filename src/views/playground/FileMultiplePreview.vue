<template>
  <form id="form">
    <v-card-text>
      <!-- Image preview -->
      <!-- <div class="large-12 medium-12 small-12 cell">
        <div class="grid-x">
          <div v-for="(file, key) in files" class="large-4 medium-4 small-6 cell file-listing">
            {{ file.name }}
            <img class="preview" v-bind:ref="'image'+parseInt( key )" />
          </div>
        </div>
      </div>-->
      <!-- // Image preview -->

      <!-- Image preview -->
      <v-row>
        <template v-for="(file, key) in files">
          <v-col cols="4">
            <v-card max-height="100" max-width="100">
              <v-img height="100" width="100" v-bind:ref="'image'+parseInt( key )">
                <BaseIconClose @close="onCloseHandler(key)" />
              </v-img>
              <!-- <v-card-actions>{{ file.name }}</v-card-actions> -->
            </v-card>
          </v-col>
        </template>
      </v-row>
      <!-- // Image preview -->
      <v-spacer></v-spacer>

      <v-row justify="space-around">
        <v-card-actions>
          <v-col>
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
            <v-btn color="primary" v-on:click="addFiles()">Add Files</v-btn>
          </v-col>
          <v-col class="large-12 medium-12 small-12 cell">
            <v-btn color v-on:click="submitFiles()">Submit</v-btn>
          </v-col>
        </v-card-actions>
      </v-row>
    </v-card-text>
  </form>
</template>

<script>
import axios from 'axios'
export default {
  /*
      Defines the data used by the component
    */
  data() {
    return {
      files: []
    }
  },

  /*
      Defines the method used by the component
    */
  methods: {
    /*
        Adds a file
      */
    addFiles() {
      this.$refs.files.click()
    },

    /*
        Submits files to the server
      */
    submitFiles() {
      /*
          Initialize the form data
        */
      let formData = new FormData()

      /*
          Iteate over any file sent over appending the files
          to the form data.
        */
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i]

        formData.append('files[' + i + ']', file)
      }

      /*
          Make the request to the POST /select-files URL
        */
      axios
        .post(
          'http://app.quadro.local:80/persona/admin/s3/uploadImage',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then(function() {
          console.log('SUCCESS!!')
        })
        .catch(function() {
          console.log('FAILURE!!')
        })
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
        this.files.push(uploadedFiles[i])
      }

      /*
          Generate image previews for the uploaded files
        */
      this.getImagePreviews()
    },

    /*
        Gets the preview image for the file.
      */
    getImagePreviews() {
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

          /*
              Add an event listener for when the file has been loaded
              to update the src on the file preview.
            */
          reader.addEventListener(
            'load',
            function() {
              this.$refs['image' + parseInt(i)][0].src = reader.result
            }.bind(this),
            false
          )
          
          /*
              Read the data for the file in through the reader. When it has
              been loaded, we listen to the event propagated and set the image
              src to what was loaded from the reader.
            */
          reader.readAsDataURL(this.files[i])
        }
      }
    },
    onCloseHandler(key) {
      console.log('close image', key)
      this.files.splice(key, 1)
    },
    removeImage(key) {}
  },
  watch:{
    // files:function(newValue, oldValue){
    //   console.log(newValue)
    //   return newValue
    // }
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