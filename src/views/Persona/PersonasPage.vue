<template>
  <v-app id="inspire">
    <v-container fluid>
      <!-- Page title -->
      <v-card>
        <BasePageTitle>Persona page</BasePageTitle>
        <v-divider />
        <template>
          <v-row class="grey lighten-4 mx-0 py-2" align="center">
            <!-- SELECT COMPANIES -->
            <BaseSelectCompany
              :companies="companies.allCompanies"
              @on-change-select="onChangeCompanySelectHandler"
            />
            <!-- TOOLTIP COMPANY-->
            <template v-if="!companyId">
              <BaseTooltip>{{tooltips.companySelect}}</BaseTooltip>
            </template>
          </v-row>
        </template>
        <v-divider />
        <v-col v-show="companyIsSelected">
          <v-card-title>
            <v-row align="baseline" justify="space-between">
              <!-- SEARCH -->
              <v-col class="pl-6" cols="4">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>

              <!-- SELECT PERSONA STATUS -->
              <v-col cols="4">
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

              <!-- CREATE PERSONA -->
              <v-col cols="4">
                <v-dialog
                  v-model="dialog.addNewPersona"
                  persistent
                  max-width="800px"
                  :retain-focus="false"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" v-on="on">Create new persona</v-btn>
                  </template>
                  <PersonaCreateNew @close="onCloseDialog" :companyId="this.companyId"></PersonaCreateNew>
                </v-dialog>
              </v-col>
            </v-row>
            <!-- / CREATE PERSONA -->
            <!-- TABLE -->
          </v-card-title>
          <v-data-table :headers="headers" :items="items" :search="search" :item-key="items.id">
            <!-- TOOLTIPS FOR HEADER -->
            <template v-slot:header.edit="{ header }">
              <BaseTooltip>{{tooltips.editPersona}}</BaseTooltip>
              {{header.text}}
            </template>
            <template v-slot:header.delete="{ header }">
              <BaseTooltip>{{tooltips.deletePersona}}</BaseTooltip>
              {{header.text}}
            </template>
            <!-- STATUS CHIP-->
            <template v-slot:item.status="{ item }">
              <!-- <StatusSwitch :status="item.active" @change="setPersonaStatus(item.id)"/> -->
              <StatusChip :status="item.active" @change="setPersonaStatus(item.id)"/>
              <!-- <v-chip
                pill
                @click="setPersonaStatus(item.id)"
                :text-color="getStatusColor(item.active)"
              >
                <v-avatar left :color="getStatusColor(item.active)">
                  <v-icon v-if="item.active">check</v-icon>
                  <v-icon v-else="item.active">close</v-icon>
                </v-avatar>
                {{item.status}}
              </v-chip> -->
            </template>
            <!-- / STATUS -->

            <!-- EDIT PERSONA -->
            <template v-slot:item.edit="{item}">
              <!-- NAVIGATE TO CUSTOM FIELDS PAGE -->
              <v-icon large color="blue darken-2" @click="onEditPersona(item.id)">mdi-table-edit</v-icon>
            </template>

            <!-- DELETE PERSONA -->
            <template v-slot:item.delete="{item}">
              <!-- DIALOG FOR DELETE -->
              <v-dialog
                v-model="dialog.deletePersona"
                persistent
                max-width="400px"
                :retain-focus="false"
              >
                <template v-slot:activator="{ on }">
                  <v-icon
                    large
                    color="error"
                    v-on="on"
                    @click="setSelectedPersona(item.id)"
                  >mdi-delete</v-icon>
                </template>
                <BaseDialogConfirmation
                  @close="()=>dialog.deletePersona=false"
                  @submit="onDeletePersonadHandler(item.id)"
                >
                  <template v-slot:header>Delete persona : {{selectedPersona.name}}</template>
                  <template v-slot:body>Are you sure you want to delete this persona ?</template>
                </BaseDialogConfirmation>
              </v-dialog>
            </template>
          </v-data-table>
        <!-- //TABLE -->
        </v-col>
      </v-card>
    </v-container>
  </v-app>
</template>


<script>

import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import PersonaCreateNew from './Persona/PersonaCreateNew'
import StatusChip from '../../components/status/StatusChip'
import StatusSwitch from '../../components/status/StatusSwitch'

const defaultStatus = function() {
  return { active: null, text: 'All', color: 'blue', letter: '' }
}
export default {
  components: {
    PersonaCreateNew,
    StatusChip,
    StatusSwitch
  },
  data() {
    return {
      companyChange: false,
      search: '',
      error:null,
      headers: [
        { text: 'Edit', value: 'edit' },
        { text: 'Persona', value: 'name' },
        { text: 'Status', value: 'status',fixed: true, width: '150px' },
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
      dialog: {
        addNewPersona: false,
        deletePersona: false
      },
      tooltips: {
        companySelect: 'You must select company first !',
        setStatus: 'Place where you change status of persona.',
        editPersona: 'Click on the icon and change data for selected persona.',
        deletePersona: 'Delete selected persona.'
      }
    }
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    console.log("persona page before")
    store.dispatch('companies/loadAllCompanies')
    .then(
      () => {
      next(
        function(vm) {
        //Dobijanje companyId pri povratku sa PersonaDetail
          if (!vm.companyId) {
            vm.companyId = vm.$store.state.companies.selectedCompanyGUID
          }
         }
       )
    })
  },

  created() {
    store.dispatch('persona/getMasks')
  },

  methods: {
    setSelectedPersona(key) {
      console.log(`setovanje persone ${key}`)
      this.selectedPersona = this.mapPersonas().find(function(el) {
        return el.id === key
      })
      console.log("selektovana persona :",this.selectedPersona)
    },
    onChangeCompanySelectHandler(value) {
      console.log("odabrana kompanija",value)
      store.dispatch('companies/setCompanyId',value)
      store.dispatch('persona/getPersonasByCompanyGuid', this.companyIdString)
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
    getStatusColor(status) {
      const perStatus = this.personaStatus
      if (status) {
        return this.personaStatus[0].color
      }
      return this.personaStatus[1].color
    },

    onEditPersona(key) {
      this.personaId = key
      this.setSelectedPersona(key)
      const status=this.selectedPersona.active
      //Sprecavane editovanja neaktivne persone
      if (!status) {
        console.log("ulazi if")
          this.error = {
          type: 'error',
          message: `You can not edit inactive persona.`
        }
        return store.dispatch('notification/add', this.error)
      }
      this.$router.push({
        name: 'customFields',
        params: { personaId: this.personaId, companyId: this.companyId, active:this.selectedPersona.active }
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
      this.dialog.addNewPersona = value
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
          stringId: `ids=${p.id}`,
          companyIdString: `?companyId=${p.companyId}`
        }
      })
    }
  },

  computed: {
    ...mapState(['persona', 'companies','notification']),
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
      return this.companies.selectedCompanyGUID ? true : false
    },
    companyId: {
      get() {
        return this.companies.selectedCompanyGUID
      },
      set(newValue) {
        this.companies.selectedCompanyGUID = newValue
      }
    }
  },
  watch: {
    companyId: function(newValue, oldValue) {
      if (newValue != oldValue) {
        console.log('New value: ' + newValue + ', Old value: ' + oldValue)
        return (this.companyChange = true)
      }
    }
  }
}
</script>
<style scoped>
</style>