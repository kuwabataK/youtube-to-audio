<template>
  <div id="app">
    <div id="nav">
      <v-app>
        <v-navigation-drawer v-model="state.drawer" app>
          <v-list>
            <v-list-item link>
              <v-list-item-content @click="() => router.push('/')">
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-content @click="() => router.push('/create')">
                <v-list-item-title>Create Voice Button</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-content @click="() => router.push('/setting')">
                <v-list-item-title>Setting</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-content @click="() => router.push('/about')">
                <v-list-item-title>About</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-app-bar app>
          <v-app-bar-nav-icon @click="changeDrawer"></v-app-bar-nav-icon>

          <v-toolbar-title>Holo Button(非公式)</v-toolbar-title>
        </v-app-bar>

        <v-main>
          <div class="main-player" v-show="masterStore.state.isShowVideo">
            <div :id="yt.id" />
          </div>
          <router-view />
        </v-main>
      </v-app>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "@vue/composition-api";
import { loadYoutubeApi } from "./Hooks/useYoutube";
import StoreUtil from "./store/StoreUtil";
import router from "@/router/index";
import { sleep } from "./Util";

const firstVideoSourceId = "mZ0sJQC8qkE";

export default defineComponent({
  setup() {
    const yt = StoreUtil.useStore("YoutubeStore");
    const { loadData } = StoreUtil.useStore("DataStore");
    const masterStore = StoreUtil.useStore("MasterStore");
    onMounted(async () => {
      loadYoutubeApi();
      loadData();
      await sleep(1000);
      yt.yt.loadVideo(firstVideoSourceId);
    });
    const state = reactive({
      drawer: false,
    });
    const changeDrawer = () => {
      state.drawer = !state.drawer;
    };
    return {
      yt,
      state,
      changeDrawer,
      router,
      masterStore,
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.main-player {
  iframe {
    width: 100% !important;
  }
}
</style>

<style lang="scss" scoped>
.player {
  max-width: 100%;
  // height: 180px;
  display: grid;
  place-items: center;
}
</style>
