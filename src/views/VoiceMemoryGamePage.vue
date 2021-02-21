<template>
  <div class="game-container">
    <memory-game-panel class="item" v-for="item in dataList" :key="item.id" :audioData="item" />
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, reactive } from "@vue/composition-api";
import StoreUtil from "@/store/StoreUtil";
import MemoryGamePanel from "@/components/memory-game/MemoryGamePanel.vue";
import { shuffle } from "@/Util";

export default defineComponent({
  name: "VoiceMemoryPage",
  components: {
    MemoryGamePanel,
  },
  setup() {
    const state = reactive({
      itemNum: 8,
      selectId: null,
    });

    const dataStore = StoreUtil.useStore("DataStore");
    const subaruList = computed(() => {
      return dataStore.state.dataSet.filter((data) => {
        return data.tag.includes("大空スバル");
      });
    });

    const dataList = computed(() => {
      const randam = shuffle(subaruList.value).slice(0, state.itemNum);
      return shuffle([...randam, ...randam]);
    });
    return {
      dataList,
    };
  },
});
</script>

<style lang="scss" scoped>
.game-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: auto;
  .item {
    margin: 5px;
  }
}
</style>
