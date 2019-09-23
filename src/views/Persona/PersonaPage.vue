<template>
  <v-app id="inspire">
    <v-container fluid>
      <NotificationContainer />
      <h3>Personae page</h3>
      <v-col>
        <template>
          <form>
            <v-flex xs12 sm6 d-flex data-app>
              <v-select
                :items="this.persona.companies.SiteCustomersList"
                name="company"
                item-text="CompanyName"
                item-value="CompanyGuid"
                outlined
                label="Company"
                hint="Select company"
                persistent-hint
                v-model="companyId"
                @change="setSelectedCompany"
              ></v-select>
            </v-flex>
          </form>
        </template>
        <!-- <template v-else>
          <v-flex xs12 sm6 d-flex data-app >
            <v-select
              :items="this.persona.companies.SiteCustomersList"
              item-text="CompanyName"
              item-value="CompanyGuid"
          outlined
              label="Company"
              hint="Select company"
              persistent-hint
              v-model="companyId"
              @change="setSelectedCompany"
            ></v-select>
          </v-flex>
        </template>-->
      </v-col>
      <v-col v-show="companyIsSelected" cols="8">
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <!-- Select personas status -->
            <v-select
              :items="personaStatus"
              name="status"
              item-text="text"
              filled
              return-object
              label="Select status"
              persistent-hint
              v-model="selectedStatus"
              @change="setSelectStatus"
            ></v-select>
            <!-- / Select personas status -->
            <!-- All status -->
            <v-btn @click="setSelectedCompany">All status</v-btn>
            <!-- / All status -->
            <!-- ADD NEW PERSONA -->
            <v-dialog v-model="onDialogAddNewPersona" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" @click="onAddNewPersona" v-on="on">Add new persona</v-btn>
              </template>
              <PersonaDialogAddNewPersona @closeDialog="onCloseDialog" :companyId="this.companyId"></PersonaDialogAddNewPersona>
            </v-dialog>
            <!-- / ADD NEW PERSONA -->
          </v-card-title>
          <v-data-table :headers="headers" :items="items" :search="search" :item-key="items.id">
            <template v-slot:item.status="{ item }">
              <v-btn
                small
                :color="getStatusColor(item.active)"
                dark
                @click="setPersonaStatus(item.id)"
              >{{item.status}}</v-btn>
            </template>
            <template v-slot:item.edit="{item}">
              <v-icon large color="blue darken-2" @click="onEditPersona(item.id)">mdi-table-edit</v-icon>
            </template>
            <!-- DELETE ICON -->
            <template v-slot:item.delete="{item}">
              <v-dialog v-model="onDialogConfirmation" persistent >
              <!-- Aktivator dialoga -->
              <template v-slot:activator="{ on }">
                <!-- Definise dogadjaj za aktivator -->
                                    <v-icon
                      large
                      color="error"
                      @click="onDeleteCustomFieldHandler(item.id)"
                      v-on="on"
                    >mdi-delete-circle</v-icon>
                <!-- <v-btn color="red lighten-2" dark v-on="on">Delete</v-btn> -->
                <!-- <v-btn color="error" dark @click.stop="onDialogConfirmation = true">Delete</v-btn> -->
              </template>
              <!-- Komponenta koja ce se prikazati kada se aktivira -->
              <PersonaConfirmationDialog @closeDialog="onCloseConfirmationDialog"></PersonaConfirmationDialog>>
            </v-dialog>
            </template>
          </v-data-table>
        </v-card>
        <!-- /Tabela -->
      </v-col>
    </v-container>
  </v-app>
</template>


<script>
import NProgress from 'nprogress'
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import NotificationContainer from '../../components/NotificationContainer'
import CompaniesHardCode from '../../../GetSiteCustomers.json'
import router from 'vue-router'
import PersonaDialogAddNewPersona from './Dialogs/PersonaDialogAddNewPersona'
import PersonaConfirmationDialog from './Dialogs/PersonaConfirmationDialog'

