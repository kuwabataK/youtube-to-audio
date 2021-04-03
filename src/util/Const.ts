import CreateVoicePage from "@/views/CreateVoicePage.vue";
import VoiceMemoryGamePage from "@/views/VoiceMemoryGamePage.vue";
export default {
  pageNames: {
    main: {
      path: "/",
      name: "V Button - Vtuber音声ボタン作成サイト",
      component: CreateVoicePage
    },
    about: {
      path: "/about",
      name: "About",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "../views/About.vue")
    },
    スバルボタン神経衰弱: {
      path: "/shuba-memory-game",
      name: "スバルボタン神経衰弱",
      component: VoiceMemoryGamePage
    }
  }
};
