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
    </v-main>
  </v-app>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "@vue/composition-api";

export default defineComponent({
  name: "Home",
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
  }
});
</script>
