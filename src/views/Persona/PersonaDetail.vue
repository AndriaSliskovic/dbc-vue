<template>
  <v-app id="inspire">
    <v-container>
      <NotificationContainer />
      <v-card>
        <v-row>
          <v-col cols="4" md="4">
            <v-text-field v-model="personaName" label="Persona name"></v-text-field>
          </v-col>
          <v-col cols="4" md="4">
            <v-select
              v-model="companyId"
              :items="this.persona.companies.SiteCustomersList"
              item-text="CompanyName"
              item-value="CompanyGuid"
              label="Select Company"
              outlined
              :value="companyId"
            ></v-select>
          </v-col>
          <v-col cols="4" md="4">
            <v-btn color="primary" @click="editPersonaHandler()">Edit changes</v-btn>
          </v-col>
        </v-row>
      </v-card>

      <v-col>
        <!-- Tabela -->
        <v-card>
          <v-card-title>
            Custom Fields
            <div class="flex-grow-1"></div>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <!-- <v-select
              :items="personaStatus"
              name="status"
              item-text="text"
              filled
              return-object
              label="Select status"
              persistent-hint
              v-model="selectedStatus"
              @change="setSelectStatus"
            ></v-select>-->
          </v-card-title>
          <v-data-table :headers="headers" :items="items" :search="search" :item-key="items.id">
            <template v-slot:item.edit="{item}">
              <v-dialog v-model="dialogDetail" persistent max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-icon
                      large
                      color="blue darken-2"
                      @click="editCustomFieldHandler(item.id)"
                      v-on="on"
                    >mdi-table-edit</v-icon>
                  </template>
                  <PersonaDetailDialog
                    @closeDialog="onCloseDialog"
                    :cField="selectedCustomField"
                    >
                  </PersonaDetailDialog>
              </v-dialog>
            </template>
            <!-- DIALOG BEZ AKTIVATORA -->
            <!-- <template v-slot:item.activator="{item}">
              <v-btn color="error" dark @click.stop="dialogConfirmation = true">Delete</v-btn>
            </template>-->
            <!-- DIALOG SA AKTIVATOROM -->
          <!-- selektuje stavku -->
          <template v-slot:item.delete="{item}">
            <!-- Definise dialog -->
            <v-dialog v-model="dialogConfirmation" persistent >
              <!-- Aktivator dialoga -->
              <template v-slot:activator="{ on }">
                <!-- Definise dogadjaj za aktivator -->
                <v-btn color="red lighten-2" dark v-on="on">Delete</v-btn>
                <!-- <v-btn color="error" dark @click.stop="dialogConfirmation = true">Delete</v-btn> -->
              </template>
              <!-- Komponenta koja ce se prikazati kada se aktivira -->
              <PersonaConfirmationDialog @closeDialog="onCloseConfirmationDialog"></PersonaConfirmationDialog>>
            </v-dialog>
          </template>
          </v-data-table>
        </v-card>
        <!-- /Tabela -->
      </v-col>
      <v-row>
        <v-col>
          <v-btn @click="()=>this.$router.go(-1) ">Go back</v-btn>
        </v-col>
        <v-col>
          <v-btn @click="saveHandler" color="primary">Save</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
import NProgress from 'nprogress'
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import NotificationContainer from '../../components/NotificationContainer'
import CompaniesHardCode from '../../../GetSiteCustomers.json'
import PersonaDetailDialog from './PersonaDetailDialog'
import PersonaConfirmationDialog from './PersonaConfirmationDialog'

export default {
  components: {
    PersonaDetailDialog,
    PersonaConfirmationDialog,
    NotificationContainer
  },
  data() {
    return {
      personaId: this.$route.params.personaId,
      companyId: this.$route.params.companyId,
      selectedCompany: null,
      companies: [],
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
      dialogDetail: false,
      dialogConfirmation: false,
      selectedCustomField: null
    }
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    store.dispatch('persona/loadHardCodedCompanies').then(response => {
      next()
    })
  },
  created() {
    this.companies = this.persona.companies.SiteCustomersList
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
    saveHandler() {
      console.log(`klik na save `)
    },
    editCustomFieldHandler(key) {
      console.log(`edit Custom Field ${key}`)
      const cField = this.customFields.find(function(el) {
        return el.id === key
      })
      this.selectedCustomField = {
        id : cField.id,
        name:cField.name,
        rank:cField.rank,
        category:cField.category,
        type:cField.type

      }
      //this.selectedCustomField = cField[0]
      //console.log(this.selectedCustomField)
      //Pozivanje servisa za selektovanu personu
    },
    onCloseDialog(value) {
      this.dialogDetail = value
    },
    onCloseConfirmationDialog(value) {
      this.dialogConfirmation = value
    }
  },
  computed: {
    ...mapState({ persona: 'persona' }),
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
            category: cf.category,
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