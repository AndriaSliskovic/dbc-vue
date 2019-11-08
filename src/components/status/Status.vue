<template>
  <div>
    <v-switch v-model="active" :label="statusProp.text" :color="statusProp.color">
      <template v-slot:label v-if="active">
        <strong class="[statusProp.color]--text">active</strong>
      </template>
      <template v-slot:label v-else>
        <strong class="error--text">inactive</strong>
      </template>
    </v-switch>
    <v-chip @click="setPersonaStatus" :color="statusProp.color" dark>
      <v-avatar>
        <v-icon v-if="active">done</v-icon>
        <v-icon v-else="!active">close</v-icon>
      </v-avatar>
      {{statusProp.text}}
    </v-chip>
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
          color: 'blue-grey lighten-1'
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