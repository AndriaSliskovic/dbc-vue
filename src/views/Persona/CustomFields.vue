<template>
  <v-app id="inspire">
    <v-container fluid>
      <!-- Zaglavlje stranice -->
      <v-card>
        <v-row class="grey lighten-3 mx-0">
          <v-col cols="6">
            <v-card-title
              class="pl-4 pt-4 blue--text text--darken-4"
            >Custom fields for {{personaName}} persona</v-card-title>
          </v-col>
          <v-col cols="6">
            <NotificationContainer />
          </v-col>
        </v-row>
        <v-divider />
        <!-- /Zaglavlje stranice -->

        <!-- EDIT CURENT PERSONA -->
        <v-row align="baseline" justify="space-between" class="grey lighten-4 mx-0">
          <v-col cols="4" md="4" class="pl-6">
            <v-text-field v-model="personaName" label="Persona name"></v-text-field>
          </v-col>
          <v-col cols="4" md="4">
            <BaseSelectCompany :companies="companies.allCompanies" />
          </v-col>
          <v-col cols="4" md="2">
            <v-btn color="primary" @click="editPersonaHandler()">Edit curent persona</v-btn>
          </v-col>
        </v-row>
        <v-divider />
        <!-- Tabela -->
        <v-card-title>
          <v-row align="baseline" justify="space-between">
            <v-col class="pl-4">Custom Fields</v-col>
            <div class="flex-grow-1"></div>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <div class="flex-grow-1"></div>
            <!-- CREATE Custom Fields -->
            <v-col class="pr-6">
              <v-dialog v-model="dialogCreate" persistent max-width="1200px">
                <!-- Aktivator -->
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    color="primary"
                    @click="onCreateCustomFieldObject"
                  >Create new Custom field</v-btn>
                </template>
                <CustomFieldSelected
                  @close="val=>onCloseDialog(val)"
                  :cField="dataObject"
                  :dialogType="dialogType"
                ></CustomFieldSelected>
              </v-dialog>
            </v-col>
          </v-row>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :item-key="items.id"
          sort-by="rank"
        >
          <template v-slot:item.edit="{item}">
            <!-- DIALOG EDIT -->
            <v-dialog v-model="dialogEdit" persistent max-width="1200px">
              <template v-slot:activator="{ on }">
                <v-icon
                  large
                  color="blue darken-2"
                  @click="onEditCustomFieldHandler(item.id)"
                  v-on="on"
                >mdi-table-edit</v-icon>
              </template>
              <CustomFieldSelected
                @close="val=>onCloseDialog(val)"
                :cField="selectedCustomField"
                :dialogType="dialogType"
              ></CustomFieldSelected>
            </v-dialog>
          </template>
          <!-- DIALOG DELETE -->
          <template v-slot:item.delete="{item}">
            <v-dialog v-model="dialogConf" persistent max-width="400px">
              <template v-slot:activator="{ on }">
                <v-icon
                  large
                  color="error"
                  v-on="on"
                  @click="setSelectedCustomField(item.id)"
                >mdi-delete</v-icon>
              </template>
              <BaseDialogConfirmation
                @close="()=>dialogConf=false"
                @submit="onDeleteCustomFieldHandler(item.id)"
              >
                <template v-slot:header>Delete custom field 1 : {{selectedCustomField.name}}</template>
                <template v-slot:body>Are you sure you want to delete this custom field ?</template>
              </BaseDialogConfirmation>
            </v-dialog>
          </template>
        </v-data-table>
        <v-card-actions>
          <v-row justify="center">
            <v-btn small @click="()=>this.$router.go(-1) ">Go back</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
      <!-- /Tabela -->
    </v-container>
  </v-app>
</template>
<script>
import NProgress from 'nprogress'
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import NotificationContainer from '../../components/NotificationContainer'
import CustomFieldSelected from './CustomFieldSelected'

