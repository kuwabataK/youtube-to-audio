<template>
  <div class="game-page">
    <div class="buttons">
      <div class="button-container">
        <v-select
          width="150"
          cols="2"
          :items="diffStrList"
          :value="diffVal"
          @change="setDiffculty"
          label="難易度"
          outlined
        ></v-select>
        <v-btn class="mx-2" fab depressed color="primary" @click="reload">
          <v-icon dark>
            mdi-reload
          </v-icon>
        </v-btn>
      </div>
    </div>
    <div class="game-container">
      <memory-game-panel
        class="item"
        v-for="(item, i) in state.dataList"
        :key="item.id + i"
        :isSelected="isSelected(i)"
        :isHidden="isHidden(i)"
        :audioData="item"
        :style="itemStyle"
        @click="selectItem(i)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import AsyncLock from "async-lock";
import {
  defineComponent,
  computed,
  reactive,
  onMounted,
  onBeforeMount,
  watch,
} from "@vue/composition-api";
import StoreUtil from "@/store/StoreUtil";
import MemoryGamePanel from "@/components/memory-game/MemoryGamePanel.vue";
import { shuffle, sleep } from "@/Util";
import { AudioData } from "@/store/DataStore/DataStore";

const asyncLock = new AsyncLock();

const diffList = {
  アンリミデット: null,
  ノーマル: 8,
};

export default defineComponent({
  name: "VoiceMemoryPage",
  components: {
    MemoryGamePanel,
  },
  setup() {
    const dataStore = StoreUtil.useStore("DataStore");

    const state = reactive({
      dataList: [] as AudioData[],
      itemNum: 8 as null | number,
      selectIndex: null as null | number,
      hiddenDataIndexs: [] as number[],
      secondSelectIndex: null as null | number,
      cancelBtnWait: null as null | (() => void),
    });

    /**
     * スバルのボイスのみを抽出したリスト
     */
    const subaruList = computed(() => {
      return dataStore.state.dataSet.filter((data) => {
        return data.tag.includes("大空スバル");
      });
    });

    const createDataList = () => {
      const randam =
        state.itemNum != null
          ? shuffle(subaruList.value).slice(0, state.itemNum)
          : shuffle(subaruList.value);
      state.dataList = shuffle([...randam, ...randam]);
    };

    /**
     * リロードする
     */
    const reload = () => {
      state.selectIndex = null;
      state.hiddenDataIndexs = [];
      state.secondSelectIndex = null;
      state.cancelBtnWait = null;
      createDataList();
    };

    onMounted(() => {
      reload();
    });

    watch(
      () => subaruList.value,
      () => reload()
    );

    /**
     * 難易度を変更する
     */
    const setDiffculty = (level: keyof typeof diffList) => {
      state.itemNum = diffList[level];
      reload();
    };

    const diffStrList = Object.keys(diffList);
    const diffVal = computed(() => {
      return Object.entries(diffList)
        .map(([key, val]) => {
          if (val === state.itemNum) return key;
          return null;
        })
        .filter((k) => k)[0];
    });

    /**
     * 正解して非表示になったアイテムのリスト
     */
    const isHidden = (index: number) => {
      return state.hiddenDataIndexs.includes(index);
    };

    /**
     * アイテムの幅(と高さ)
     */
    const itemWidth = computed(() => {
      if (state.itemNum === 8) return "90px";
      return "40px";
    });

    const isSelected = (index: number) => {
      return state.selectIndex === index || state.secondSelectIndex === index;
    };

    return {
      state,
      isHidden,
      diffStrList,
      diffVal,
      setDiffculty,
      isSelected,
      itemStyle: computed(() => {
        return {
          width: itemWidth.value,
          height: itemWidth.value,
        };
      }),
      /**
       * アイテムを選択したときに発火するメソッド
       */
      async selectItem(index: number) {
        if (index === state.selectIndex) return;
        if (state.cancelBtnWait) {
          state.cancelBtnWait();
          state.cancelBtnWait = null;
        }
        return asyncLock.acquire("selectItem", async () => {
          if (state.selectIndex == null) {
            state.selectIndex = index;
          } else {
            state.secondSelectIndex = index;
            const { awaiter, cancel } = sleep(2000);
            state.cancelBtnWait = cancel;
            await awaiter;
            if (state.dataList[state.selectIndex].id === state.dataList[index].id) {
              state.hiddenDataIndexs.push(index);
              state.hiddenDataIndexs.push(state.selectIndex);
            }
            state.selectIndex = null;
            state.secondSelectIndex = null;
          }
        });
      },
      reload,
    };
  },
});
</script>

<style lang="scss" scoped>
.game-page {
  width: 100%;
  display: grid;
  place-items: center;
  .buttons {
    width: 100%;
    display: grid;
    place-items: center;
    .button-container {
      width: 400px;
      display: flex;
      flex-wrap: nowrap;
    }
  }
  .game-container {
    display: flex;
    flex-wrap: wrap;
    width: 400px;
    height: auto;
    .item {
      margin: 5px;
    }
  }
}
</style>
