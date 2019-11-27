<template>
    <v-container>
        <v-card>
            <v-card-title>
                {{title}}
            </v-card-title>
            <v-card-text>
                <v-row style="overflow:auto; height: 188px;">
                    <v-col cols="4" v-for="image in dataSource" :key="image.id">
                        <ImageCardSource :image='image' @removeElement="removeElement"></ImageCardSource>
                    </v-col>
                </v-row>

            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import ImageCardSource from './ImageCardSource'

export default {
data(){
    return{title:"Uploaded images :"}
},    
mounted(){
this.createKeyForDataSource()
},
components:{
    ImageCardSource
},
props:['dataSource'],
methods:{
    createKeyForDataSource(){
        for (let d of this.dataSource) {
            d.id=d.value.split('.').slice(0, -1).join('.')
        }
    },
    removeElement(key){
        console.log("parent removeElement",key)
        this.$emit('removeElement',key)
    }
},
    
}
</script>