export default {
  components: {
    CustomFieldSelected,
    NotificationContainer
  },
  data() {
    return {
      personaId: this.$route.params.personaId,
      companyId: this.$route.params.companyId,
      selectedCompany: null,

      editedCompany: null,
      search: '',
      headers: [
        { text: 'Edit', value: 'edit' },
        { text: 'Rank', value: 'rank' },
        { text: 'Name', value: 'name' },
        { text: 'Category', value: 'category' },
        { text: 'Type', value: 'type' },
        { text: 'Delete', value: 'delete' }
      ],
      dialogType: null,

      dialogCreate: false,
      dialogEdit: false,
      dialogConf: false,

      selectedCustomField: null,
      dataObject: null
    }
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    store.dispatch('companies/loadAllCompanies').then(response => {
      next()
    })
  },
  created() {
    //Dobijanje persona objekta
    store.dispatch('persona/getSelectedPersonaByPersonaId', this.personaId)
    //Dobijanje CustomFieldsa
    store.dispatch('persona/getCustomFieldsByPersonaID', this.personaId)
    console.log(this.customFields)
  },

  methods: {
    goBack: function() {
      return this.$router.go(-1)
    },
    editedPersona: function() {
      if (!this.editedCompany) {
        return {
          personaId: this.personaId,
          name: this.persona.personaObject.name,
          companyId: this.companyId
        }
      } else {
        return {
          personaId: this.personaId,
          name: this.personaName,
          companyId: this.editedCompany.CompanyGuid
        }
      }
    },
    editPersonaHandler: function() {
      const editedPersona = this.editedPersona()
      console.log(`imam edit ${editedPersona}`)
      store.dispatch('persona/editPersonaData', editedPersona)
    },
    onCreateCustomFieldObject() {
      this.dialogType = 'create'
      console.log('create Custom field object')
      this.dataObject = this.createDataObject()
      console.log(this.dataObject)
      store.dispatch('persona/setSelectedCustomField', this.dataObject)
    },
    createDataObject() {
      return {
        personaId: this.personaId,
        id: null,
        active: true,
        name: null,
        tag: null,
        rank: null,
        category: {
          name: null,
          icon: null,
          sortOrder: 1
        },
        type: null,
        required: null,
        dataSource: [],
        defaultValue: '',
        maskId: null,
        visible: false,
        editable: false
      }
    },
    setSelectedCustomField(key) {
      const cField = this.customFields.find(function(el) {
        return el.id === key
      })
      this.selectedCustomField = {
        personaId: this.personaId,
        id: cField.id,
        name: cField.name,
        rank: cField.rank,
        category: cField.category,
        type: cField.type,
        required: cField.required,
        visible: cField.visible,
        editable: cField.editable,
        dataSource: cField.dataSource,
        maskId: cField.maskId,
        defaultValue: cField.defaultValue,
        tag: null
      }
    },
    onEditCustomFieldHandler(key) {
      this.dialogType = 'edit'
      console.log(`edit Custom Field ${key}`)
      this.setSelectedCustomField(key)
      console.log(this.selectedCustomField)
      store.dispatch('persona/setSelectedCustomField', this.selectedCustomField)
      store.dispatch('persona/getAllCategoriesForSelectedPersona')
    },
    onDeleteCustomFieldHandler(key) {
      const params = {
        personaId: this.personaId,
        cFieldId: key
      }
      store.dispatch('persona/deleteSelectedCustomField', params)
      console.log(`delete custom field ${params}`)
    },
    onCloseDialog(value) {
      this.dialogCreate = value
      this.dialogEdit = value
      //Kreiranje praznog objekta zbog resetovanja centralnog stora
      this.dataObject = this.createDataObject()
      store.dispatch('persona/setSelectedCustomField', this.dataObject)
    }
  },
  computed: {
    ...mapState(['persona', 'companies']),
    personaName: {
      get: function() {
        return this.persona.personaObject ? this.persona.personaObject.name : ''
        //return this.persona.personaObject.name
      },
      set: function(newValue) {
        newValue ? (this.persona.personaObject.name = newValue) : null
      }
    },
    customFields: {
      get: function() {
        //return this.persona.customFields ? this.persona.customFields : null
        return this.persona.customFields
      }
    },
    items: function() {
      if (this.customFields) {
        return this.customFields.map(cf => {
          return {
            id: cf.id,
            rank: cf.rank,
            name: cf.name,
            category: cf.category.name,
            type: cf.type
          }
        })
      }
      return []
    }
  }
}
</script>
<style lang="less" scoped>
</style>