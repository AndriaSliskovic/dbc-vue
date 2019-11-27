<template>
  <v-container fluid style="overflow:auto">
      <v-col>
        <UploadedImages :dataSource='cField.dataSource' @removeElement="removeElementFromDataSource"></UploadedImages>
      </v-col>
      <v-col>
        <MultipleCards :cField='cField'></MultipleCards>
      </v-col>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import axios from 'axios'
import MultipleCards from './MultipleCards'
import UploadedImages from './UploadedImages'
export default {
  data(){
    return {
      cField:{
        dataSource:[
          {display:"businessman-310819_1280.png" ,value:"businessman-310819_1280-1.png",id:null},
          {display:"businessman-310819_1280.png" ,value:"businessman-310819_1280-2.png",id:null},
          {display:"panda.jpg" ,value:"panda.jpg",id:null},
          ],
        files:[],
      },
    }
  },
  components: {
    MultipleCards,
    UploadedImages
  },
  methods:{
    removeElementFromDataSource(key){
      this.cField.dataSource=this.cField.dataSource.filter(el=>el.id!==key)
    }
  },
  computed: {
    ...mapState(['images'])
  }
}
</script>