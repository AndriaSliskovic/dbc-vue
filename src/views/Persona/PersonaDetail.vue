<template>
  <v-app id="inspire">
    <v-container>
      <h3>Persona detail</h3>
      <p>persona id : {{this.personaGuid}}</p>
      <p>company id : {{this.companyGuid}}</p>
      <v-card>
        <form>
          <v-row>
            <v-col cols="6" sm="4" md="3">
              <v-text-field solo v-model="personaObject.name"></v-text-field>
            </v-col>
            <v-col>
              <v-select
                :items="persona.companies.SiteCustomersList"
                name="company"
                item-text="CompanyName"
                filled
                return-object
                label="Company"
                :hint="hintSelectCompany"
                persistent-hint
                v-model="selectedCompany"
                @change="setSelectedCompany"
              ></v-select>
            </v-col>
            <v-col>
              <v-btn small color="error">Save changes</v-btn>
            </v-col>
          </v-row>
        </form>
      </v-card>
      <v-col>
        <v-card>
          <v-data-table :headers="headers" :items="this.persona.customFields" :search="search"  >
            <template v-slot:item.edit="{item}">
              <v-icon large color="blue darken-2" @click="editClickHandler(item.id)" @click.stop="openDialog = true" >mdi-table-edit</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-btn @click="cancelHandler">Cancel</v-btn>
        </v-card>
      </v-col>
      <!-- DIALOG -->

      <!-- / DIALOG -->
    </v-container>
  </v-app>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import PersonaDeatilDialog from './PersonaDetailDialog'

export default {
  components: {
    PersonaDeatilDialog
  },
  data() {
    return {
      personaGuid: this.$route.params.personaId,
      selectedCompany: null,
      personaName: null,
      headers: [
        { text: 'Edit', value: 'edit' },
        { text: 'Rank', value: 'rank' },
        { text: 'Name', value: 'name' },
        { text: 'Category', value: 'category' },
        { text: 'Type', value: 'id' }
      ],
      search: '',
      customFields: [],
      openDialog: false,

    }
  },
  mounted() {},
  beforeMount() {
    //console.log(`beforeEnter ${this.$route.params.personaId}`, `guid : ${this.personaGuid}`)
    store.dispatch('persona/getCustomFieldsByPersonaId', this.personaGuid)
    store.dispatch('persona/getCompanyIdByPersonaId', this.personaGuid)
    store.dispatch('persona/loadHardCodedCompanies')
  },
  beforeUpdate() {
 
  },
  updated() {

  },
  created() {
  },
  methods: {
    setSelectedCompany() {
      //Ukoliko se prvi put selektuje nova kompanija a nije promenjen name uzima inicijalnu vrednost za name
      if (!this.personaName.value) {
        //console.log('prvi put setuje')
      }
      this.selectedStatus = defaultStatus
      //Dohvatanje persona
      store.dispatch(
        'persona/getPersonasByCompanyGuid',
        this.companyId.stringId
      )
      //Setovanje Company guida u centralni store
      store.dispatch('persona/setCompanyGuid', this.selectedCompany.CompanyGuid)
    },
    cancelHandler() {
      //console.log('imam cancel')
      this.$router.go(-1)
    },
    editClickHandler(id) {
      //console.log(`kliknuto ${id}`)
    }
  },
  computed: {
    ...mapState({ persona: 'persona' }),
    companyGuid: function() {
      return this.persona.companyGuid
    },
    personaObject: function() {
      if(!this.persona.personaObject) {
        return {
          name : "",
          id : "id",
          companyId : "asd"
        }
      }
      return this.persona.personaObject
    },
    initialPersonaName: function() {
      return this.personaObject ? this.personaObject.name : null
    },
    hintSelectCompany: function() {
      return `Change company for ${this.personaName} persona`
    },
    items: function() {
      return this.customFields
    }
  }
}
</script>
<style lang="less" scoped>
</style>