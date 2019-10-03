<template>
  <v-app id="inspire">
    <v-container fluid>
      <h3 class="pl-4 pt-4 indigo--text">Personae page</h3>
      <v-dialog v-model="dialogOne" max-width="400px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">Dialog sa aktivatorom</v-btn>
        </template>
        <v-card>
          <v-card-title >Tekst dialoga sa aktivatorom !</v-card-title>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="green darken-1" text @click="dialogOne = false">Disagree</v-btn>
            <v-btn color="green darken-1" text @click="dialogOne = false">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-col>
        <NotificationContainer />
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
      </v-col>
      <v-col v-show="companyIsSelected">
        <v-card class="grey lighten-4">
          <v-card-title>
            <v-row align="baseline" justify="space-between">
              <v-col class="pl-6">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>

              <!-- Select personas status -->
              <v-col>
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
              </v-col>

              <!-- / Select personas status -->
              <!-- ADD NEW PERSONA -->
              <v-col>
                <v-dialog v-model="onDialogAddNewPersona" persistent max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" v-on="on">Add new persona</v-btn>
                  </template>
                  <PersonaDialogAddNewPersona @close="onCloseDialog" :companyId="this.companyId"></PersonaDialogAddNewPersona>
                </v-dialog>
              </v-col>
            </v-row>
            <!-- / ADD NEW PERSONA -->
          </v-card-title>
          <v-data-table :headers="headers" :items="items" :search="search" :item-key="items.id">
            <!-- STATUS -->
            <template v-slot:item.status="{ item }">
              <v-chip
                pill
                @click="setPersonaStatus(item.id)"
                :text-color="getStatusColor(item.active)"
              >
                <v-avatar left :color="getStatusColor(item.active)">
                  <v-icon v-if="item.active">check</v-icon>
                  <v-icon v-else="item.active">close</v-icon>
                </v-avatar>
                {{item.status}}
              </v-chip>
            </template>
            <template v-slot:item.edit="{item}">
              <v-icon large color="blue darken-2" @click="onEditPersona(item.id)">mdi-table-edit</v-icon>
            </template>
            <!-- / STATUS -->
            <!-- DELETE ICON -->
            <template v-slot:item.delete="{item}" v-slot:activator="{ on }">
              <!-- DIALOG ZA DELETE -->
              <v-dialog v-model="onDialogConfirmation" persistent max-width="400px">
                <template v-slot:activator="{ on }">
                  <v-icon large color="error" v-on="on">mdi-delete</v-icon>
                </template>
                <PersonaConfirmationDialog
                  @close="val=>onDialogConfirmation=val"
                  @submit="onDeletePersonadHandler(item.id)"
                >
                  <template v-slot:header>
                    <h3>Delete persona {{item.name}}</h3>
                  </template>
                  <template v-slot:body>
                    <p>Are you sure you want to delete this persona ?</p>
                  </template>
                </PersonaConfirmationDialog>
              </v-dialog>
              
              <!-- BEZ AKTIVATORA -->
              <v-btn color="primary" dark @click.stop="dialogTwo = true">Bez aktivatora</v-btn>
              <v-dialog v-model="dialogTwo" max-width="290">
                <v-card>
                  <v-card-title>Dialog bez aktivatora</v-card-title>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="green darken-1" text @click="dialogTwo = false">Disagree</v-btn>
                    <v-btn color="green darken-1" text @click="dialogTwo = false">Agree</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
          </v-data-table>
        </v-card>
        <!-- /Tabela -->

        <!-- Pozivanje dialoga bez aktivatora -->
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

const defaultStatus = function() {
  return {
    active: null,
    text: 'All',
    color: 'blue',
    letter: ''
  }
}
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
          color: 'green',
          letter: 'A'
        },
        {
          active: false,
          text: 'Inactive',
          color: 'error',
          letter: 'I'
        },
        {
          active: null,
          text: 'All',
          color: 'blue',
          letter: ''
        }
      ],
      personaId: null,
      selectedStatus: null,
      selectedPersonaStatus: null,
      selectedPersona: null,
      onDialogAddNewPersona: false,
      onDialogConfirmation: false,
      dialog: false,
      dialogOne:false,
      dialogTwo: false,
      dialog3:false
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
    },
    setSelectStatus() {
      if (!this.selectedStatus.text === 'All') {
        const status = this.selectedStatus.active
        console.log(this.selectedStatus, status)
        const selectedItems = this.items.filter(i => {
          return i.active === status
        })
      }
    },

    getStatusColor(status) {
      const perStatus = this.personaStatus
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
    setSelectedPersona(key) {
      this.selectedPersona = this.mapPersonas().find(function(el) {
        return el.id === key
      })
    },
    onOpenDialog(key) {
      console.log(key)
      this.personaId = key
      //this.setSelectedPersona(key)
    },
    onEditPersona(key) {
      this.personaId = key
      this.setSelectedPersona(key)
      this.$router.push({
        name: 'persona',
        params: { personaId: this.personaId, companyId: this.companyId }
      })
    },
    onDeletePersonadHandler: function(key) {
      this.personaId = key
      this.setSelectedPersona(key)
      store.dispatch('persona/deletePersona', this.selectedPersona.stringId)
    },
    onCloseConfirmationDialog(value) {
      this.onDialogConfirmation = value
      console.log('close dialog')
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
          companyId: p.companyId,
          stringId: `ids=${p.id}`
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
              console.log('all case')
              return this.setSelectedCompany()
              break
            default:
              console.log('default case')
              return this.mapPersonas()
              break
          }
        }
        return this.mapPersonas()
      }
      return []
    },
    itemsData: {
      get: function() {
        return this.persona.personas
      },
      set: function(newValue) {
        newValue ? this.persona.personas : null
      }
    },
    personaIdString: function() {
      if (this.selectedPersonaStatus) {
        return {
          stringId: `ids=${this.selectedPersonaStatus}`
        }
      }
      return `ids=${this.personaId}`
    },
    companyIsSelected: function() {
      return this.companyId || this.persona.selectedCompanyGuid ? true : false
    }
  }
}
</script>
<style scoped>
</style>