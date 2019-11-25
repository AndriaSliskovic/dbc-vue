<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <v-card>
              <MultipleCards :test='test' :files='cField.files' :dataSource='cField.dataSource'></MultipleCards>
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card>
            <!-- <Result></Result> -->
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import axios from 'axios'
import Result from './Result'
import MultipleCards from './MultipleCards'
import ImageCard from './ImageCard'



export default {
  data(){
    return {
      cField:{
        dataSource:[],
        files:[]
      },
        test:'test komponente'
    }
  },
  components: {
    Result,
    MultipleCards
  },
  computed: {
    ...mapState(['images'])
  }
}
</script>