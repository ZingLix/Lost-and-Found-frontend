import Vue from 'vue/dist/vue.js'
import ElementUI from 'element-ui'
import App from './App.vue'
import './plugins/element.js'

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  render: h => h(App),
}).$mount('#app')

