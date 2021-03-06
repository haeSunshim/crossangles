<template>
  <div>
    <v-layout
      row
      wrap
      align-center
    >
      <v-flex
        class="pb-2"
        :class="{
          'mb-1': $vuetify.breakpoint.smAndUp
        }"
      >
        <v-autocomplete
          ref="courseSelect"
          v-model="course"
          label="Select your courses"
          :filter="() => true"
          :search-input.sync="searchText"
          :items="items"
          item-value="key"
          return-object
          hide-selected
          hide-details
          no-data-text="No matching courses found"
          color="secondary"
          @input="addCourse"
        >
          <template
            slot="item"
            slot-scope="data"
          >
            <v-list-tile-content>
              <v-list-tile-title>
                <span
                  v-for="(part, i) in highlight(data.item.code, queryString)"
                  :key="'codePart' + i"
                  :class="{ 'highlight': part.em }"
                  v-text="part.text"
                />

                <span class="font-weight-light mx-1">—</span>

                <span
                  v-for="(part, i) in highlight(data.item.title, queryString)"
                  :key="'titlePart' + i"
                  class="font-weight-light"
                  :class="{ 'highlight': part.em }"
                  v-text="part.text"
                />

                <span
                  v-if="data.item.term"
                >
                  ({{ data.item.term }})
                </span>
              </v-list-tile-title>
            </v-list-tile-content>
          </template>
        </v-autocomplete>
      </v-flex>

      <v-tooltip
        left
        :open-delay="200"
      >
        <v-btn
          slot="activator"
          icon
          large
          flat
          color="primary"
          @click="$emit('custom')"
        >
          <v-icon>
            event
          </v-icon>
        </v-btn>

        <span>
          Add a Custom Event
        </span>
      </v-tooltip>
    </v-layout>
  </div>
</template>

<script>
  function escapeRegExp (string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  export default {
    data () {
      return {
        course: null,
        searchText: null,
        items: []
      }
    },
    computed: {
      chosen () {
        return this.$store.state.chosen
      },
      queryString () {
        return (this.searchText || '').toLowerCase().trim()
      },
      loading () {
        return this.$store.state.loading
      }
    },
    watch: {
      loading () {
        if (!this.loading) {
          window.setTimeout(() => {
            this.$refs.courseSelect.focus()
            this.updateItems()
          }, 100)
        }
      },
      queryString () {
        this.updateItems()
      }
    },
    mounted () {
      // NB: This is needed as well as the above loading watcher in case this
      // mounts after data has loaded and been processed
      this.$nextTick(() => this.$refs.courseSelect.focus())
    },
    methods: {
      addCourse () {
        // Check course has been set (this function is called when field is cleared too)
        if (this.course) {
          this.$store.dispatch('addCourse', this.course)
          window.dataLayer.push({
            event: 'add_course',
            label: this.course.key,
            color: this.course.color
          })

          // Clear current input
          this.$refs.courseSelect.reset()
          this.$refs.courseSelect.blur()
        }
      },
      updateItems () {
        let data = Object.values(this.$store.getters.courses)
        data = data.filter(c => this.courseFilter(c, this.queryString))

        data.sort((a, b) => {
          let aCode = a.code.toLowerCase()
          let bCode = b.code.toLowerCase()

          let alphaOrder = (aCode > bCode) - (aCode < bCode)

          if (this.queryString) {
            let matchesA = aCode.indexOf(this.queryString) === 0
            let matchesB = bCode.indexOf(this.queryString) === 0

            return (matchesB - matchesA) || alphaOrder
          }

          return alphaOrder
        })

        data.length = Math.min(data.length, 20)
        this.items = data;
      },
      courseFilter (course, queryText) {
        // Don't show courses we've already chosen
        if (this.chosen.includes(course)) {
          return false
        }

        // Check for a match in the course code
        if (course.code.toLowerCase().indexOf(queryText) !== -1) {
          return true
        }

        // Check for a match in the course name
        if (course.title.toLowerCase().indexOf(queryText) !== -1) {
          return true
        }

        return false
      },
      highlight (haystack, needle) {
        haystack = haystack.replace(/[<>]/gi, '')

        if (needle) {
          let re = new RegExp('(' + escapeRegExp(needle) + ')', 'gi')

          let parts = haystack.split(re).map(x => ({
            text: x,
            em: re.test(x)
          }))

          return parts
        }

        return [{
          text: haystack,
          em: false
        }]
      }
    }
  }
</script>

<style scoped>
  .faded {
    opacity: 0.7;
  }
</style>

<style>
  span.highlight {
    font-weight: 500 !important;
    text-decoration: none;
    font-style: normal;
  }
  span.highlight.faded {
    opacity: 0.9;
  }
</style>
