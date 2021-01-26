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
          <v-toolbar-title>V Button(仮)(α版)</v-toolbar-title>
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
        </v-app-bar>

        <v-main>
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

export default defineComponent({
  setup() {
    const { loadData } = StoreUtil.useStore("DataStore");
    const dataStore = StoreUtil.useStore("DataStore");
    const masterStore = StoreUtil.useStore("MasterStore");
    onMounted(async () => {
      loadYoutubeApi();
      loadData();
    });
    const state = reactive({
      drawer: false
    });
    const changeDrawer = () => {
      state.drawer = !state.drawer;
    };
    return {
      dataStore,
      state,
      changeDrawer,
      router,
      masterStore
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
