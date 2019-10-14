<template>
    <div class="field">
        <h3>input</h3>
        <label v-if="label">{{ label }}</label>
    <input :value="value" @input="updateValue" v-bind="$attrs">
      </div>
</template>

<script>
export default {
inheritAttrs: false,
props: {
        value: [String, Number],
        label: String
      }, 
      methods:{
          //metod za vracanje vrednosti unete u input
          updateValue(event){
              this.$emit('input',event.target.value)
          }
      }
}
</script>

<style>

</style>
