<template>
  <div></div>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, onMounted } from "@vue/composition-api";
import CreateVoiceModal from "@/components/CreateVoiceModal.vue";
import LinkLabel from "@/components/LinkLabel.vue";
import StoreUtil from "@/store/StoreUtil";
import { sleep, canPlayAudio, isMobile } from "@/Util";

export default defineComponent({
  name: "VoiceMemoryPage",
  components: {
    CreateVoiceModal,
    LinkLabel,
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss">
.main-player {
  iframe {
    max-width: 100% !important;
  }
}
</style>
