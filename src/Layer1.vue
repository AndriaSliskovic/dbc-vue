<template>
  <v-app id="inspire">
    <router-view :key="$route.fullPath" />
    <!-- Event na ikonicu -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <LeftSidebar />
      </v-list>
    </v-navigation-drawer>

    <!-- Gornji Nav bar -->
    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <NavBar />
    </v-app-bar>
    <!-- Content sa ucitavanjem Layera -->
    <v-content>
      <v-container fluid>
        <!-- Slot za Content -->
        <slot />
      </v-container>
    </v-content>
    <!-- Footer -->
    <v-footer color="indigo" app>
      <v-layout justify-center wrap>
        <span class="white--text">&copy; 2019</span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import LeftSidebar from './components/LeftSidebar'
import NavBar from './components/NavBar'
export default {
  props: {
    source: String
  },
  components: {
    LeftSidebar,
    NavBar
  },
  data: () => ({
    drawer: null
  })
}
</script>