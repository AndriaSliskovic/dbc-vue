<template>
  <v-row dense justify="center">
    <v-btn
      color="secondary"
      @click="onClose"
      v-show="cancelVisible"
    >
      <slot>Cancel</slot>
    </v-btn>
    <v-btn color="primary" @click="onSubmit" :disabled="disabledSubmit" >
      <slot name="submit">Confirm</slot>
    </v-btn>
  </v-row>
</template>
<script>
export default {
  props: {
    cancelVisible: {
      default: true,
      type: Boolean
    },
    closeOnSubmit:{
      default:true,
      type:Boolean
    },
    disabledSubmit:{
      default:false,
      type:Boolean
    }
  },
  methods: {
    onClose() {
      this.$emit('close', false)
    },
    onSubmit() {
      this.$emit('submit')
      if (this.closeOnSubmit) {
        this.$emit('close', false)
      }

    }
  }
}
</script>