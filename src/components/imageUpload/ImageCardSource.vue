<template>
<v-card class="mx-auto" height="188" color="blue-grey lighten-3">
    <v-card-text class="justify-center py-1" >
      <v-img
        :src="imageSrc"
        lazy-src="https://picsum.photos/id/11/100/60"
        aspect-ratio="1"
        max-height="120"
        contain
      >
      <!-- Placeholder -->
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
        </v-row>
      </template>

      </v-img>
    </v-card-text class="px-0 py-0">
    <v-card-actions>
        <v-btn block color="normal" dark @click="removeFromServer">
          Remove image
        </v-btn>
    </v-card-actions>
</v-card>
</template>
<script>
import uploadImageService from '@/services/imagesService'
import ChipsNotification from '@/components/chips/ChipsNotification'
export default {
  data(){
    return{
      imageDir:'/img/'
    }
  },
     props: {
      image:{
        type:Object,
        default:''
      },

  },
  components:{
    ChipsNotification
  },
  methods:{
    removeFromServer(){
      console.log("remove from element",this.image.id)
      this.$emit('removeElement',this.image.id)
    }
  },
  computed:{
      imageSrc:function(){
      return this.imageDir+this.image.display 
    }
  }


}
</script>