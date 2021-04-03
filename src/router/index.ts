import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Const from "@/util/Const";
import CommonStore from "@/store/Common/CommonStore";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = Object.values(Const.pageNames);

const router = new VueRouter({
  routes
});

router.afterEach(to => {
  if (!CommonStore.value.state) return;
  CommonStore.value.state.currentPath = to.path;
});

export default router;
