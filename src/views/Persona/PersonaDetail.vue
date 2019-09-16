<template>
  <v-app id="inspire">
    <v-container>
      <!-- <p>persona id : {{personaId}}</p>
      <p>companyId : {{companyId}}</p>-->
      <!-- PREKO CENTRALNOG STOREA -->
      <v-card>
        <v-row>
          <v-col cols="4" md="4">
            <v-text-field v-model="personaName" label="Persona name"></v-text-field>
          </v-col>
          <v-col cols="4" md="4">
            <v-select
              v-model="editedCompany"
              :items="this.persona.companies.SiteCustomersList"
              return-object
              item-text="CompanyName"
              label="Companies"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="4" md="4">
            <v-btn color="primary" dark @click="editPersonaHandler()">Edit changes</v-btn>
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
            ></v-select> -->
          </v-card-title>
          <v-data-table :headers="headers" :items="items" :search="search" :item-key="items.id">
            <template v-slot:item.edit="{item}">
              <v-icon large color="blue darken-2" @click="editCustomFieldHandler(item.id)">mdi-table-edit</v-icon>
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
export default {
  data() {
    return {
      personaId: this.$route.params.personaId,
      companyId: this.$route.params.companyId,
      companies: [],
      editedCompany:null,
      search: '',
      headers: [
        {text: 'Edit',
         value: 'edit'},
        {text: 'Rank',
         value: 'rank'},
        {text: 'Name',
         value: 'name'},
        {text: 'Category',
         value: 'category'},
        {text: 'Type',
         value: 'type'},
      ]
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
    editedPersona:function(){
      if (!this.editedCompany) {
      return{
        personaId:this.personaId,
        name:this.persona.personaObject.name,
        companyId:this.companyId
      }
      }else{
      return{
        personaId:this.personaId,
        name:this.personaName,
        companyId:this.editedCompany.CompanyGuid
      }
      }
    },
    editPersonaHandler:function(){
      const editedPersona=this.editedPersona()
      console.log(`imam edit ${editedPersona.personaId}`)
      store.dispatch('persona/editPersonaData',editedPersona)
    },
    saveHandler(){
      console.log(`klik na save `)
    },
    editCustomFieldHandler(key){
      console.log(`edit Custom Field ${key}`)
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
        return this.persona.customFields ? this.persona.customFields : null
      }
    },
    items:function(){
      if (this.customFields) {
        return this.customFields.map(cf=>{
          return{
            id:cf.id,
            rank:cf.rank,
            name:cf.name,
            category:cf.category,
            type:cf.type

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