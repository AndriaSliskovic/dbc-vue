<template>
  <v-app id="inspire">
    <v-container fluid>
      <!-- Zaglavlje stranice -->
      <v-card>
        <v-row>
          <v-col cols="6">
            <v-card-title class="pl-4 pt-4 blue--text text--darken-4">Persona page</v-card-title>
          </v-col>
          <v-col cols="6">
            <NotificationContainer/>
          </v-col>
        </v-row>
      </v-card>
      <!-- /Zaglavlje stranice -->      
      <v-dialog v-model="dialogOne" max-width="400px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">Dialog sa aktivatorom</v-btn>
        </template>
        <v-card>
          <v-card-title>Tekst dialoga sa aktivatorom !</v-card-title>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="green darken-1" text @click="dialogOne = false">Disagree</v-btn>
            <v-btn color="green darken-1" text @click="dialogOne = false">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-col>
        <template>
          <form>
            <v-flex xs12 sm6 d-flex data-app>
              <v-select
                :items="this.persona.companies"
                name="company"
                item-text="CompanyName"
                item-value="CompanyGUID"
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
                ></v-select>
              </v-col>

              <!-- / Select personas status -->
              <!-- ADD NEW PERSONA -->
              <v-col>
                <v-dialog v-model="dialogAddNewPersona" persistent max-width="600px">
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
            <template v-slot:item.delete="{item}">
              <!-- DIALOG ZA DELETE -->
              <v-dialog v-model="dialogConf" persistent max-width="400px">
                <template v-slot:activator="{ on }">
                  <v-icon
                    large
                    color="error"
                    v-on="on"
                    @click="setSelectedPersona(item.id)"
                  >mdi-delete</v-icon>
                </template>
                <ConfirmationDialog
                  @close="val=>dialogConf=val"
                  @submit="onDeletePersonadHandler(item.id)"
                >
                  <template v-slot:header>Delete persona : {{selectedPersona.name}}</template>
                  <template v-slot:body>Are you sure you want to delete this persona ?</template>
                </ConfirmationDialog>
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
import ConfirmationDialog from './Dialogs/ConfirmationDialog'

const defaultStatus = function() {
  return { active: null, text: 'All', color: 'blue', letter: '' }
}
export default {
  components: {
    NotificationContainer,
    PersonaDialogAddNewPersona,
    ConfirmationDialog
  },
  data() {
    return {
      companies: null,
      companyId: null,
      search: '',
      headers: [
        { text: 'Edit', value: 'edit' },
        { text: 'Persona', value: 'name' },
        { text: 'Status', value: 'status' },
        { text: 'Delete', value: 'delete' }
      ],
      personaStatus: [
        { active: true, text: 'Active', color: 'teal darken-3', letter: 'A' },
        { active: false, text: 'Inactive', color: 'error', letter: 'I' },
        { text: 'All' }
      ],
      personaId: null,
      selectedStatus: null,
      selectedPersonaStatusId: null,
      selectedPersona: null,
      dialogAddNewPersona: false,
      dialogConf: false,

      dialogOne: false,
      dialogTwo: false
    }
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    store.dispatch('persona/loadPortals').then(response => {
      next(
        //Dobijanje companyId pri povratku sa PersonaDetail
        function(vm) {
          if (!vm.companyId) {
            vm.companyId = vm.$store.state.persona.selectedCompanyGUID
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
      //Setovanje companyId u centralni store zbog goBack varijante
      store.dispatch('persona/setCompanyId', this.companyId)
      //Dohvatanje persona
      store.dispatch('persona/getPersonasByCompanyGuid', this.companyIdString)
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
      this.selectedPersonaStatusId = key

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
      console.log(`setovanje persone ${key}`)
      this.selectedPersona = this.mapPersonas().find(function(el) {
        return el.id === key
      })
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
      //Persona je setovana na prethodni klik
      console.log(`selektovana persona ${this.selectedPersona}`)
      store.dispatch('persona/deletePersona', this.selectedPersona)
    },
    onCloseConfirmationDialog(value) {
      this.onDialogConfirmation = value
      console.log('close dialog')
    },

    onAddNewPersona() {
      console.log('Dodavanje persone')
    },
    onCloseDialog(value) {
      this.dialogAddNewPersona = value
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
              return this.mapPersonas()
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
      if (this.selectedPersonaStatusId) {
        return {
          stringId: `ids=${this.selectedPersonaStatusId}`
        }
      }
      return `ids=${this.personaId}`
    },
    companyIsSelected: function() {
      return this.companyId || this.persona.selectedCompanyGUID ? true : false
    }
  }
}
</script>
<style scoped>
</style>