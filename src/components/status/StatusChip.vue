<template>
  <v-chip @click="setPersonaStatus" :color="statusProp.color" dark>
    <v-avatar>
      <v-icon v-if="active">done</v-icon>
      <v-icon v-else="!active">close</v-icon>
    </v-avatar>
    {{statusProp.text}}
  </v-chip>
</template>
<script>
import { watch } from 'fs'
export default {
  data() {
    return {
      active: this.status,
      statusProperties: {
        active: {
          active: true,
          text: 'Active',
          color: 'primary'
        },
        inactive: {
          active: false,
          text: 'Inactive',
          color: 'blue-grey lighten-1'
        }
      }
    }
  },

  props: {
    status: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    setPersonaStatus() {
      this.active = !this.active
      this.$emit('change', this.active)
    }
  },
//   beforeUpdate() {
//     console.log('beforeUpdated')
//     this.active = this.status
//     console.log('beforeUpdated', this.active)
//   },
//   updated() {
//           console.log('updated')
//       if(this.status!=this.active){
//           console.log("menja se")
//     this.active = this.status
 
//       }
//    console.log('Updated', this.active)

//   },
  computed: {
    statusProp: function() {
      if (this.active) {
        return {
          color: this.statusProperties.active.color,
          text_color: this.statusProperties.active.color,
          text: this.statusProperties.active.text
        }
      } else {
        return {
          color: this.statusProperties.inactive.color,
          text_color: this.statusProperties.inactive.color,
          text: this.statusProperties.inactive.text
        }
      }
    }
  },
  watch:{
      status:function(newValue,oldValue){
        if (newValue != oldValue) {
        console.log('New value: ' + newValue + ', Old value: ' + oldValue)
        return (this.active=newValue)
      }
      }
  }
}
</script>
<style lang="less" scoped>
</style>