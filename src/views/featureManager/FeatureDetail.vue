<template>
  <div>
    <v-card class="pa-2" outlined>
      <v-card-title>
        <h3>Features</h3>
      </v-card-title>
      <v-card-text>
        <v-layout wrap>
          <v-flex v-for="mod in currentFeatures" xs2>
            <v-checkbox v-model="mod.selected" :label="mod.name" @change="updateModules"></v-checkbox>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import store from '@/store/store'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      availableModules: []
    }
  },
  props: {
    currentFeatures: {
      type: Array
    }
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
<style scoped>
</style>