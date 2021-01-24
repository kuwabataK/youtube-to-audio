import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import VueCompositionAPI from "@vue/composition-api";
import StoreUtil from "./store/StoreUtil";

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);

// ストアを作成する
StoreUtil.generateStore()

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
