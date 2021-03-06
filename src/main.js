import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'

navigator.serviceWorker.getRegistrations(registrations => {
  for (let registration of registrations) {
    registration.unregister()
  }
})

// import { registerSW } from './registerServiceWorker'

// registerSW({
//   updated (registration) {
//     store.commit('updateAvailable', true)
//     store.commit('serviceWorker', registration)
//   }
// })

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
