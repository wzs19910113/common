// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import router from './router'
import $ from "jquery"
import NutUI from '@nutui/nutui'
import '@nutui/nutui/dist/nutui.css'

Vue.config.productionTip = false
NutUI.install(Vue)
Vue.use(VueRouter)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})
