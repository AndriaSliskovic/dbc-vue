<template>
  <!-- TOOLTIP -->
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-icon :color='color' dark v-on="on" :large="large">info</v-icon>
    </template>
    <span>
      <slot></slot>
    </span>
  </v-tooltip>
</template>
<script>
export default {
  props: {
      large: {
        default: false,
        type: Boolean
      },
      color:{
        default:"primary",
        type:String
      }
  }
}
</script>