const defaultStatus = 'All'
export default {
  components: {
    NotificationContainer,
    PersonaDialogAddNewPersona,
    PersonaConfirmationDialog
  },
  data() {
    return {
      companies: null,
      selectedCompany: null,
      companyId: null,
      search: '',
      headers: [
        {
          text: 'Edit',
          value: 'edit'
        },
        {
          text: 'Persona',
          value: 'name'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {
          text: 'Delete',
          value: 'delete'
        }
      ],
      personaStatus: [
        {
          active: true,
          text: 'Active',
          color: 'primary'
        },
        {
          active: false,
          text: 'Inactive',
          color: 'error'
        }
      ],
      selectedStatus: null,
      selectedPersonaStatus: null,
      onDialogAddNewPersona: false,
      onDialogConfirmation: false
    }
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    store.dispatch('persona/loadHardCodedCompanies').then(response => {
      next(
        //Dobijanje companyId pri povratku sa PersonaDetail
        function(vm) {
          if (!vm.companyId) {
            vm.companyId = vm.$store.state.persona.selectedCompanyGuid
          }
        }
      )
    })
    console.log('beforeEnter')
  },
  beforeRouteUpdate() {},
  created() {
    this.companies = this.persona.companies
  },
  methods: {
    setSelectedCompany() {
      //Omogucava prikazivanje persona sa svim statusima
      this.selectedStatus = defaultStatus
      //Setovanje companyId u centralni store zbog goBack varijante
      store.dispatch('persona/setCompanyId', this.companyId)
      //Dohvatanje persona
      store.dispatch('persona/getPersonasByCompanyGuid', this.companyIdString)
      //Setovanje Company guida u centralni store
      //store.dispatch('persona/setCompanyGuid', this.selectedCompany.CompanyGuid)
    },
    setSelectStatus() {
      const status = this.selectedStatus.active
      console.log(this.selectedStatus, status)
      const selectedItems = this.items.filter(i => {
        return i.active === status
      })
    },

    getStatusColor(status) {
      if (status) {
        return this.personaStatus[0].color
      }
      return this.personaStatus[1].color
    },
    setPersonaStatus(key) {
      console.log('imam klik', key)
      this.selectedPersonaStatus = key

      const element = this.items.find(x => x.id === key)
      element.active = !element.active
      element.stringId = this.personaIdString.stringId
      console.log(element)
      //Slanje na server i setovanje centralnog statea
      store.dispatch('persona/setPersonasStatusOnServer', element)
      element.active
        ? (element.status = this.personaStatus[0].text)
        : (element.status = this.personaStatus[1].text)
    },
    onEditPersona(key) {
      this.personaId = key
      console.log(`klik key ${this.personaId}`)
      this.$router.push({
        name: 'persona',
        params: { personaId: this.personaId, companyId: this.companyId }
      })
    },
    onDeleteCustomFieldHandler(){
      console.log("delete custom field")
    },
    onCloseConfirmationDialog(value) {
      this.onDialogConfirmation = value
    },
    onAddNewPersona() {
      console.log('Dodavanje persone')
    },
    onCloseDialog(value) {
      this.onDialogAddNewPersona = value
    },
    mapPersonas() {
      return this.persona.personas.map(p => {
        return {
          id: p.id,
          name: p.name,
          active: p.active,
          status: p.active
            ? this.personaStatus[0].text
            : this.personaStatus[1].text,
          companyId: p.companyId
        }
      })
    }
  },

  computed: {
    ...mapState({ persona: 'persona' }),
    companyIdString: function() {
      return `companyId=${this.companyId}`
    },

    items: function() {
      if (this.persona.personas.length) {
        if (this.selectedStatus) {
          switch (this.selectedStatus.text) {
            case 'Active':
              return this.mapPersonas().filter(e => e.active)
              break
            case 'Inactive':
              return this.mapPersonas().filter(e => !e.active)
              break
            case 'All':
              console.log('all')
              return this.setSelectedCompany()
              break
            default:
              return this.mapPersonas()
              break
          }
        }
        return this.mapPersonas()
      }
      return []
    },
    personaIdString: function() {
      return {
        stringId: `ids=${this.selectedPersonaStatus}`
      }
    },
    companyIsSelected: function() {
      return this.companyId || this.persona.selectedCompanyGuid ? true : false
    }
  }
}
</script>
<style scoped>
</style>