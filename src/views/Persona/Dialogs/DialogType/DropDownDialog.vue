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
              v-model="cField.defaultValue"
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
  props:{
    cField:{
      type:Object
    }
  },
  beforeCreate() {},
  created() {},
  methods: {
    addItem: function() {
      if (this.itemsData) {
        const arrLength = this.itemsData.length + 1
        const dataSourceObject = {
          display: this.name,
          id: arrLength,
          value:this.name
        }
        store.dispatch('persona/addPersonaDataSourceItem', dataSourceObject)
      } else {
        const dataSourceObject = {
          display: this.name,
          id: 0,
          value:this.name
        }
        store.dispatch('persona/addPersonaDataSourceItem', dataSourceObject)
      }
    },
    setSelectedItem: function(id) {
      const item = this.itemsData.find(function(el) {
        return el.id === id
      })
      this.selectedItem = item
      this.itemIndex = this.findIndexOfSelectedItem(item.id)
      this.disabledButtons(this.itemIndex)
    },
    removeItem: function() {
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
      const curentIndex = this.findIndexOfSelectedItem(this.selectedItem.id)
      const newIndex = curentIndex - 1
      const newItemsDataArray = this.newItemsDataArray(
        this.itemsData,
        curentIndex,
        newIndex
      )
    },
    downDataItem: function() {
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
      if (index === 0 && lastIndex === index) {
        this.disabledAddButton = true
        this.disabledDownButton = true
        this.disabledRemoveButton = false
      } else if (index != 0 && lastIndex != index) {
        this.disabledAddButton = false
        this.disabledDownButton = false
        this.disabledRemoveButton = false
      } else if (lastIndex === index) {
        this.disabledAddButton = false
        this.disabledDownButton = true
        this.disabledRemoveButton = false
      } else if (index === 0) {
        this.disabledAddButton = true
        this.disabledDownButton = false
        this.disabledRemoveButton = false
      } else if (!this.itemsData.length) {
        this.disabledAddButton = true
        this.disabledDownButton = true
        this.disabledRemoveButton = true
      }
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