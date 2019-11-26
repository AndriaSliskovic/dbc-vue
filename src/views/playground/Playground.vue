<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-card>
              <ImageUpload></ImageUpload>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import ImageUpload from './ImageUpload'

export default {
  components: {
    ImageUpload,
  },

}
</script>