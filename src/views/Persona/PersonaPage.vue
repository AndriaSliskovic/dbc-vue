<template>
  <v-app id="inspire">
    <v-container>
      <h3>Personae page</h3>
      <v-col>
        <form>
          <v-flex xs12 sm6 d-flex data-app>
            <v-select
              :items="persona.companies.SiteCustomersList"
              name="company"
              item-text="CompanyName"
              filled
              return-object
              label="Company"
              hint="Select company"
              persistent-hint
              v-model="selectedCompany"
              @change="setSelectedCompany"
            ></v-select>
          </v-flex>
        </form>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>
            Personae
            <div class="flex-grow-1"></div>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
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
          </v-card-title>
          <v-data-table :headers="headers" :items="items" :search="search" :item-key="items.id">
            <template v-slot:item.status="{ item }">
              <v-btn
                small
                :color="getStatusColor(item.active)"
                dark
                @click="itemClickHandler(item.id)"
              >{{item.status}}</v-btn>
            </template>
            <template v-slot:item.edit="{item}">
              <v-icon large color="blue darken-2" @click="editClickHandler(item.id)">mdi-table-edit</v-icon>
            </template>
          </v-data-table>
        </v-card>
        <!-- /Tabela -->
      </v-col>
    </v-container>
  </v-app>
</template>
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

export default {
  data() {
    return {
      companies: null,
      selectedCompany: null,
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
        }
      ],
      personaStatus:[
        {
          active:true,
          text:"Active",
          color:"primary"
        },
        {
          active:false,
          text:"Inactive",
          color:'error'
        }],
        selectedStatus:null,
        personaId:null 
    }
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    store.dispatch('persona/loadHardCodedCompanies').then(response => {
      next()
    })
  },
    created() {
    this.companies = this.persona.companies
  },
  methods: {
    setSelectedCompany() {
      store.dispatch(
        'persona/getPersonasByCompanyGuid',
        this.companyId.stringId
      )
    },
    setSelectStatus(){
      const status=this.selectedStatus.active
      console.log(this.selectedStatus,status)
      const selectedItems=this.items.filter(i=>{
        return i.active===status
      })
      console.log(selectedItems)
      store.dispatch('persona/getPersonasByCompanyGuid',this.companyId.stringId)
      store.dispatch('persona/selectedPersonasStatus',selectedItems)
    },

    getStatusColor(status) {
      if (status) {
        return this.personaStatus[0].color
      }
      return this.personaStatus[1].color
    },
    itemClickHandler(key) {
      console.log('imam klik', key)
      const element = this.items.find(x => x.id === key)
      element.active = !element.active
      element.active
        ? (element.status = this.personaStatus[0].text)
        : (element.status = this.personaStatus[1].text)
    },
    editClickHandler(key) {
      this.personaId=key
      console.log(`klik key ${this.personaId}`)
      this.$router.push({ name: 'persona', params: { personaId: this.personaId,companyId:this.selectedCompany.CompanyGuid } })
    }
  },

  computed: {
    ...mapState({ persona: 'persona' }),
    companyId: function() {
      return {
        stringId: `companyId=${this.selectedCompany.CompanyGuid}`
      }
    },
    items: function() {
      if (this.persona.personas.length) {
        return this.persona.personas.map(p => {
          return {
            id: p.id,
            name: p.name,
            active: p.active,
            status: p.active ? this.personaStatus[0].text : this.personaStatus[1].text,
            companyId: p.companyId
          }
        })
      }

      return []
    }
  },

}
</script>
<style scoped>
</style>