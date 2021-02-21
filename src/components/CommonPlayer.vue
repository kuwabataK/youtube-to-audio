<template>
  <div>
    <v-container>
      <v-col cols="12" v-show="youtubeStoreState.isShowVideo">
        <div class="main-player">
          <div :id="playerDivId" />
        </div>
      </v-col>
    </v-container>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "@vue/composition-api";
import CreateVoiceModal from "@/components/CreateVoiceModal.vue";
import StoreUtil from "@/store/StoreUtil";
import { sleep } from "@/Util";

const firstVideoSourceId = "mZ0sJQC8qkE";

export default defineComponent({
  name: "CommonPlayer",
  components: {
    CreateVoiceModal
  },
  setup() {
    const {
      state: youtubeStoreState,
      yt,
      id: playerDivId
    } = StoreUtil.useStore("YoutubeStore");
    onMounted(async () => {
      // ロード完了から1秒待ってplayerを準備する
      await sleep(1000).awaiter;
      yt.loadVideo(firstVideoSourceId);
    });
    return {
      playerDivId,
      youtubeStoreState
    };
  }
});
</script>

<style lang="scss" scoped>
.main-player {
  iframe {
    max-width: 100% !important;
  }
}
</style>
