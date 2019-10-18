<template>
  <div>
      <v-card @click="onClickHandler" :raised="feature.selected">
        <v-card-title>{{feature.name}}</v-card-title>
        <v-card-text>{{feature.selected}}</v-card-text>
      </v-card>
  </div>
</template>
<script>
import store from '@/store/store'
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    feature: {
      type: Object
    }
  },
  methods: {
      onClickHandler(){
          console.log(`klinuto ${this.feature.id}`,this.feature)
          this.feature.selected=!this.feature.selected
          this.$emit('onChangeSelect', this.feature)
      },

}
}
</script>