<template>
  <BaseLayer>
    <HelloWorld />

  </BaseLayer>
</template>

<script>
import HelloWorld from './HelloWorld'
import { mapState, mapActions } from 'vuex'
import store from '@/store/store'
import Playground from '../views/playground/Playground'

export default {
  data() {
    return {
      Playground
    }
  },
  components: {
    HelloWorld,
    Playground
  },

  methods: {
    ...mapActions('companies', ['loadAllCompanies'])
  },

  computed: {
    ...mapState({ companies: 'companies' })
  }
}
</script>

