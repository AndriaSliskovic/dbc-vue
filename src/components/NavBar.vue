<template>
  <div id="nav" class="nav">
    <v-toolbar-title>DBC - VUE</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-toolbar-items>
      <!-- <v-btn text>
        <router-link :to="{ name: 'event-list' }" tag="button">Event list</router-link>
      </v-btn>
      <v-btn text>
        <router-link :to="{ name: 'proba' }" tag="button">Proba statea</router-link>
      </v-btn>
      <v-btn text>
        <router-link :to="{ name: 'tabela' }" tag="button">Tabela</router-link>
      </v-btn> -->
    </v-toolbar-items>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}
.nav > .brand {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.5em;
  color: #39b982;
  text-decoration: none;
}
.nav .nav-item {
  box-sizing: border-box;
  margin: 0 5px;
  color: rgba(0, 0, 0, 0.5);
  text-decoration: none;
}
.nav .nav-item.router-link-exact-active {
  color: #39b982;
  border-bottom: solid 2px #39b982;
}
</style>
