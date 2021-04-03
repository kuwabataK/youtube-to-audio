<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click="changeDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
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
      v-if="isShowPlayerShowSwitch"
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
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import StoreUtil from "@/store/StoreUtil";
import { isMobile } from "@/Util";
import CommonPlayer from "@/components/CommonPlayer.vue";
import CommonModal from "@/components/CommonModal.vue";
import Const from "@/util/Const";

export default defineComponent({
  components: {
    CommonPlayer,
    CommonModal
  },
  setup() {
    const dataStore = StoreUtil.useStore("DataStore");
    const loginStore = StoreUtil.useStore("LoginStore");
    const youtubeStore = StoreUtil.useStore("YoutubeStore");
    const commonStore = StoreUtil.useStore("CommonStore");
    const changeDrawer = () => {
      commonStore.changeOpenSideBar(!commonStore.isOpenSideBar.value);
    };

    const title = computed(() => {
      const currentPath = commonStore.state.currentPath;
      return Object.values(Const.pageNames).find(
        page => page.path === currentPath
      )?.name;
    });

    return {
      title,
      loginStore,
      get isLogin() {
        return loginStore.isLogin;
      },
      get isShowLoginBtn() {
        return !isMobile();
      },
      dataStore,
      changeDrawer,
      youtubeStore,
      isShowPlayerShowSwitch: computed(() => {
        return !isMobile();
      })
    };
  }
});
</script>

<style lang="scss" scoped></style>
