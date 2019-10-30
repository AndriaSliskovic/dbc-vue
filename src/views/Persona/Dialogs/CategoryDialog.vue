<template>
  <v-container>
    <v-card>
      <template>
        <BaseCardTitle @close="onCloseDialogHandler">Category for Custom field</BaseCardTitle>
      </template>

      <v-col cols="6">
        <v-card-title>
        <BaseTooltip>{{tooltips.currentCategory}}</BaseTooltip>
          Current category:
        </v-card-title>
        <!-- category table -->
        <v-card-text>
          <v-simple-table dense class="red lighten-1">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Category name</th>
                  <th class="text-left">Sort order</th>
                  <th class="text-left">Icon</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ category.name }}</td>
                  <td>{{ category.sortOrder }}</td>
                  <td>
                    <template>
                      <v-icon small>{{category.icon}}</v-icon>
                    </template>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <!-- // category table -->
      </v-col>

      <v-col v-if="tempCategory" cols="6">
        <v-card-title>
        <BaseTooltip>{{tooltips.newSelectedCategory}}</BaseTooltip>        
        New selected category :
        </v-card-title>
        <!-- new category table -->
        <v-card-text>
          <v-simple-table dense class="blue lighten-1">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Category name</th>
                  <th class="text-left">Sort order</th>
                  <th class="text-left">Icon</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ tempCategory.name }}</td>
                  <td>{{ tempCategory.sortOrder }}</td>
                  <td>
                    <template>
                      <v-icon small>{{tempCategory.icon}}</v-icon>
                    </template>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <!-- // category table -->
      </v-col>

      <v-card-text>
        <v-row align="center">
          <v-col cols="5">
            <v-dialog
              v-model="dialog.newCategory"
              persistent
              max-width="800px"
              :retain-focus="false"
            >
              <template v-slot:activator="{ on }">
                <BaseTooltip  >{{tooltips.createNewCategory}}</BaseTooltip>
                <v-btn depressed color="primary" v-on="on">Create new category for persona</v-btn>
              </template>
              <CreateNewCategoryDialog
                @close="()=>dialog.newCategory=false"
                @submit="setNewCategoryObject"
              />
            </v-dialog>
          </v-col>

          <!-- OR DIVIDER -->
          <v-row align="center" justify="center">
            <v-col cols="2" class="display-1 primary--text">
              <p>AND (OR)</p>
            </v-col>
          </v-row>

          <v-col cols="5">
            <!-- CATEGORIES LIST -->
            <v-row align="center">
              <v-card class="mx-auto grey lighten-4" max-width="400" tile>
                <v-card-title class="primary white--text my-0 py-1">
                <BaseTooltip color="normal">{{tooltips.listOfCategories}}</BaseTooltip>
                Select existing category :
                </v-card-title>
                <v-list dense>
                  <v-list-item-group v-model="itemsData" color="primary">
                    <v-row no-gutters justify="space-around">
                      <v-subheader>Icon</v-subheader>
                      <v-subheader>Category</v-subheader>
                      <v-subheader>Sort order</v-subheader>
                    </v-row>
                    <v-list-item
                      v-for="(item,index) in itemsData"
                      v-bind:key="index"
                      input-value="true"
                      @click="setSelectedItem(item)"
                    >
                      <v-list-item-icon>
                        <v-icon v-text="item.icon"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-row>
                          <v-col cols="10" align-self="center">
                            <v-list-item-title v-text="item.name"></v-list-item-title>
                          </v-col>
                          <v-col>
                            <v-list-item-title v-text="item.sortOrder"></v-list-item-title>
                          </v-col>
                        </v-row>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <!-- SUBMIT GROUP -->
      <BasePageFooter>
        <BaseSubmitGroup @close="onCloseDialogHandler" @submit="onSubmitHandler" />
      </BasePageFooter>
    </v-card>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import CreateNewCategoryDialog from './CreateNewCategoryDialog'

export default {
  data() {
    return {
      tempCategory: null,
      dialog: {
        newCategory: false
      },
      tooltips: {
        currentCategory: 'Click on cancel to save previus current category',
        newSelectedCategory:'Choose submit to save selected category',
        createNewCategory:'Click on button to create new category for selected custom field',
        listOfCategories:'Select category from list and hit confirm to save changes'
      }
    }
  },
  components: {
    CreateNewCategoryDialog
  },
  props: {
    category: Object
  },
  methods: {
    onCloseDialogHandler() {
      this.$emit('close', false)
      this.tempCategory = null
    },
    onSubmitHandler() {
      this.$emit('submit', this.tempCategory)
      this.$emit('close', false)
      this.tempCategory = null
    },
    setSelectedItem(catObject) {
      this.tempCategory = catObject
    },
    setNewCategoryObject(newCategory) {
      store.dispatch('persona/addNewCategory', newCategory)
    },
    createSelectedCategoryObject(obj) {
      this.tempCategory.name = obj.name
    }
  },

  computed: {
    ...mapState({ persona: 'persona' }),
    itemsData: {
      get: function() {
        if (this.persona.categories) {
          return this.persona.categories
        }
        //Must be array not null
        return []
      },
      set: function(newValue) {
        newValue ? this.persona.categories : null
      }
    },
    selectedObject() {
      return this.tempCategory
    }
  }
}
</script>