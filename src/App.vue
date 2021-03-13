<template>
  <div id="app">
    <div id="nav">
      <v-app>
        <v-navigation-drawer v-model="isOpenSideBar" app>
          <v-list>
            <v-list-item link>
              <v-list-item-content @click="() => router.push('/')">
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-content
                @click="() => router.push('/shuba-memory-game')"
              >
                <v-list-item-title>神経衰弱</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-content @click="() => router.push('/about')">
                <v-list-item-title>About</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <Header />
        <v-main>
          <common-player />
          <router-view />
          <common-modal />
        </v-main>
      </v-app>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "@vue/composition-api";
import { loadYoutubeApi } from "./Hooks/useYoutube";
import StoreUtil from "./store/StoreUtil";
import router from "@/router/index";
import CommonPlayer from "@/components/CommonPlayer.vue";
import CommonModal from "@/components/CommonModal.vue";
import Header from "@/components/header/Header.vue";

export default defineComponent({
  components: {
    CommonPlayer,
    CommonModal,
    Header
  },
  setup() {
    const { loadData } = StoreUtil.useStore("DataStore");
    const loginStore = StoreUtil.useStore("LoginStore");
    const CommonStore = StoreUtil.useStore("CommonStore");
    onMounted(async () => {
      loadYoutubeApi();
      await loginStore.redirectLogin();
      loginStore.loadLoginedData();
      loadData();
    });
    const changeDrawer = () => {
      CommonStore.changeOpenSideBar(!CommonStore.isOpenSideBar.value);
    };

    const isOpenSideBar = computed({
      get() {
        return CommonStore.isOpenSideBar.value;
      },
      set(value: boolean) {
        CommonStore.changeOpenSideBar(value);
      }
    });

    return {
      loginStore,
      isOpenSideBar,
      changeDrawer,
      router
    };
  }
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
