<template>
  <v-app id="inspire">
    <v-container fluid>
      <!-- PAGE TITLE -->
      <v-card>
        <BasePageTitle>Custom fields for selected persona</BasePageTitle>
        <v-divider />
        <!-- EDIT CURENT PERSONA -->
        <v-row
          align="baseline"
          justify="space-between"
          class="grey lighten-4 mx-0"
          v-if="persona.personaObject"
        >
          <v-col cols="4" md="3" class="pl-6">
            <v-text-field v-model="persona.personaObject.name" label="Persona name"></v-text-field>
          </v-col>
          <v-col cols="3" md="3">
            <BaseSelectCompany
              :companies="companies.allCompanies"
              @on-change-select="onChangeCompanySelectHandler"
            />
          </v-col>
          <v-col cols="3">
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="persona.personaObject.activeLimit"
                  label="Active limit"
                  type="number"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="8">
                <v-checkbox v-model="persona.personaObject.allowShare" label="Allow share" dense></v-checkbox>
              </v-col>
            </v-row>
          </v-col>
          <!-- EDIT PERSONA DIALOG -->
          <v-col cols="2" md="3">
            <template>
              <v-dialog
                v-model="dialog.confirmation.editPersona"
                persistent
                max-width="400px"
                :retain-focus="false"
              >
                <template v-slot:activator="{on}">
                  <v-btn color="primary" v-on="on">Edit curent persona</v-btn>
                </template>
                <BaseDialogConfirmation
                  @close="(val)=>dialog.confirmation.editPersona=val"
                  @submit="onEditPersonaHandler"
                >
                  <template v-slot:header>Edit Persona</template>
                  <template v-slot:body>Are you sure you want to edit data for selected persona ?</template>
                </BaseDialogConfirmation>
              </v-dialog>
            </template>
            <!-- TOOLTIP EDIT PERSONA -->
            <BaseTooltip :large="true">{{tooltips.editCurentPersona}}</BaseTooltip>
          </v-col>
        </v-row>
        <v-divider />
        <!-- TABLE -->
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
            <!-- CREATE NEW CUSTOM FIELD -->
            <v-col class="pr-6">
              <v-dialog
                v-model="dialog.create"
                persistent
                max-width="1200px"
                :retain-focus="false"
                @keydown.esc="dialog.create = false"
              >
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
        <!-- DATA TABLE -->
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :item-key="items.id"
          sort-by="rank"
        >
          <!-- TOOLTIPS FOR HEADER -->
          <template v-slot:header.edit="{ header }">
            <BaseTooltip>{{tooltips.editCustomField}}</BaseTooltip>
            {{header.text}}
          </template>
          <template v-slot:header.delete="{ header }">
            <BaseTooltip>{{tooltips.deleteCustomField}}</BaseTooltip>
            {{header.text}}
          </template>
          <template v-slot:item.edit="{item}">
            <!-- DIALOG EDIT -->
            <v-dialog
              v-model="dialog.edit"
              persistent
              max-width="1200px"
              :retain-focus="false"
              @keydown.esc="dialog.edit = false"
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  large
                  color="blue darken-2"
                  @click="onEditCustomFieldHandler(item.id)"
                  v-on="on"
                >mdi-table-edit</v-icon>
                <!-- <BaseTooltip>{{tooltips.editCustomField}}</BaseTooltip> -->
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
            <v-dialog
              v-model="dialog.confirmation.deleteCustomfield"
              persistent
              max-width="400px"
              :retain-focus="false"
            >
              <template v-slot:activator="{ on }">
                <v-icon
                  large
                  color="error"
                  v-on="on"
                  @click="setSelectedCustomField(item.id)"
                >mdi-delete</v-icon>
              </template>
              <BaseDialogConfirmation
                @close="(val)=>dialog.confirmation.deleteCustomfield=val"
                @submit="onDeleteCustomFieldHandler"
              >
                <template v-slot:header>Delete custom field : {{selectedCustomField.name}}</template>
                <template v-slot:body>Are you sure you want to delete this custom field ?</template>
              </BaseDialogConfirmation>
            </v-dialog>
          </template>
        </v-data-table>
        <BasePageFooter>
          <v-btn small @click="()=>this.$router.go(-1) " dark>Go back</v-btn>
        </BasePageFooter>
      </v-card>
      <!-- /Tabela -->
    </v-container>
  </v-app>
