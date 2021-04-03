import { computed, reactive } from "@vue/composition-api";
import { StoreBase, ValueType } from "../StoreBase";

/**
 * 表示するタグを管理するためのStore
 */
/* eslint-disable class-methods-use-this */
class CommonDialogStore implements StoreBase {
  createStore() {
    const state = reactive({
      isOpenSideBar: false,
      currentPath: "/"
    });

    /**
     * サイドバーの開閉状態
     */
    const isOpenSideBar = computed(() => {
      return state.isOpenSideBar;
    });

    const changeOpenSideBar = (isOpen: boolean) => {
      state.isOpenSideBar = isOpen;
    };

    return {
      state,
      isOpenSideBar,
      changeOpenSideBar
    };
  }
}

const value: ValueType<CommonDialogStore> = {};

export default {
  createStore: new CommonDialogStore().createStore,
  value
};
