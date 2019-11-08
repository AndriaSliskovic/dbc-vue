<template>
  <BaseLayer>
    <HelloWorld />
  <Status></Status>
  <status-chip></status-chip>
  </BaseLayer>
</template>

<script>
import HelloWorld from './HelloWorld'
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import Status from '../components/status/Status'
import StatusChip from '../components/status/StatusChip'
 
export default {
  data() {
    return {

    }
  },
  components: {
    HelloWorld,
    Status,
    StatusChip
  },


  methods: {
    ...mapActions('companies', ['loadAllCompanies'])
  },

  computed: {
    ...mapState({ companies: 'companies' })
  }
}
</script>

