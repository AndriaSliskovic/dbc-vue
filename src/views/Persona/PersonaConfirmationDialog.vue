<template>
    <v-card>
        <v-card-title class="headline">Potvrda delete !</v-card-title>

        <v-card-text>
          Are you shure you want to delete this custom field ?
        </v-card-text>

        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn
            color="green darken-1"
            text
            @click="onCloseDialogHandler"
          >
            Cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="onConfirmHandler"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
</template>
<script>
export default {
    data(){
        return{dialog:null} 
    },

    methods:{
      onCloseDialogHandler:function(){
        console.log("cancel button")
        this.dialog=false
        this.$emit('closeDialog',this.dialog)
      },
      onConfirmHandler:function(){
        //Logika za submitovanje forme
        console.log("Potvrdjivanje Akcije")
        this.dialog=false
        this.$emit('closeDialog',this.dialog)
      }
}
}
</script>