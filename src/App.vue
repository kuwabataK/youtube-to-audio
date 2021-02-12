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
              <v-list-item-content @click="() => router.push('/about')">
                <v-list-item-title>About</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-app-bar app>
          <v-app-bar-nav-icon @click="changeDrawer"></v-app-bar-nav-icon>
          <v-toolbar-title>V Button - Vtuber音声ボタン作成サイト</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-responsive max-width="260">
            <v-text-field
              v-model="dataStore.state.searchText"
              dense
              outlined
              flat
              hide-details
              rounded
              solo-inverted
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-responsive>
          <v-spacer></v-spacer>
          <v-switch
            inset
            v-model="youtubeStore.state.isShowVideo"
            hide-details
            label="動画プレイヤーを表示"
          ></v-switch>
          <v-spacer></v-spacer>
          <v-btn v-if="isShowLoginBtn && !isLogin" @click="loginStore.login" outlined>
            ログイン
          </v-btn>
          <v-btn v-if="isShowLoginBtn && isLogin" @click="loginStore.logout" outlined>
            ログアウト
          </v-btn>
        </v-app-bar>

        <v-main>
          <common-player />
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
import { isMobile } from "./Util";
import CommonPlayer from "@/components/CommonPlayer.vue";

export default defineComponent({
  components: {
    CommonPlayer,
  },
  setup() {
    const { loadData } = StoreUtil.useStore("DataStore");
    const dataStore = StoreUtil.useStore("DataStore");
    const loginStore = StoreUtil.useStore("LoginStore");
    const youtubeStore = StoreUtil.useStore("YoutubeStore");
    onMounted(async () => {
      loadYoutubeApi();
      await loginStore.redirectLogin();
      loginStore.loadLoginedData();
      loadData();
    });
    const state = reactive({
      drawer: false,
    });
    const changeDrawer = () => {
      state.drawer = !state.drawer;
    };
    return {
      loginStore,
      get isLogin() {
        return loginStore.isLogin;
      },
      get isShowLoginBtn() {
        return !isMobile();
      },
      dataStore,
      state,
      changeDrawer,
      router,
      youtubeStore,
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
</style>
