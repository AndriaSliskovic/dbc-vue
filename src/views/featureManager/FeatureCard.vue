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
        <v-row justify="center" class="title">{{feature.name}}</v-row>
      </v-card-title>
      <v-card-text>

        <v-row justify="start" class="caption font-italic text-lowercase pl-1" text-transform: none>{{feature.description}}</v-row>
        <!-- <p>{{feature.selected}}</p> -->
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
      cardStatus: {
        selected: { active: true, color: 'primary' },
        inactive: { active: true, color: 'blue-grey darken-1' }
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
    },
    selectedCard:{
      type:Boolean
    }
  },
  mounted() {
    this.cardProps.color = this.getStatusColor(this.feature.selected)
  },
  methods: {
    onClickHandler() {
      this.feature.selected = !this.feature.selected
      this.cardProps.color = this.getStatusColor(this.feature.selected)
      this.$emit('onChangeSelect', this.feature)
    },

    getStatusColor(status) {
      console.log("status is :",status)
      if (status) {
        return this.cardStatus.selected.color
      }
      return this.cardStatus.inactive.color
    }
  },
  computed:{

  },
  watch:{
    selectedCard:function(){
      this.cardProps.color = this.getStatusColor(this.feature.selected)
    }
  }

}
</script>