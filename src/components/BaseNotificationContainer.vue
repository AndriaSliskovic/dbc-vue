 <template>
      <div class="notification-container pr-1">
        <NotificationBar
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
        />
      </div>
    </template>
    
    <script>
    import NotificationBar from './NotificationBar'
    import { mapState } from 'vuex'
    
    export default {
      components: { NotificationBar },
      computed: mapState('notification', ['notifications'])
     }
    </script>
    
    <style scoped>
    .notification-container {
      height: 50px;      
    }
    </style>