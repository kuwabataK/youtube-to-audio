import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueMeta from "vue-meta";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import VueCompositionAPI from "@vue/composition-api";
import StoreUtil from "./store/StoreUtil";
import { FireBaseUtil } from "./util/FireBaseUtil";

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);

Vue.use(VueMeta);

// ストアを作成する
StoreUtil.generateStore();

export const fireBaseUtil = new FireBaseUtil();

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
