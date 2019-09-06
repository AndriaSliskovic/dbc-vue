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
        <!-- <h3>Result</h3>
      <ul v-for="pers in this.items">
        <li>{{pers.name}}</li>
        </ul>-->
        <!-- Tabela -->

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

export default {
  data() {
    return {
      companies: null,
      selectedCompany: null,
      search: '',
      headers: [
        {
          text: 'check',
          value: 'active'
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
        text:"edit"
        }

      ]
    }
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    store.dispatch('persona/loadHardCodedCompanies').then(response => {
      next()
    })
  },
  methods: {
    setSelectedCompany() {
      store.dispatch(
        'persona/getPersonasByCompanyGuid',
        this.companyId.stringId
      )
    },
    getStatusColor(status) {
      console.log('usao')
      if (status) {
        return 'primary'
      }
      return 'error'
    },
    itemClickHandler(key) {
      console.log('imam klik',key)
      const element=this.items.find(x=>x.id===key)
      console.log(element.active)
      element.active=!element.active
      // element.status= () => p.active ? 'Active' : 'Inactive',
      element.active? element.status='Active': element.status='Inactive'
      // if(element.active){
      //   console.log("imam if")
      //   return element.status='Active'
      // }
      // console.log("neaktivan")
      // return element.status='Inactive'
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
            status: p.active ? 'Active' : 'Inactive',
            companyId: p.companyId
          }
        })
      }

      return []
    }
  },
  created() {
    this.companies = this.persona.companies
  }
}
</script>
<style scoped>
</style>