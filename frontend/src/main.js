import Vue from 'vue'
import App from './App.vue'
import VueCompositionApi from '@vue/composition-api';
import VueResize from 'vue-resize'

Vue.use(VueCompositionApi);
Vue.use(VueResize)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
