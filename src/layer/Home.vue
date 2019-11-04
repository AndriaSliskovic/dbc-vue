<template>
  <BaseLayer>
    <HelloWorld />
  <BasePageTitle></BasePageTitle>
  </BaseLayer>
</template>

<script>
import HelloWorld from './HelloWorld'
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
export default {
  data() {
    return {

    }
  },
  components: {
    HelloWorld
  },

  beforeRouteEnter(routeTo, routeFrom, next) {
    //Nema this u beforeRouteEnter
    // this.loadAllCompanies()
    store.dispatch('companies/loadAllCompanies').then(response => {
      next(
        //Dobijanje companyId pri povratku sa PersonaDetail
        function(vm) {
          if (!vm.companyId) {
            vm.companyId = vm.$store.state.companies.selectedCompanyGUID
          }
        }
      )
    })
  },
  methods: {
    ...mapActions('companies', ['loadAllCompanies'])
  },

  computed: {
    ...mapState({ companies: 'companies' })
  }
}
</script>

