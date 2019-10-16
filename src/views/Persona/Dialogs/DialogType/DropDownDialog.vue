<template>
  <v-container>
    <h4>DATA SOURCE</h4>
    <v-row>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row align="baseline">
          <v-col>
            <v-text-field v-model="name" label="Enter a name"></v-text-field>
          </v-col>
          <v-col>
            <v-btn small color="primary" @click="addItem" class="mr-2">Add name</v-btn>
          </v-col>
        </v-row>
        <!-- DATASOURCE LIST - CARD -->
        <v-row v-if="itemsData">
          <v-col>
            <v-card class="mx-auto" max-width="400" tile>
              <v-list dense>
                <v-list-item-group v-model="itemsData" color="primary">
                  <v-list-item v-for="item in itemsData" v-bind:key="item.id" input-value="true">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.display" @click="setSelectedItem(item.id)"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="4" align-self="center">
            <v-row justify="center" dense>
              <v-btn
                small
                color="primary"
                tile
                class="mb-2"
                @click="upDataItem"
                :disabled="disabledAddButton"
              >
              <v-icon >keyboard_arrow_up</v-icon>
              </v-btn>
              <v-btn
                small
                color="primary"
                tile
                @click="removeItem"
                :disabled="disabledRemoveButton"
              >remove</v-btn>
              <v-btn
                small
                color="primary"
                tile
                class="mt-2"
                @click="downDataItem"
                :disabled="disabledDownButton"
              >
              <v-icon>keyboard_arrow_down</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
        <v-col>
            <v-select
              v-model="defaultItemDataValue"
              :items="this.persona.selectedCustomField.dataSource"
              item-text="display"
              item-value="display"
              label="Select default value for data source"
              outlined
              dense
            ></v-select>
        </v-col>
        </v-row>

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
      name: '',
      selectedItem: null,
      itemIndex: null,
      disabledAddButton: true,
      disabledDownButton: true,
      disabledRemoveButton: true,
      defaultItemDataValue:null
    }
  },
  beforeCreate() {},
  created() {},
  methods: {
    addItem: function() {
      if (this.itemsData) {
        console.log('usao if')
        const arrLength = this.itemsData.length + 1
        const dataSourceObject = {
          display: this.name,
          id: arrLength
        }
        console.log(dataSourceObject)
        store.dispatch('persona/addPersonaDataSourceItem', dataSourceObject)
      } else {
        console.log('usao else')
        const dataSourceObject = {
          display: this.name,
          id: 0
        }
        store.dispatch('persona/addPersonaDataSourceItem', dataSourceObject)
      }
    },
    setSelectedItem: function(id) {
      //this.selectedItemId = id
      const item = this.itemsData.find(function(el) {
        return el.id === id
      })
      this.selectedItem = item
      this.itemIndex = this.findIndexOfSelectedItem(item.id)
      console.log(this.selectedItem)
      this.disabledButtons(this.itemIndex)
    },
    removeItem: function() {
      console.log(`removeItem ${this.selectedItem.id}`)
      store.dispatch(
        'persona/removePersonaDataSourceItem',
        this.selectedItem.id
      )
      if (this.itemsData.length===0) {
        this.disabledAddButton = true
        this.disabledDownButton = true
        this.disabledRemoveButton = true
      }
    },
    upDataItem: function() {
      console.log(`up item ${this.selectedItem}`)
      const curentIndex = this.findIndexOfSelectedItem(this.selectedItem.id)
      const newIndex = curentIndex - 1
      const newItemsDataArray = this.newItemsDataArray(
        this.itemsData,
        curentIndex,
        newIndex
      )
      console.log(this.findIndexOfSelectedItem(this.selectedItem.id))
      console.log(newItemsDataArray)
    },
    downDataItem: function() {
      console.log(`Down data item ${this.selectedItem}`)
      const curentIndex = this.findIndexOfSelectedItem(this.selectedItem.id)
      const newIndex = curentIndex + 1
      const newItemsDataArray = this.newItemsDataArray(
        this.itemsData,
        curentIndex,
        newIndex
      )
    },
    newItemsDataArray: function(arr, fromIndex, toIndex) {
      var element = arr[fromIndex]
      arr.splice(fromIndex, 1)
      arr.splice(toIndex, 0, element)
      return arr
    },
    findIndexOfSelectedItem: function(itemId) {
      return this.itemsData.findIndex(x => x.id === itemId)
    },
    disabledButtons: function(index) {
      const lastIndex = this.itemsData.length - 1
      console.log(index, lastIndex)
      if (index === 0 && lastIndex === index) {
        console.log('jedini')
        this.disabledAddButton = true
        this.disabledDownButton = true
        this.disabledRemoveButton = false
      } else if (index != 0 && lastIndex != index) {
        console.log('nije ni prvi ni zadnji')
        this.disabledAddButton = false
        this.disabledDownButton = false
        this.disabledRemoveButton = false
      } else if (lastIndex === index) {
        console.log('zadnji')
        this.disabledAddButton = false
        this.disabledDownButton = true
        this.disabledRemoveButton = false
      } else if (index === 0) {
        console.log('prvi')
        this.disabledAddButton = true
        this.disabledDownButton = false
        this.disabledRemoveButton = false
      } else if (!this.itemsData.length) {
        console.log('nema polja')
        this.disabledAddButton = true
        this.disabledDownButton = true
        this.disabledRemoveButton = true
      }
      // switch (index) {
      //   case 1:
      //     console.log("case jedini element")
      //     this.disabledAddButton=true
      //     this.disabledDownButton=true
      //     break;
      //   case 2:
      //     console.log("case poslednji")
      //     this.disabledAddButton=false
      //     this.disabledDownButton=true
      //     break;
      //   case 3:
      //     console.log(`case remove`)
      //     this.disabledRemoveButton=true
      //     break;
      //   default:
      //     this.disabledAddButton=false
      //     this.disabledDownButton=false
      //     this.disabledRemoveButton=false
      //     console.log("all buttons are enabled")
      //     break;
      // }
    }
  },
  computed: {
    ...mapState({ persona: 'persona' }),
    itemsData: {
      get: function() {
        return this.persona.selectedCustomField.dataSource
      },
      set: function(newValue) {
        newValue ? this.persona.selectedCustomField.dataSource : null
      }
    }
  }
}
</script>