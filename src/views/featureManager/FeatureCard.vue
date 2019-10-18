<template>
  <div>
    <v-card @click="onClickHandler" :raised="feature.selected" :color="cardProps.color" dark>
      <!-- BADGE -->
      <v-badge color="teal" left overlap>
        <template v-slot:badge v-if="feature.selected">
          <v-icon dark>mdi-check</v-icon>
        </template>
      </v-badge>

      <v-card-title>
        <v-row>{{feature.name}}</v-row>
      </v-card-title>
      <v-card-text>{{feature.selected}}</v-card-text>
    </v-card>
  </div>
</template>
<script>
import store from '@/store/store'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      cardStatus: {
        selected: { active: true, color: 'primary' },
        inactive: { active: true, color: 'red' }
      },

      cardProps: {
        color: null,
        dark: false
      },
      dataChange:null
    }
  },
  props: {
    feature: {
      type: Object
    }
  },
  mounted() {
    this.cardProps.color = this.getStatusColor(this.feature.selected)
  },
  beforeUpdate(){
    if (this.dataChange) {
      console.log("before updated")
          this.cardStatus1=this.feature.selected
    }
   

  },
   updated(){
      console.log("updated",this.feature.selected)
    },
  methods: {
    onClickHandler() {
      console.log(`klinuto ${this.feature.id}`, this.feature)
      this.feature.selected = !this.feature.selected
      this.cardProps.color = this.getStatusColor(this.feature.selected)
      this.$emit('onChangeSelect', this.feature)
    },

    getStatusColor(status) {
      if (status) {
        return this.cardStatus.selected.color
      }
      return this.cardStatus.inactive.color
    }
  },
  computed:{
    cardStatus1:{
      get:function(){
        console.log("uzimam vrednost")
        return this.feature.selected
      },
            set: function(newValue) {
              console.log("setujem vrednost")
        newValue ? (this.feature.selected = newValue) : null
      }
    }
  },
    watch: {
    cardStatus1: function(newValue, oldValue) {
      if (newValue != oldValue) {
        console.log('New value: ' + newValue + ', Old value: ' + oldValue)
        return (this.dataChange = true)
      }
    }
  }
}
</script>