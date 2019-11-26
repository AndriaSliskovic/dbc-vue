<template>
    <v-container>
        <v-card>
            <v-card-title>
                {{test}}
            </v-card-title>
            <v-card-text>
                <v-row>
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
mounted(){
this.createKeyForDataSource()
},
components:{
    ImageCardSource
},
props:['test','dataSource'],
methods:{
    createKeyForDataSource(){
        for (let d of this.dataSource) {
            d.id=d.value.split('.').slice(0, -1).join('.')
        }
    },
    removeElement(key){
        console.log("parent removeElement",key)
        this.$emit('removeElement',key)
        this.dataSource=this.dataSource.filter(el=>el.id!==key)
        console.log(this.dataSource)
    }
},
computed:{

},
    
}
</script>