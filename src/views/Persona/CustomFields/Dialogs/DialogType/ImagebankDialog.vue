<template>
  <v-container>
  <v-file-input
    :rules="rules"
    accept="image/png, image/jpeg, image/bmp"
    placeholder="Pick an avatar"
    prepend-icon="mdi-camera"
    label="Avatar"
  ></v-file-input>
  </v-container>
</template>
<script>
export default {
        data: () => ({
      rules: [
        value => !value || value.size < 2000000 || 'Image size should be less than 2 MB!',
      ],
    }),
}
</script>