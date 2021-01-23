<template>
  <v-app>
    <v-navigation-drawer v-model="state.drawer" app>
      <!-- サイドバーの中身  -->
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="changeDrawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <!-- メインの中身  -->
      <YoutubePlayer />
    </v-main>
  </v-app>
</template>
<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";
import YoutubePlayer from "@/components/YoutubePlayer.vue";

export default defineComponent({
  name: "Home",
  components: {
    YoutubePlayer,
  },
  setup() {
    const state = reactive({
      drawer: false,
    });
    const changeDrawer = () => {
      state.drawer = !state.drawer;
    };
    return {
      state,
      changeDrawer,
    };
  },
});
</script>
