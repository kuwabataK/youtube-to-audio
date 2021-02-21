import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import CreateVoicePage from "@/views/CreateVoicePage.vue";
import VoiceMemoryGamePage from "@/views/VoiceMemoryGamePage.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "V Button - Vtuber音声ボタン作成サイト",
    component: CreateVoicePage
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/shuba-memory-game",
    name: "Memory Game",
    component: VoiceMemoryGamePage
  }
];

const router = new VueRouter({
  routes
});

export default router;
