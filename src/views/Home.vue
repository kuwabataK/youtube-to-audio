<template>
  <!-- メインの中身  -->
  <YoutubePlayer />
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
