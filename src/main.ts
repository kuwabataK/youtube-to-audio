import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import VueCompositionAPI from "@vue/composition-api";
import StoreUtil from "./store/StoreUtil";
import { FireBaseUtil } from "./util/FireBaseUtil";
import { loadYoutubeApi } from "./Hooks/useYoutube";

loadYoutubeApi();

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);

// ストアを作成する
StoreUtil.generateStore();

export const fireBaseUtil = new FireBaseUtil();

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
