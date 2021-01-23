import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import VueCompositionAPI from "@vue/composition-api";

// eslint-disable @typescript-eslint/no-var-requires
const VueYoutube = require("vue-youtube");

Vue.config.productionTip = false;

Vue.use(VueCompositionAPI);

Vue.use(VueYoutube);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
