<template>
  <v-card>
    <v-card-title>Features for {{selCompany.CompanyName}}</v-card-title>
    <v-card-text>
      <!-- LISTA -->
      <v-list dense>
        <v-subheader>STATUS</v-subheader>
        <v-list-item-group v-model="currentFeatures" color="primary">
          <v-list-item v-for="item in currentFeatures">
            <v-list-item-content>
              <v-list-item-title v-text="item.selected"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <!-- // LISTA -->
      <v-row >
        <v-col v-for="item in currentFeatures" cols="4">
          <FeatureCard :feature="item" @onChangeSelect="updateModules" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import store from '@/store/store'
import { mapState, mapActions } from 'vuex'
import FeatureCard from './FeatureCard'

export default {
  data() {
    return {
      features:null,
    }
  },
  updated(){
    // console.log("container updated",this.currentFeatures)
    // this.features=this.currentFeatures

  },
  watch: { 

  },
  components: {
    FeatureCard
  },
  props: {
    currentFeatures: {
      type: Array
    },
    selCompany: Object
  },
  methods: {
    checkedModules: function() {
      return this.currentFeatures.filter(e => e.selected).map(e => e.id)
    },
    updateModules: function() {
      store.dispatch('feature/selectedModules', this.checkedModules())
      this.$emit('updateModules', this.checkedModules())
    },
  },
  computed: {
    ...mapState({ feature: 'feature' }),

  }
}
</script>