<template>
  <v-card height="400" width="256" class="mx-auto">
    <v-list-item-content>
      <v-list-item-title class="title">
        <v-icon>mdi-airplay</v-icon>Projects
      </v-list-item-title>
    </v-list-item-content>
    <v-divider />
    <v-list dense nav>
      <v-list-item v-for="item in items" :key="item.id" link @click="clickHandler">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            <router-link :to="{ name: item.route }" exact tag="button">{{item.title}}</router-link>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { leviMenuSettinngs } from '../settings.js'
export default {
  methods: {
    clickHandler(id) {
      console.log(`imam klik na ${id}`)
    }
  },
  data() {
    return {
      items: leviMenuSettinngs
    }
  }
}
</script>

<style>
</style>
