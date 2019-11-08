<template>
  <div>
    <v-switch v-model="active" :label="statusProp.text" :color="statusProp.color">
      <template v-slot:label v-if="active">
        <strong class="primary--text">active</strong>
      </template>
      <template v-slot:label v-else>
        <strong class="error--text">inactive</strong>
      </template>
    </v-switch>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: this.status,
      statusProperties: {
        active: {
          active: true,
          text: 'Active',
          color: 'primary'
        },
        inactive: {
          active: false,
          text: 'Inactive',
          color: 'red'
        }
      }
    }
  },

  props: {
    status: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    setPersonaStatus() {
      this.active = !this.active
      this.$emit('change', this.active)
    }
  },
  computed: {
    statusProp: function() {
      if (this.active) {
        return {
          color: this.statusProperties.active.color,
          text_color: this.statusProperties.active.color,
          text: this.statusProperties.active.text
        }
      } else {
        return {
          color: this.statusProperties.inactive.color,
          text_color: this.statusProperties.inactive.color,
          text: this.statusProperties.inactive.text
        }
      }
    }
  }
}
</script>