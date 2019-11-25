<template>
  <v-chip
    v-if="visible"
    class="ma-2"
    small
    :close='close'
    :color="notification.color"
    text-color="white"
    :close-icon="close_icon"
    @click:close="visible=false"
  >
    <v-avatar left>
      <v-icon>{{notification.icon}}</v-icon>
    </v-avatar>
    <slot></slot>
  </v-chip>
</template>
<script>
export default {
  data() {
    return {
      visible: true
    }
  },
  props: {
        type:{
            type:String
        },
        close:{
            type:Boolean,
            default:true
        }
     },
    computed:{
        notification:function(){
        switch (this.type) {
            case 'success':
                return {
                    color:  'teal',
                    icon: 'mdi-checkbox-marked-circle'
                }
                break;
            case 'error':
                return {
                    color:'error',
                    icon: 'mdi-alert-octagon'
                }
                break;
        
            default:
                return {
                    color:  'teal',
                    icon: 'mdi-checkbox-marked-circle'
                }
                break;
        }
    },
    close_icon:function(){
        if (this.close) {
            return "mdi-close"
        }
    }
    }
  
}
</script>