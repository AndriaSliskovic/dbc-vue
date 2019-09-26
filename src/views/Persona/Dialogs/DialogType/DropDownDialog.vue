<template>
  <v-container>
    <v-row>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row align="baseline">
          <v-col cols="6">
            <v-text-field v-model="name" label="Enter a name"></v-text-field>
          </v-col>
          <v-col>
            <v-btn small color="primary" @click="addItem" class="mr-2">Add</v-btn>
            <v-btn small color="primary" @click="removeItem">remove</v-btn>
          </v-col>
        </v-row>
        <!-- DATASOURCE LIST - CARD -->
        <v-col>
          <v-card class="mx-auto" max-width="300" tile>
            <v-list>
              <v-list-item-group
                v-model="this.dataSource"
                color="primary"
              >
                <v-list-item
                  v-for="(item, i) in this.dataSource"
                  :key="i"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.display" @click="removeItem" :key="item.id"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
      </v-form>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
export default {
  data() {
    return {
      valid: true,
      name: ''
      //dataSource: null
    }
  },
  mounted() {
    console.log(`dialog selektovan CF ${this.persona.selectedCustomField}`)
  },
  methods: {
    addItem: function() {
      const arrLength = this.persona.selectedCustomField.dataSource.length + 1
      const dataSourceObject = {
        display: this.name,
        id: arrLength
      }
      store.dispatch('persona/addPersonaDataSourceItem', dataSourceObject)
    },
    removeItem:function(){
      return console.log(`removeItem `)
    }
  },
  computed: {
    ...mapState({ persona: 'persona' }),
    dataSource: function() {
      return this.persona.selectedCustomField.dataSource
    },
    // selectedItem:function(id){
    //   return id
    // }
  }
}
</script>