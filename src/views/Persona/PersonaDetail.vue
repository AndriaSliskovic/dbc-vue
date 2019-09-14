<template>
  <v-app id="inspire">
    <v-container>
      <p>persona id : {{personaId}}</p>
      <p>companyId : {{companyId}}</p>
      <!-- PREKO CENTRALNOG STOREA -->
      <div>
        Companies :
        <ul v-for="c in this.persona.companies.SiteCustomersList">
          <li>{{c.CompanyName}}</li>
        </ul>
      </div>

      <!-- PREKO CENTRALNOG STOREA -->
      <div>Persona name - STORE: {{this.persona.personaObject.name}}</div>
      <!-- PREKO COPUTED PROPERTIJA -->
      <div>Persona name - COMPUTED : {{personaName}}</div>
      <!-- PREKO SETOVANOG LOKALA -->
      <div>Persona name - LOKAL : {{perName}}</div>
      <!-- PREKO CENTRALNOG STOREA -->
      <div>
        Custom Fields - STORE :
        <ul v-for="cf in this.persona.customFields">
          <li>{{cf.name}}</li>
        </ul>
      </div>
      <!-- PREKO COPUTED PROPERTIJA -->
      <div>
        Custom Fields - COMPUTED :
        <ul v-for="cf in customFields">
          <li>{{cf.name}}</li>
        </ul>
      </div>
      <!-- PREKO SETOVANOG LOKALA -->
      <div>
        Custom Fields - LOKAL :
        <ul v-for="cf in custFields">
          <li>{{cf.name}}</li>
        </ul>
      </div>
      <div>
        <v-btn @click="()=>this.$router.go(-1) ">Go back</v-btn>
      </div>
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
      personaId: null,
      companyId: null,
      companies: [],
      perName:'',
      custFields:[],


    }
  },
  beforeRouteEnter(routeTo, routeFrom, next) {
    store.dispatch('persona/loadHardCodedCompanies').then(response => {
      next()
    })
  },
  created() {
    //Kreiranje pocetnih parametara
    this.personaId = this.$route.params.personaId
    this.companyId = this.$route.params.companyId
    //Ucitavanje kompanija
    //console.log(this.persona.companies.SiteCustomersList)
    this.companies = this.persona.companies.SiteCustomersList
    //Dobijanje persona objekta
    console.log(this.personaId)
    store.dispatch('persona/getSelectedPersonaByPersonaId', this.personaId)
    //.then(console.log(this.persona.personaObject))
    store.dispatch('persona/getCustomFieldsByPersonaID', this.personaId)
      .then((this.customFields = this.persona.customFields))
  },
  beforeMount() {
    //Pokusavam da setujem lokalne vrednosti iz centralnog storea koje su ubacene u create i da ih renderuje
    this.perName=this.persona.personaObject.name
    this.custFields=this.persona.customFields
  },

  methods: {
    goBack: function() {
      return this.$router.go(-1)
    }
  },
  computed: {
    ...mapState({ persona: 'persona' }),
    personaName: function() {
      return this.persona.personaObject.name
    },
    // customFields: function() {
    //   return this.persona.customFields
    // },
        customFields: 
        {
          get:function(){
            return this.persona.customFields
          },
          set:function(newValue){

          }
        }
  }
}
</script>
<style lang="less" scoped>
</style>