</template>
<script>
import NProgress from 'nprogress'
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import CustomFieldSelected from './CustomFields/CustomFieldSelected'

export default {
  components: {
    CustomFieldSelected
  },
  data() {
    return {
      personaId: this.$route.params.personaId,
      companyId: this.$route.params.companyId,
      active:this.$route.params.active,
      editedCompanyId: this.$route.params.companyId,
      search: '',
      headers: [
        { text: 'Edit', value: 'edit' },
        { text: 'Rank', value: 'rank' },
        { text: 'Name', value: 'name' },
        { text: 'Category', value: 'category' },
        { text: 'Sort order', value: 'sortOrder' },
        { text: 'Type', value: 'type' },
        { text: 'Delete', value: 'delete' }
      ],
      tooltips: {
        editCurentPersona: 'Edit curent persona',
        deleteCustomField: 'Delete selected custom field',
        editCustomField:
          'Click on the icon and change data for selected custom field.'
      },
      dialogType: null,
      dialog: {
        confirmation: {
          deleteCustomfield: false,
          editPersona: false
        },
        create: false,
        edit: false
      },
      selectedCustomField: null,
      dataObject: null
    }
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    console.log('before route enter')
    store.dispatch('companies/loadAllCompanies').then(() => {
      next()
    })
  },
  created() {
    console.log('created customField')
    // store.dispatch('companies/loadAllCompanies')
    this.editedCompany = this.companyId
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
    onChangeCompanySelectHandler(value) {
      console.log(value)
      this.editedCompanyId = value
    },
    editedPersona: function() {
      console.log('edit persona object')
      return {
        active:this.active,
        id: this.personaId,
        name: this.personaName,
        companyId: this.editedCompanyId,
        companyIdString: `companyId=${this.editedCompanyId}`,
        activeLimit: this.persona.personaObject.activeLimit,
        allowShare: this.persona.personaObject.allowShare
      }
    },
    onEditPersonaHandler: function() {
      //If company is changed
      if (this.companyId && this.companyId!=this.editedCompanyId) {
        store.dispatch('persona/editPersonaData', this.editedPersona())
        .then(
          ()=>store.dispatch('persona/getPersonasByCompanyGuid', this.companies.companyIdString)
        )
        //Return to persona page for previus company without edited persona
        return this.$router.push({ name: 'personas'})
      } else{
        store.dispatch('persona/editPersonaData', this.editedPersona())
      }  
    },
    onCreateCustomFieldObject() {
      this.dialogType = 'create'
      console.log('create Custom field object')
      this.dataObject = this.createDataObject()
      console.log(this.dataObject)
      store.dispatch('persona/setSelectedCustomField', this.dataObject)
      store.dispatch('persona/getAllCategoriesForSelectedPersona')
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
      console.log('setovanje cf-a', key)
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
    onDeleteCustomFieldHandler() {
      const params = {
        personaId: this.personaId,
        cFieldId: this.selectedCustomField.id
      }
      console.log(`delete custom field`, params)
      store.dispatch('persona/deleteSelectedCustomField', params)
    },
    onCloseDialog(value) {
      this.dialog.create = value
      this.dialog.edit = value
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
      if (this.persona.customFields) {
        return this.persona.customFields.map(cf => {
          return {
            id: cf.id,
            rank: cf.rank,
            name: cf.name,
            category: cf.category.name,
            sortOrder: cf.category.sortOrder,
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