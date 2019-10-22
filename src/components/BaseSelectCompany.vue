<template>
    <!-- <h4>{{companies}}</h4> -->
    <v-flex xs12 sm10 d-flex data-app>
      <v-select
        :items="companies"
        name="company"
        item-text="CompanyName"
        item-value="CompanyGUID"
        outlined
        label="Company"
        hint="Select company"
        persistent-hint
        menu-props="auto"
        v-model="companyId"
        @change="setSelectedCompany"
      ></v-select>
    </v-flex>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
export default {
  data() {
    return {
      companyId: null
    }
  },
  props: {
    companies: {
      type: Array
    },
  },
  beforeMount(){
    if (this.company.selectedCompanyGUID) {
      console.log(`before mount compID : ${this.company.selectedCompanyGUID}`)
      this.companyId=this.company.selectedCompanyGUID
    }
  },
  methods: {
    ...mapActions('companies', ['setCompanyId']),
    setSelectedCompany() {
      this.setCompanyId(this.companyId)
      this.$emit('on-change-select',this.companyId)
    }
  },
  computed:{
        ...mapState({company:'companies'}),
  }
}
</script>