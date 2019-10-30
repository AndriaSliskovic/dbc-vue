<template>
  <BaseLayer>
    <HelloWorld />
  <BasePageTitle></BasePageTitle>
  </BaseLayer>
</template>

<script>
import HelloWorld from '../components/HelloWorld'
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
export default {
  data() {
    return {
      prom: 'lala'
    }
  },
  components: {
    HelloWorld
  },

  beforeRouteEnter(routeTo, routeFrom, next) {
    store.dispatch('companies/loadAllCompanies').then(response => {
      next(
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

