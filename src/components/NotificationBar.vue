 <template>
    <v-alert 
    :type="messageType"
    height="60"
    dense
     >
    <p>{{ notification.message }}</p>
    </v-alert>
</template>
    
    <script>
import { mapActions,mapState } from 'vuex'
export default {
  data() {
    return {
      timeout: null,
      messageType:this.notification.type
    }
  },
  mounted() {
    this.timeout = setTimeout(() => this.remove(this.notification), 3000)
  },
  beforeDestroy() {
    clearTimeout(this.timeout)
    //Hendlovanje redirekcije samo na error type
    if (this.notif.reload) {
      console.log(`reload ${this.notification.reload}`)
      this.$router.go()
    }
  },

  props: {
    notification: {
      type: Object,
      required: true
    }
  },

  methods: mapActions('notification', ['remove','reloadPage']),
  computed: {
    ...mapState({ notif: 'notification' }),
    notificationTypeClass() {
      return `text-${this.notification.type}`
    }
  }
}
</script>
    
    <style scoped>
.notification-bar {

  margin: 2em 0 1em;
}
</style>
