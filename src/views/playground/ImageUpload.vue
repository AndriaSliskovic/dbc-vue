<template>
      <v-app id="inspire">
    <v-content>
      <v-container fluid>
          <v-col>
            <v-card>
            <UploadedImages :test='test' :dataSource='cField.dataSource' @removeElement="removeElementFromDataSource"></UploadedImages>
            </v-card>
          </v-col>
                    <v-col>
            <v-card>
              <MultipleCards :cField='cField'></MultipleCards>
            </v-card>
          </v-col>

      </v-container>
    </v-content>
  </v-app>
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
          {display:"businessman-310819_1280.png" ,value:"businessman-310819_1280-3.png",id:null},
          ],
        files:[],
      },
      test:'test komponente'

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