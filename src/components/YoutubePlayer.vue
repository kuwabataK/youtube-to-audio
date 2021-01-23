<template>
  <div class="youtube">
    <div v-show="false" :id="ids.youtube" />
    <button @click="loadVideo('xhQc8VsXkWY', 49 * 60 + 31.9, 49 * 60 + 33.1)">
      おかゆボタン
    </button>
    <button @click="loadVideo('76ykVW5fiK8', 38 * 60 + 19.6, 38 * 60 + 21)">
      のんどこ
    </button>
    <button @click="loadVideo('76ykVW5fiK8', 38 * 60 + 30, 38 * 60 + 34)">
      たべとこ
    </button>
    <button @click="loadVideo('76ykVW5fiK8', 38 * 60 + 34.5, 38 * 60 + 35.5)">
      あれ?どこ?
    </button>
    <button @click="loadVideo('76ykVW5fiK8', 38 * 60 + 19.6, 38 * 60 + 37)">
      全部あくあ
    </button>
    <link-label
      title="テスト"
      url="https://www.youtube.com/watch?v=76ykVW5fiK8"
      :start="130"
      :end="140"
    />
    <button @click="() => yt.player.pauseVideo()">
      停止
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import useId from "@/Hooks/useId";
import useYoutube from "@/Hooks/useYoutube";
import LinkLabel from "./LinkLabel.vue";

export default defineComponent({
  components: { LinkLabel },
  name: "Home",
  setup() {
    const ids = useId(["youtube"]);
    const yt = useYoutube(ids.youtube);
    yt.isLoop = true;

    const loadVideo = async (videoId: string, start: number, end: number) => {
      const player = await yt.loadVideo(videoId, {
        playerVars: { start, end },
      });
      player.unMute();
      player.setPlaybackQuality("small");
    };
    const playVideo = (start: number) => {
      if (yt.player) {
        yt.player.seekTo(start, true);
        yt.player.unMute();
        yt.player?.playVideo();
      }
    };
    const generateURL = (id: string) => {
      return `https://www.youtube.com/watch?v=${id}`;
    };
    return {
      ids,
      yt,
      playVideo,
      loadVideo,
      generateURL,
    };
  },
});
</script>

<style lang="scss" scoped></style>
