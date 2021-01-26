import { computed, reactive, watch } from "@vue/composition-api";
import { StoreBase, ValueType } from "../StoreBase";
import dataJson from "@/assets/data/data.json";

export type AudioData = {
  id: string;
  title: string;
  tag: string[];
  color?: string;
  start: number;
  end: number;
  videoId: string;
  isOwnData?: boolean;
};

/**
 * 表示するタグを管理するためのStore
 */
/* eslint-disable class-methods-use-this */
class DataStore implements StoreBase {
  createStore() {
    const state = reactive({
      dataSet: [] as AudioData[],
      showOnlyUserData: false,
      searchText: ""
    });
    const searchTexts = computed(() => {
      return state.searchText.split(/[\u{20}\u{3000}]/u);
    });
    const loadData = () => {
      try {
        const dataSet = localStorage.getItem("_DATA_SET_");
        if (dataSet) {
          state.dataSet = JSON.parse(dataSet);
        }
      } catch (_) {
        console.error("ロードに失敗しました");
      }
    };
    const saveData = () => {
      try {
        localStorage.setItem("_DATA_SET_", JSON.stringify(state.dataSet));
      } catch (_) {
        console.error("Saveに失敗しました");
      }
    };
    const dataSet = computed(() => {
      if (state.showOnlyUserData)
        return state.dataSet.map(d => ({ ...d, isOwnData: true }));
      return [
        ...dataJson,
        ...state.dataSet.map(d => {
          return {
            ...d,
            isOwnData: true
          };
        })
      ];
    });
    const filteredDataSet = computed(() => {
      return dataSet.value.filter(d => {
        if (searchTexts.value.length === 0) return true;
        return searchTexts.value.every(t => {
          if (d.title.indexOf(t) !== -1) return true;
          if (d.tag.some(tag => tag.indexOf(t) !== -1)) return true;
          return false;
        });
      });
    });
    const dataSetOnlyUser = computed(() => {
      return state.dataSet;
    });
    watch(
      () => state.dataSet,
      () => {
        saveData();
      }
    );
    const setDataSet = (newDataSet: AudioData[]) => {
      state.dataSet = newDataSet;
    };
    const addData = (newData: AudioData) => {
      state.dataSet.push(newData);
    };
    const editData = (editedData: AudioData) => {
      const removedDataSet = state.dataSet.filter(d => d.id !== editedData.id);
      state.dataSet = [...removedDataSet, editedData];
    };
    return {
      state,
      dataSet,
      filteredDataSet,
      dataSetOnlyUser,
      loadData,
      setDataSet,
      addData,
      editData
    };
  }
}

const value: ValueType<DataStore> = {};

export default {
  createStore: new DataStore().createStore,
  value
};
