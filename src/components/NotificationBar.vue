 <template>
    <v-alert :type="messageType" >
    <p>{{ notification.message }}</p>
    </v-alert>
</template>
    
    <script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      timeout: null,
      messageType:this.notification.type
    }
  },
  mounted() {
    this.timeout = setTimeout(() => this.remove(this.notification), 5000)
  },
  beforeDestroy() {
    clearTimeout(this.timeout)
  },

  props: {
    notification: {
      type: Object,
      required: true
    }
  },

  methods: mapActions('notification', ['remove']),
  computed: {
    notificationTypeClass() {
      return `text-${this.notification.type}`
    }
  }
}
</script>
    
    <style scoped>
.notification-bar {
  margin: 1em 0 1em;
}
</style>