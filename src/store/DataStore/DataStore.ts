import { computed, reactive } from "@vue/composition-api";
import { StoreBase, ValueType } from "../StoreBase";
import { fireBaseUtil } from "@/main";
import LoginStore from "../LoginStore/LoginStore";

export type AudioData = {
  id: string;
  title: string;
  tag: string[];
  color?: string;
  start: number;
  end: number;
  videoId: string;
  isOwnData?: boolean;
  isLocalData?: boolean;
  access: "private" | "public";
  createBy: string;
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
      searchText: "",
    });
    const searchTexts = computed(() => {
      return state.searchText.split(/[\u{20}\u{3000}]/u);
    });
    const loadLocalData = () => {
      try {
        const dataSet = localStorage.getItem("_DATA_SET_");
        if (dataSet) {
          state.dataSet = [
            ...state.dataSet,
            ...JSON.parse(dataSet).map((d: AudioData) => {
              return {
                ...d,
                isLocalData: true,
                isOwnData: false,
              };
            }),
          ];
        }
      } catch (_) {
        console.error("ロードに失敗しました");
      }
    };
    /**
     * localStorageとfirebaseからデータを取得する
     */
    const loadData = async () => {
      loadLocalData();
      const dataRef = fireBaseUtil.database.ref("/dataSet");
      const data = (await dataRef.once("value")).val();
      let privateData: Record<string, AudioData> = {};
      const userId = LoginStore.value.state?.user?.uid;
      if (userId) {
        const privateDataRef = fireBaseUtil.database.ref(`privateDataSet/${userId}/`);
        privateData = (await privateDataRef.once("value")).val();
      }
      const dataList = [
        ...Object.values((data as AudioData[]) || {}),
        ...Object.values(privateData || {}),
      ].map((d) => {
        return {
          ...d,
          get isOwnData() {
            return d.createBy === LoginStore.value.state?.user?.uid;
          },
        };
      });
      state.dataSet = [...state.dataSet, ...dataList];
    };
    /**
     * 自身のデータ
     */
    const dataSetOnlyUser = computed(() => {
      return state.dataSet.filter((d) => d.isOwnData);
    });
    /**
     * 画面で表示するデータ
     */
    const dataSet = computed(() => {
      if (state.showOnlyUserData) return dataSetOnlyUser.value;
      return state.dataSet;
    });
    /**
     * 検索後のデータ
     */
    const filteredDataSet = computed(() => {
      return dataSet.value.filter((d) => {
        if (searchTexts.value.length === 0) return true;
        return searchTexts.value.every((t) => {
          if (d.title.indexOf(t) !== -1) return true;
          if (d.tag.some((tag) => tag.indexOf(t) !== -1)) return true;
          return false;
        });
      });
    });
    /**
     * firebaseのデータを変更する
     * @param data
     */
    const changeFireBaseData = (data: AudioData) => {
      const postData = { ...data };
      delete postData.isOwnData;
      postData.isLocalData = false;
      const userId = LoginStore.value.state?.user?.uid;

      // publicとprivateで同じデータが存在しないようにするための制御を行う
      const updates: Record<string, AudioData | null> = {};
      updates[`privateDataSet/${userId}/` + data.id] = data.access === "private" ? postData : null;
      updates["dataSet/" + data.id] = data.access === "private" ? null : postData;
      return fireBaseUtil.database.ref().update(updates);
    };
    /**
     * 新しいデータを追加する
     * @param newData
     */
    const addData = (newData: AudioData) => {
      state.dataSet.push(newData);
      return changeFireBaseData(newData);
    };
    /**
     * 既存のデータを置き換える
     * @param editedData
     */
    const editData = (editedData: AudioData) => {
      const removedDataSet = state.dataSet.filter((d) => d.id !== editedData.id);
      state.dataSet = [...removedDataSet, editedData];
      return changeFireBaseData(editedData);
    };
    const deleteData = (id: string) => {
      state.dataSet = state.dataSet.filter((d) => d.id !== id);
      // publicとprivateで同じデータが存在しないようにするための制御を行う
      const userId = LoginStore.value.state?.user?.uid;
      const updates: Record<string, AudioData | null> = {};
      updates[`privateDataSet/${userId}/` + id] = null;
      updates["dataSet/" + id] = null;
      return fireBaseUtil.database.ref().update(updates);
    };
    return {
      state,
      dataSet,
      filteredDataSet,
      dataSetOnlyUser,
      loadData,
      addData,
      editData,
      deleteData,
    };
  }
}

const value: ValueType<DataStore> = {};

export default {
  createStore: new DataStore().createStore,
  value,
};
