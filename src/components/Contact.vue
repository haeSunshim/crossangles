<template>
  <v-dialog v-model="show" :max-width="700">
    <v-card>
      <v-card-title class="pb-2">
        <span class="headline">{{ title }}</span>
      </v-card-title>

      <v-card-text class="pt-0">
        <v-text-field v-model="name" label="Your Name" hide-details>
        </v-text-field>
        <v-text-field v-model="email" type="email" label="Your Email" hide-details>
        </v-text-field>
        <v-textarea v-model="body" label="What would you like us to know?" rows="4" :counter="5000">
        </v-textarea>
      </v-card-text>

      <v-card-actions>
        <v-btn block color="primary" @click="submit" :disabled="disabled">
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        name: null,
        email: null,
        body: null
      }
    },
    computed: {
      disabled () {
        return !this.name || !this.email || !this.body || this.body.length > 5000
      },
      show: {
        get () {
          return this.display
        },
        set (newValue) {
          if (!newValue) {
            this.$emit('hide')
          }
        }
      }
    },
    methods: {
      submit () {
        axios.post('https://' + process.env.DOMAIN + '/contact/', {
          name: this.name,
          email: this.email,
          body: this.body
        })
        this.$emit('hide')
      }
    },
    watch: {
      show () {
        // Reset all fields when dialog is hidden
        if (!this.show) {
          this.name = null
          this.email = null
          this.body = null
        }
      }
    },
    props: {
      title: {
        type: String,
        default: 'Get in Contact'
      },
      display: {
        type: Boolean,
        default: false
      }
    }
  }
</script>