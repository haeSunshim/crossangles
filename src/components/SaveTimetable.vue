<template>
  <v-btn
    outline
    round
    large
    color="secondary"
    class="fixed-width"
    @click="$emit('save')"
  >
    <span v-if="!saving">
      Save as Image
    </span>
    <v-progress-circular
      v-else
      indeterminate
      :size="24"
      :width="3"
    />
  </v-btn>
</template>

<script>
  export default {
    props: {
      saving: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style>
  .v-btn.fixed-width {
    min-width: 175px;
  }
</style>
