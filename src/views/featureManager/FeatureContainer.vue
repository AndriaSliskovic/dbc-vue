<template>
  <v-card dark>
    <v-card-title class="grey darken-2 mx-0 title-page">
    <BaseTooltip :large="true" class="mr-2">Select or deselect available features</BaseTooltip>
    Available features :
    </v-card-title>
    <v-card-text>
      <v-row>
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
      features: null
    }
  },
  watch: {},
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
    }
  },
  computed: {
    ...mapState({ feature: 'feature' })
  }
}
</script>