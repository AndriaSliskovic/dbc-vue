<template>
  <v-card dark>
    <v-row class="grey darken-2 mx-0 title-page" justify="start">
      
      <v-col cols="6">
        <v-card-title class="pl-2 headline">
          <slot></slot>
        </v-card-title>
      </v-col>
      <v-col cols="6">
        <v-row align="center" justify="end">
          <BaseNotificationContainer />
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>
    <style scoped>
.title-page {
  height: 80px;
}
</style>