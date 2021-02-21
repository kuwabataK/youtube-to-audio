<template>
  <div class="game-container">
    <memory-game-panel
      class="item"
      v-for="(item, i) in dataList"
      :key="item.id + i"
      :isSelected="state.selectIndex === i"
      :isHidden="isHidden(i)"
      :audioData="item"
      @click="selectItem(i)"
    />
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
      selectIndex: null as null | number,
      hiddenDataIndexs: [] as number[],
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

    const isHidden = (index: number) => {
      return state.hiddenDataIndexs.includes(index);
    };

    return {
      state,
      dataList,
      isHidden,
      selectItem(index: number) {
        if (index === state.selectIndex) return;
        if (state.selectIndex == null) {
          state.selectIndex = index;
        } else {
          if (dataList.value[state.selectIndex].id === dataList.value[index].id) {
            state.hiddenDataIndexs.push(index);
            state.hiddenDataIndexs.push(state.selectIndex);
          }
          state.selectIndex = null;
        }
      },
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
